import type { Command } from "commander";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { createDefaultDeps } from "../deps.js";
import { zhCN } from "../../i18n/zh-CN.js";
import {
  runDaemonInstall,
  runDaemonRestart,
  runDaemonStart,
  runDaemonStatus,
  runDaemonStop,
  runDaemonUninstall,
} from "./runners.js";

export function registerDaemonCli(program: Command) {
  const daemon = program
    .command("daemon")
    .description(zhCN.commands.daemonManage)
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.molt.bot/cli/gateway")}\n`,
    );

  daemon
    .command("status")
    .description(zhCN.commands.daemonStatus)
    .option("--url <url>", "Gateway WebSocket URL (defaults to config/remote/local)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--password <password>", "Gateway password (password auth)")
    .option("--timeout <ms>", "Timeout in ms", "10000")
    .option("--no-probe", "Skip RPC probe")
    .option("--deep", "Scan system-level services", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonStatus({
        rpc: opts,
        probe: Boolean(opts.probe),
        deep: Boolean(opts.deep),
        json: Boolean(opts.json),
      });
    });

  daemon
    .command("install")
    .description(zhCN.commands.daemonInstall)
    .option("--port <port>", "Gateway port")
    .option("--runtime <runtime>", "Daemon runtime (node|bun). Default: node")
    .option("--token <token>", "Gateway token (token auth)")
    .option("--force", "Reinstall/overwrite if already installed", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonInstall(opts);
    });

  daemon
    .command("uninstall")
    .description(zhCN.commands.daemonUninstall)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonUninstall(opts);
    });

  daemon
    .command("start")
    .description(zhCN.commands.daemonStart)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonStart(opts);
    });

  daemon
    .command("stop")
    .description(zhCN.commands.daemonStop)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonStop(opts);
    });

  daemon
    .command("restart")
    .description(zhCN.commands.daemonRestart)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runDaemonRestart(opts);
    });

  // Build default deps (parity with other commands).
  void createDefaultDeps();
}
