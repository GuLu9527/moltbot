import type { OpenClawConfig } from "../config/config.js";
import { resolveGatewayPort } from "../config/config.js";
import { findTailscaleBinary } from "../infra/tailscale.js";
import type { RuntimeEnv } from "../runtime.js";
import { zhCN } from "../i18n/zh-CN.js";
import { note } from "../terminal/note.js";
import { buildGatewayAuthConfig } from "./configure.gateway-auth.js";
import { confirm, select, text } from "./configure.shared.js";
import { guardCancel, randomToken } from "./onboard-helpers.js";

type GatewayAuthChoice = "token" | "password";

export async function promptGatewayConfig(
  cfg: OpenClawConfig,
  runtime: RuntimeEnv,
): Promise<{
  config: OpenClawConfig;
  port: number;
  token?: string;
}> {
  const portRaw = guardCancel(
    await text({
      message: zhCN.output.gatewayPort,
      initialValue: String(resolveGatewayPort(cfg)),
      validate: (value) => (Number.isFinite(Number(value)) ? undefined : "Invalid port"),
    }),
    runtime,
  );
  const port = Number.parseInt(String(portRaw), 10);

  let bind = guardCancel(
    await select({
      message: zhCN.output.gatewayBind,
      options: [
        {
          value: "loopback",
          label: "环回（仅本地）",
          hint: "绑定到 127.0.0.1 - 安全，仅本地访问",
        },
        {
          value: "tailnet",
          label: "Tailnet（Tailscale IP）",
          hint: "仅绑定到您的 Tailscale IP（100.x.x.x）",
        },
        {
          value: "auto",
          label: "自动（环回 → LAN）",
          hint: "优先环回；如果不可用则回退到所有接口",
        },
        {
          value: "lan",
          label: "LAN（所有接口）",
          hint: "绑定到 0.0.0.0 - 可从网络中的任何位置访问",
        },
        {
          value: "custom",
          label: "自定义 IP",
          hint: "指定特定 IP 地址，如果不可用则回退到 0.0.0.0",
        },
      ],
    }),
    runtime,
  ) as "auto" | "lan" | "loopback" | "custom" | "tailnet";

  let customBindHost: string | undefined;
  if (bind === "custom") {
    const input = guardCancel(
      await text({
        message: zhCN.output.customIpAddress,
        placeholder: zhCN.output.customIpPlaceholder,
        validate: (value) => {
          if (!value) return "IP address is required for custom bind mode";
          const trimmed = value.trim();
          const parts = trimmed.split(".");
          if (parts.length !== 4) return "Invalid IPv4 address (e.g., 192.168.1.100)";
          if (
            parts.every((part) => {
              const n = parseInt(part, 10);
              return !Number.isNaN(n) && n >= 0 && n <= 255 && part === String(n);
            })
          )
            return undefined;
          return "Invalid IPv4 address (each octet must be 0-255)";
        },
      }),
      runtime,
    );
    customBindHost = typeof input === "string" ? input : undefined;
  }

  let authMode = guardCancel(
    await select({
      message: zhCN.output.gatewayAuth,
      options: [
        { value: "token", label: "令牌", hint: "推荐默认值" },
        { value: "password", label: "密码" },
      ],
      initialValue: "token",
    }),
    runtime,
  ) as GatewayAuthChoice;

  const tailscaleMode = guardCancel(
    await select({
      message: zhCN.output.tailscaleExposure,
      options: [
        { value: "off", label: "关闭", hint: "无 Tailscale 暴露" },
        {
          value: "serve",
          label: "Serve",
          hint: "您的 tailnet 的私有 HTTPS（Tailscale 设备）",
        },
        {
          value: "funnel",
          label: "Funnel",
          hint: "通过 Tailscale Funnel 的公共 HTTPS（互联网）",
        },
      ],
    }),
    runtime,
  ) as "off" | "serve" | "funnel";

  // Detect Tailscale binary before proceeding with serve/funnel setup.
  if (tailscaleMode !== "off") {
    const tailscaleBin = await findTailscaleBinary();
    if (!tailscaleBin) {
      note(
        [
          "未在 PATH 或 /Applications 中找到 Tailscale 二进制文件。",
          "请从以下地址安装 Tailscale：",
          "  https://tailscale.com/download/mac",
          "",
          "您可以继续设置，但 serve/funnel 将在运行时失败。",
        ].join("\n"),
        "Tailscale 警告",
      );
    }
  }

  let tailscaleResetOnExit = false;
  if (tailscaleMode !== "off") {
    note(zhCN.output.tailscaleDocs, zhCN.output.tailscaleTitle);
    tailscaleResetOnExit = Boolean(
      guardCancel(
        await confirm({
          message: zhCN.output.resetTailscaleOnExit,
          initialValue: false,
        }),
        runtime,
      ),
    );
  }

  if (tailscaleMode !== "off" && bind !== "loopback") {
    note(zhCN.output.tailscaleRequiresLoopback, "Note");
    bind = "loopback";
  }

  if (tailscaleMode === "funnel" && authMode !== "password") {
    note(zhCN.output.tailscaleFunnelRequiresPassword, "Note");
    authMode = "password";
  }

  let gatewayToken: string | undefined;
  let gatewayPassword: string | undefined;
  let next = cfg;

  if (authMode === "token") {
    const tokenInput = guardCancel(
      await text({
        message: zhCN.output.gatewayTokenPrompt,
        initialValue: randomToken(),
      }),
      runtime,
    );
    gatewayToken = String(tokenInput).trim() || randomToken();
  }

  if (authMode === "password") {
    const password = guardCancel(
      await text({
        message: zhCN.output.gatewayPasswordPrompt,
        validate: (value) => (value?.trim() ? undefined : zhCN.output.inputRequired),
      }),
      runtime,
    );
    gatewayPassword = String(password).trim();
  }

  const authConfig = buildGatewayAuthConfig({
    existing: next.gateway?.auth,
    mode: authMode,
    token: gatewayToken,
    password: gatewayPassword,
  });

  next = {
    ...next,
    gateway: {
      ...next.gateway,
      mode: "local",
      port,
      bind,
      auth: authConfig,
      ...(customBindHost && { customBindHost }),
      tailscale: {
        ...next.gateway?.tailscale,
        mode: tailscaleMode,
        resetOnExit: tailscaleResetOnExit,
      },
    },
  };

  return { config: next, port, token: gatewayToken };
}
