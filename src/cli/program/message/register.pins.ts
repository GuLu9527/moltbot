import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessagePinCommands(message: Command, helpers: MessageCliHelpers) {
  const pins = [
    helpers
      .withMessageBase(
        helpers.withRequiredMessageTarget(message.command("pin").description(zhCN.commands.messagePin)),
      )
      .requiredOption("--message-id <id>", "Message id")
      .action(async (opts) => {
        await helpers.runMessageAction("pin", opts);
      }),
    helpers
      .withMessageBase(
        helpers.withRequiredMessageTarget(message.command("unpin").description(zhCN.commands.messageUnpin)),
      )
      .requiredOption("--message-id <id>", "Message id")
      .action(async (opts) => {
        await helpers.runMessageAction("unpin", opts);
      }),
    helpers
      .withMessageBase(
        helpers.withRequiredMessageTarget(
          message.command("pins").description(zhCN.commands.messagePins),
        ),
      )
      .option("--limit <n>", "Result limit")
      .action(async (opts) => {
        await helpers.runMessageAction("list-pins", opts);
      }),
  ] as const;

  void pins;
}
