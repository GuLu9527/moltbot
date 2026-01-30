import { readConfigFileSnapshot } from "../config/config.js";
import { assertSupportedRuntime } from "../infra/runtime-guard.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import { resolveUserPath } from "../utils.js";
import { DEFAULT_WORKSPACE, handleReset } from "./onboard-helpers.js";
import { runInteractiveOnboarding } from "./onboard-interactive.js";
import { runNonInteractiveOnboarding } from "./onboard-non-interactive.js";
import { formatCliCommand } from "../cli/command-format.js";
import type { OnboardOptions } from "./onboard-types.js";
import { zhCN } from "../i18n/zh-CN.js";

export async function onboardCommand(opts: OnboardOptions, runtime: RuntimeEnv = defaultRuntime) {
  assertSupportedRuntime(runtime);
  const authChoice = opts.authChoice === "oauth" ? ("setup-token" as const) : opts.authChoice;
  const normalizedAuthChoice =
    authChoice === "claude-cli"
      ? ("setup-token" as const)
      : authChoice === "codex-cli"
        ? ("openai-codex" as const)
        : authChoice;
  if (opts.nonInteractive && (authChoice === "claude-cli" || authChoice === "codex-cli")) {
    runtime.error(
      [
        `认证选项 "${authChoice}" 已弃用。`,
        zhCN.output.useAuthChoiceToken,
      ].join("\n"),
    );
    runtime.exit(1);
    return;
  }
  if (authChoice === "claude-cli") {
    runtime.log(zhCN.output.authChoiceDeprecated + " " + "使用 setup-token 流程代替。");
  }
  if (authChoice === "codex-cli") {
    runtime.log(zhCN.output.authChoiceDeprecated + " " + "使用 OpenAI Codex OAuth 代替。");
  }
  const flow = opts.flow === "manual" ? ("advanced" as const) : opts.flow;
  const normalizedOpts =
    normalizedAuthChoice === opts.authChoice && flow === opts.flow
      ? opts
      : { ...opts, authChoice: normalizedAuthChoice, flow };

  if (normalizedOpts.nonInteractive && normalizedOpts.acceptRisk !== true) {
    runtime.error(
      [
        zhCN.output.nonInteractiveRisk,
        `${zhCN.output.readSecurityDocs}`,
        `Re-run with: ${formatCliCommand("moltbot onboard --non-interactive --accept-risk ...")}`,
      ].join("\n"),
    );
    runtime.exit(1);
    return;
  }

  if (normalizedOpts.reset) {
    const snapshot = await readConfigFileSnapshot();
    const baseConfig = snapshot.valid ? snapshot.config : {};
    const workspaceDefault =
      normalizedOpts.workspace ?? baseConfig.agents?.defaults?.workspace ?? DEFAULT_WORKSPACE;
    await handleReset("full", resolveUserPath(workspaceDefault), runtime);
  }

  if (process.platform === "win32") {
    runtime.log(
      [
        zhCN.output.windowsDetected,
        zhCN.output.wsl2Recommended,
        "Guide: https://docs.molt.bot/windows",
      ].join("\n"),
    );
  }

  if (normalizedOpts.nonInteractive) {
    await runNonInteractiveOnboarding(normalizedOpts, runtime);
    return;
  }

  await runInteractiveOnboarding(normalizedOpts, runtime);
}

export type { OnboardOptions } from "./onboard-types.js";
