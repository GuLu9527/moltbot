import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessageThreadCommands(message: Command, helpers: MessageCliHelpers) {
  const thread = message.command("thread").description(zhCN.commands.messageThreadCreate);

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        thread
          .command("create")
          .description(zhCN.commands.messageThreadCreate)
          .requiredOption("--thread-name <name>", "Thread name"),
      ),
    )
    .option("--message-id <id>", "Message id (optional)")
    .option("--auto-archive-min <n>", "Thread auto-archive minutes")
    .action(async (opts) => {
      await helpers.runMessageAction("thread-create", opts);
    });

  helpers
    .withMessageBase(
      thread
        .command("list")
        .description(zhCN.commands.messageThreadList)
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .option("--channel-id <id>", "Channel id")
    .option("--include-archived", "Include archived threads", false)
    .option("--before <id>", "Read/search before id")
    .option("--limit <n>", "Result limit")
    .action(async (opts) => {
      await helpers.runMessageAction("thread-list", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        thread
          .command("reply")
          .description(zhCN.commands.messageThreadReply)
          .requiredOption("-m, --message <text>", "Message body"),
      ),
    )
    .option(
      "--media <path-or-url>",
      "Attach media (image/audio/video/document). Accepts local paths or URLs.",
    )
    .option("--reply-to <id>", "Reply-to message id")
    .action(async (opts) => {
      await helpers.runMessageAction("thread-reply", opts);
    });
}
