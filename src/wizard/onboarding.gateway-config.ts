import { randomToken } from "../commands/onboard-helpers.js";
import type { GatewayAuthChoice } from "../commands/onboard-types.js";
import type { OpenClawConfig } from "../config/config.js";
import { findTailscaleBinary } from "../infra/tailscale.js";
import type { RuntimeEnv } from "../runtime.js";
import { zhCN } from "../i18n/zh-CN.js";
import type {
  GatewayWizardSettings,
  QuickstartGatewayDefaults,
  WizardFlow,
} from "./onboarding.types.js";
import type { WizardPrompter } from "./prompts.js";

type ConfigureGatewayOptions = {
  flow: WizardFlow;
  baseConfig: OpenClawConfig;
  nextConfig: OpenClawConfig;
  localPort: number;
  quickstartGateway: QuickstartGatewayDefaults;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
};

type ConfigureGatewayResult = {
  nextConfig: OpenClawConfig;
  settings: GatewayWizardSettings;
};

export async function configureGatewayForOnboarding(
  opts: ConfigureGatewayOptions,
): Promise<ConfigureGatewayResult> {
  const { flow, localPort, quickstartGateway, prompter } = opts;
  let { nextConfig } = opts;

  const port =
    flow === "quickstart"
      ? quickstartGateway.port
      : Number.parseInt(
          String(
            await prompter.text({
              message: zhCN.output.gatewayPort,
              initialValue: String(localPort),
              validate: (value) => (Number.isFinite(Number(value)) ? undefined : "Invalid port"),
            }),
          ),
          10,
        );

  let bind = (
    flow === "quickstart"
      ? quickstartGateway.bind
      : ((await prompter.select({
          message: zhCN.output.gatewayBind,
          options: [
            { value: "loopback", label: "环回 (127.0.0.1)" },
            { value: "lan", label: "LAN (0.0.0.0)" },
            { value: "tailnet", label: "Tailnet (Tailscale IP)" },
            { value: "auto", label: "自动 (环回 → LAN)" },
            { value: "custom", label: "自定义 IP" },
          ],
        })) as "loopback" | "lan" | "auto" | "custom" | "tailnet")
  ) as "loopback" | "lan" | "auto" | "custom" | "tailnet";

  let customBindHost = quickstartGateway.customBindHost;
  if (bind === "custom") {
    const needsPrompt = flow !== "quickstart" || !customBindHost;
    if (needsPrompt) {
      const input = await prompter.text({
        message: zhCN.output.customIpAddress,
        placeholder: zhCN.output.customIpPlaceholder,
        initialValue: customBindHost ?? "",
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
      });
      customBindHost = typeof input === "string" ? input.trim() : undefined;
    }
  }

  let authMode = (
    flow === "quickstart"
      ? quickstartGateway.authMode
      : ((await prompter.select({
          message: zhCN.output.gatewayAuth,
          options: [
            {
              value: "token",
              label: "令牌",
              hint: "推荐默认值（本地 + 远程）",
            },
            { value: "password", label: "密码" },
          ],
          initialValue: "token",
        })) as GatewayAuthChoice)
  ) as GatewayAuthChoice;

  const tailscaleMode = (
    flow === "quickstart"
      ? quickstartGateway.tailscaleMode
      : ((await prompter.select({
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
        })) as "off" | "serve" | "funnel")
  ) as "off" | "serve" | "funnel";

  // Detect Tailscale binary before proceeding with serve/funnel setup.
  if (tailscaleMode !== "off") {
    const tailscaleBin = await findTailscaleBinary();
    if (!tailscaleBin) {
      await prompter.note(
        [
          "未在 PATH 或 /Applications 中找到 Tailscale 二进制文件。",
          "请从以下地址安装 Tailscale：",
          "  https://tailscale.com/download/mac",
          "",
          "您可以继续设置，但 serve/funnel 将在运行时失败。",
        ].join("\n"),
        "Tailscale Warning",
      );
    }
  }

  let tailscaleResetOnExit = flow === "quickstart" ? quickstartGateway.tailscaleResetOnExit : false;
  if (tailscaleMode !== "off" && flow !== "quickstart") {
    await prompter.note(zhCN.output.tailscaleDocs, zhCN.output.tailscaleTitle);
    tailscaleResetOnExit = Boolean(
      await prompter.confirm({
        message: zhCN.output.resetTailscaleOnExit,
        initialValue: false,
      }),
    );
  }

  // Safety + constraints:
  // - Tailscale wants bind=loopback so we never expose a non-loopback server + tailscale serve/funnel at once.
  // - Funnel requires password auth.
  if (tailscaleMode !== "off" && bind !== "loopback") {
    await prompter.note(zhCN.output.tailscaleRequiresLoopback, "Note");
    bind = "loopback";
    customBindHost = undefined;
  }

  if (tailscaleMode === "funnel" && authMode !== "password") {
    await prompter.note(zhCN.output.tailscaleFunnelRequiresPassword, "Note");
    authMode = "password";
  }

  let gatewayToken: string | undefined;
  if (authMode === "token") {
    if (flow === "quickstart") {
      gatewayToken = quickstartGateway.token ?? randomToken();
    } else {
      const tokenInput = await prompter.text({
        message: zhCN.output.gatewayTokenPrompt,
        placeholder: zhCN.output.gatewayTokenPlaceholder,
        initialValue: quickstartGateway.token ?? "",
      });
      gatewayToken = String(tokenInput).trim() || randomToken();
    }
  }

  if (authMode === "password") {
    const password =
      flow === "quickstart" && quickstartGateway.password
        ? quickstartGateway.password
        : await prompter.text({
            message: zhCN.output.gatewayPasswordPrompt,
            validate: (value) => (value?.trim() ? undefined : zhCN.output.inputRequired),
          });
    nextConfig = {
      ...nextConfig,
      gateway: {
        ...nextConfig.gateway,
        auth: {
          ...nextConfig.gateway?.auth,
          mode: "password",
          password: String(password).trim(),
        },
      },
    };
  } else if (authMode === "token") {
    nextConfig = {
      ...nextConfig,
      gateway: {
        ...nextConfig.gateway,
        auth: {
          ...nextConfig.gateway?.auth,
          mode: "token",
          token: gatewayToken,
        },
      },
    };
  }

  nextConfig = {
    ...nextConfig,
    gateway: {
      ...nextConfig.gateway,
      port,
      bind,
      ...(bind === "custom" && customBindHost ? { customBindHost } : {}),
      tailscale: {
        ...nextConfig.gateway?.tailscale,
        mode: tailscaleMode,
        resetOnExit: tailscaleResetOnExit,
      },
    },
  };

  return {
    nextConfig,
    settings: {
      port,
      bind,
      customBindHost: bind === "custom" ? customBindHost : undefined,
      authMode,
      gatewayToken,
      tailscaleMode,
      tailscaleResetOnExit,
    },
  };
}
