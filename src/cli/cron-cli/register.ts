import type { Command } from "commander";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { zhCN } from "../../i18n/zh-CN.js";
import {
  registerCronAddCommand,
  registerCronListCommand,
  registerCronStatusCommand,
} from "./register.cron-add.js";
import { registerCronEditCommand } from "./register.cron-edit.js";
import { registerCronSimpleCommands } from "./register.cron-simple.js";

export function registerCronCli(program: Command) {
  const cron = program
    .command("cron")
    .description(zhCN.commands.cronManage)
    .addHelpText(
      "after",
      () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/cron", "docs.molt.bot/cli/cron")}\n`,
    );

  registerCronStatusCommand(cron);
  registerCronListCommand(cron);
  registerCronAddCommand(cron);
  registerCronSimpleCommands(cron);
  registerCronEditCommand(cron);
}
