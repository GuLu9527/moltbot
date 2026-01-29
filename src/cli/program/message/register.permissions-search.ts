import type { Command } from "commander";
import { collectOption } from "../helpers.js";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessagePermissionsCommand(message: Command, helpers: MessageCliHelpers) {
  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message.command("permissions").description(zhCN.commands.messagePermissions),
      ),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("permissions", opts);
    });
}

export function registerMessageSearchCommand(message: Command, helpers: MessageCliHelpers) {
  helpers
    .withMessageBase(message.command("search").description(zhCN.commands.messageSearch))
    .requiredOption("--guild-id <id>", "Guild id")
    .requiredOption("--query <text>", "Search query")
    .option("--channel-id <id>", "Channel id")
    .option("--channel-ids <id>", "Channel id (repeat)", collectOption, [] as string[])
    .option("--author-id <id>", "Author id")
    .option("--author-ids <id>", "Author id (repeat)", collectOption, [] as string[])
    .option("--limit <n>", "Result limit")
    .action(async (opts) => {
      await helpers.runMessageAction("search", opts);
    });
}
