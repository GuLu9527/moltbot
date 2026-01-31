import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";
import { zhCN } from "../../../i18n/zh-CN.js";

export function registerMessageDiscordAdminCommands(message: Command, helpers: MessageCliHelpers) {
  const role = message.command("role").description(zhCN.commands.discordRole);
  helpers
    .withMessageBase(
      role
        .command("info")
        .description(zhCN.commands.discordRoleInfo)
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("role-info", opts);
    });

  helpers
    .withMessageBase(
      role
        .command("add")
        .description(zhCN.commands.discordRoleAdd)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id")
        .requiredOption("--role-id <id>", "Role id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("role-add", opts);
    });

  helpers
    .withMessageBase(
      role
        .command("remove")
        .description(zhCN.commands.discordRoleRemove)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id")
        .requiredOption("--role-id <id>", "Role id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("role-remove", opts);
    });

  const channel = message.command("channel").description(zhCN.commands.discordChannel);
  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        channel.command("info").description(zhCN.commands.discordChannelInfo),
      ),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("channel-info", opts);
    });

  helpers
    .withMessageBase(
      channel
        .command("list")
        .description(zhCN.commands.discordChannelList)
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("channel-list", opts);
    });

  const member = message.command("member").description(zhCN.commands.discordMember);
  helpers
    .withMessageBase(
      member
        .command("info")
        .description(zhCN.commands.discordMemberInfo)
        .requiredOption("--user-id <id>", "User id"),
    )
    .option("--guild-id <id>", "Guild id (Discord)")
    .action(async (opts) => {
      await helpers.runMessageAction("member-info", opts);
    });

  const voice = message.command("voice").description(zhCN.commands.discordVoice);
  helpers
    .withMessageBase(
      voice
        .command("status")
        .description(zhCN.commands.discordVoiceStatus)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("voice-status", opts);
    });

  const event = message.command("event").description(zhCN.commands.discordEvent);
  helpers
    .withMessageBase(
      event
        .command("list")
        .description(zhCN.commands.discordEventList)
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("event-list", opts);
    });

  helpers
    .withMessageBase(
      event
        .command("create")
        .description(zhCN.commands.discordEventCreate)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--event-name <name>", "Event name")
        .requiredOption("--start-time <iso>", "Event start time"),
    )
    .option("--end-time <iso>", "Event end time")
    .option("--desc <text>", "Event description")
    .option("--channel-id <id>", "Channel id")
    .option("--location <text>", "Event location")
    .option("--event-type <stage|external|voice>", "Event type")
    .action(async (opts) => {
      await helpers.runMessageAction("event-create", opts);
    });

  helpers
    .withMessageBase(
      message
        .command("timeout")
        .description(zhCN.commands.discordMemberTimeout)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"),
    )
    .option("--duration-min <n>", "Timeout duration minutes")
    .option("--until <iso>", "Timeout until")
    .option("--reason <text>", "Moderation reason")
    .action(async (opts) => {
      await helpers.runMessageAction("timeout", opts);
    });

  helpers
    .withMessageBase(
      message
        .command("kick")
        .description(zhCN.commands.discordMemberKick)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"),
    )
    .option("--reason <text>", "Moderation reason")
    .action(async (opts) => {
      await helpers.runMessageAction("kick", opts);
    });

  helpers
    .withMessageBase(
      message
        .command("ban")
        .description(zhCN.commands.discordMemberBan)
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"),
    )
    .option("--reason <text>", "Moderation reason")
    .option("--delete-days <n>", "Ban delete message days")
    .action(async (opts) => {
      await helpers.runMessageAction("ban", opts);
    });
}
