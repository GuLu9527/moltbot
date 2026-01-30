import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessageReactionsCommands(message: Command, helpers: MessageCliHelpers) {
  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message.command("react").description(zhCN.commands.messageReact),
      ),
    )
    .requiredOption("--message-id <id>", "Message id")
    .option("--emoji <emoji>", "Emoji for reactions")
    .option("--remove", "Remove reaction", false)
    .option("--participant <id>", "WhatsApp reaction participant")
    .option("--from-me", "WhatsApp reaction fromMe", false)
    .option("--target-author <id>", "Signal reaction target author (uuid or phone)")
    .option("--target-author-uuid <uuid>", "Signal reaction target author uuid")
    .action(async (opts) => {
      await helpers.runMessageAction("react", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message.command("reactions").description(zhCN.commands.messageReactions),
      ),
    )
    .requiredOption("--message-id <id>", "Message id")
    .option("--limit <n>", "Result limit")
    .action(async (opts) => {
      await helpers.runMessageAction("reactions", opts);
    });
}
