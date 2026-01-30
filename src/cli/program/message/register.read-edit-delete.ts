import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessageReadEditDeleteCommands(
  message: Command,
  helpers: MessageCliHelpers,
) {
  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message.command("read").description(zhCN.commands.messageRead),
      ),
    )
    .option("--limit <n>", "Result limit")
    .option("--before <id>", "Read/search before id")
    .option("--after <id>", "Read/search after id")
    .option("--around <id>", "Read around id")
    .option("--include-thread", "Include thread replies (Discord)", false)
    .action(async (opts) => {
      await helpers.runMessageAction("read", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message
          .command("edit")
          .description(zhCN.commands.messageEdit)
          .requiredOption("--message-id <id>", "Message id")
          .requiredOption("-m, --message <text>", "Message body"),
      ),
    )
    .option("--thread-id <id>", "Thread id (Telegram forum thread)")
    .action(async (opts) => {
      await helpers.runMessageAction("edit", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message
          .command("delete")
          .description(zhCN.commands.messageDelete)
          .requiredOption("--message-id <id>", "Message id"),
      ),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("delete", opts);
    });
}
