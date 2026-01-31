import type { MoltbotConfig } from "../config/config.js";
import { resolveGatewayPort } from "../config/config.js";
import {
  resolveGatewayLaunchAgentLabel,
  resolveNodeLaunchAgentLabel,
} from "../daemon/constants.js";
import { readLastGatewayErrorLine } from "../daemon/diagnostics.js";
import {
  isLaunchAgentListed,
  isLaunchAgentLoaded,
  launchAgentPlistExists,
  repairLaunchAgentBootstrap,
} from "../daemon/launchd.js";
import { resolveGatewayService } from "../daemon/service.js";
import { isSystemdUserServiceAvailable } from "../daemon/systemd.js";
import { renderSystemdUnavailableHints } from "../daemon/systemd-hints.js";
import { formatPortDiagnostics, inspectPortUsage } from "../infra/ports.js";
import { isWSL } from "../infra/wsl.js";
import type { RuntimeEnv } from "../runtime.js";
import { formatCliCommand } from "../cli/command-format.js";
import { note } from "../terminal/note.js";
import { sleep } from "../utils.js";
import {
  DEFAULT_GATEWAY_DAEMON_RUNTIME,
  GATEWAY_DAEMON_RUNTIME_OPTIONS,
  type GatewayDaemonRuntime,
} from "./daemon-runtime.js";
import { buildGatewayInstallPlan, gatewayInstallErrorHint } from "./daemon-install-helpers.js";
import { buildGatewayRuntimeHints, formatGatewayRuntimeSummary } from "./doctor-format.js";
import type { DoctorOptions, DoctorPrompter } from "./doctor-prompter.js";
import { healthCommand } from "./health.js";
import { formatHealthCheckFailure } from "./health-format.js";
import { zhCN } from "../i18n/zh-CN.js";

async function maybeRepairLaunchAgentBootstrap(params: {
  env: Record<string, string | undefined>;
  title: string;
  runtime: RuntimeEnv;
  prompter: DoctorPrompter;
}): Promise<boolean> {
  if (process.platform !== "darwin") return false;

  const listed = await isLaunchAgentListed({ env: params.env });
  if (!listed) return false;

  const loaded = await isLaunchAgentLoaded({ env: params.env });
  if (loaded) return false;

  const plistExists = await launchAgentPlistExists(params.env);
  if (!plistExists) return false;

  note(zhCN.output.launchAgentListedNotLoaded, `${params.title} LaunchAgent`);

  const shouldFix = await params.prompter.confirmSkipInNonInteractive({
    message: zhCN.output.repairLaunchAgent,
    initialValue: true,
  });
  if (!shouldFix) return false;

  params.runtime.log(zhCN.output.bootstrappingAgent);
  const repair = await repairLaunchAgentBootstrap({ env: params.env });
  if (!repair.ok) {
    params.runtime.error(
      `${params.title} ${zhCN.output.launchAgentBootstrapFailed}：${repair.detail ?? zhCN.error}`,
    );
    return false;
  }

  const verified = await isLaunchAgentLoaded({ env: params.env });
  if (!verified) {
    params.runtime.error(`${params.title} ${zhCN.output.launchAgentStillNotLoaded}`);
    return false;
  }

  note(`${params.title} ${zhCN.output.launchAgentRepaired}`, `${params.title} LaunchAgent`);
  return true;
}

export async function maybeRepairGatewayDaemon(params: {
  cfg: MoltbotConfig;
  runtime: RuntimeEnv;
  prompter: DoctorPrompter;
  options: DoctorOptions;
  gatewayDetailsMessage: string;
  healthOk: boolean;
}) {
  if (params.healthOk) return;

  const service = resolveGatewayService();
  // systemd can throw in containers/WSL; treat as "not loaded" and fall back to hints.
  let loaded = false;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  let serviceRuntime: Awaited<ReturnType<typeof service.readRuntime>> | undefined;
  if (loaded) {
    serviceRuntime = await service.readRuntime(process.env).catch(() => undefined);
  }

  if (process.platform === "darwin" && params.cfg.gateway?.mode !== "remote") {
    const gatewayRepaired = await maybeRepairLaunchAgentBootstrap({
      env: process.env,
      title: "Gateway",
      runtime: params.runtime,
      prompter: params.prompter,
    });
    await maybeRepairLaunchAgentBootstrap({
      env: { ...process.env, CLAWDBOT_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel() },
      title: "Node",
      runtime: params.runtime,
      prompter: params.prompter,
    });
    if (gatewayRepaired) {
      loaded = await service.isLoaded({ env: process.env });
      if (loaded) {
        serviceRuntime = await service.readRuntime(process.env).catch(() => undefined);
      }
    }
  }

  if (params.cfg.gateway?.mode !== "remote") {
    const port = resolveGatewayPort(params.cfg, process.env);
    const diagnostics = await inspectPortUsage(port);
    if (diagnostics.status === "busy") {
      note(formatPortDiagnostics(diagnostics).join("\n"), "Gateway port");
    } else if (loaded && serviceRuntime?.status === "running") {
      const lastError = await readLastGatewayErrorLine(process.env);
      if (lastError) note(`${zhCN.output.lastGatewayError}: ${lastError}`, "Gateway");
    }
  }

  if (!loaded) {
    if (process.platform === "linux") {
      const systemdAvailable = await isSystemdUserServiceAvailable().catch(() => false);
      if (!systemdAvailable) {
        const wsl = await isWSL();
        note(renderSystemdUnavailableHints({ wsl, output: zhCN.output }).join("\n"), "Gateway");
        return;
      }
    }
    note(zhCN.output.gatewayNotInstalled, "Gateway");
    if (params.cfg.gateway?.mode !== "remote") {
      const install = await params.prompter.confirmSkipInNonInteractive({
        message: zhCN.output.installGatewayService,
        initialValue: true,
      });
      if (install) {
        const daemonRuntime = await params.prompter.select<GatewayDaemonRuntime>(
          {
            message: zhCN.output.gatewayServiceRuntime,
            options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
            initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME,
          },
          DEFAULT_GATEWAY_DAEMON_RUNTIME,
        );
        const port = resolveGatewayPort(params.cfg, process.env);
        const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
          env: process.env,
          port,
          token: params.cfg.gateway?.auth?.token ?? process.env.CLAWDBOT_GATEWAY_TOKEN,
          runtime: daemonRuntime,
          warn: (message, title) => note(message, title),
          config: params.cfg,
        });
        try {
          await service.install({
            env: process.env,
            stdout: process.stdout,
            programArguments,
            workingDirectory,
            environment,
          });
        } catch (err) {
          note(`${zhCN.output.gatewayServiceInstallFailed}: ${String(err)}`, "Gateway");
          note(gatewayInstallErrorHint(), "Gateway");
        }
      }
    }
    return;
  }

  const summary = formatGatewayRuntimeSummary(serviceRuntime);
  const hints = buildGatewayRuntimeHints(serviceRuntime, {
    platform: process.platform,
    env: process.env,
  });
  if (summary || hints.length > 0) {
    const lines: string[] = [];
    if (summary) lines.push(`${zhCN.output.gatewayRuntime}: ${summary}`);
    lines.push(...hints);
    note(lines.join("\n"), "Gateway");
  }

  if (serviceRuntime?.status !== "running") {
    const start = await params.prompter.confirmSkipInNonInteractive({
      message: zhCN.output.startGatewayService,
      initialValue: true,
    });
    if (start) {
      await service.restart({
        env: process.env,
        stdout: process.stdout,
      });
      await sleep(1500);
    }
  }

  if (process.platform === "darwin") {
    const label = resolveGatewayLaunchAgentLabel(process.env.CLAWDBOT_PROFILE);
    note(
      `${zhCN.output.launchAgentStopHint} "${formatCliCommand("moltbot gateway stop")}" 或 launchctl bootout gui/$UID/${label}。`,
      "Gateway",
    );
  }

  if (serviceRuntime?.status === "running") {
    const restart = await params.prompter.confirmSkipInNonInteractive({
      message: zhCN.output.restartGatewayService,
      initialValue: true,
    });
    if (restart) {
      await service.restart({
        env: process.env,
        stdout: process.stdout,
      });
      await sleep(1500);
      try {
        await healthCommand({ json: false, timeoutMs: 10_000 }, params.runtime);
      } catch (err) {
        const message = String(err);
        if (message.includes("gateway closed")) {
          note(zhCN.output.gatewayNotRunning, "Gateway");
          note(params.gatewayDetailsMessage, "Gateway connection");
        } else {
          params.runtime.error(formatHealthCheckFailure(err));
        }
      }
    }
  }
}
