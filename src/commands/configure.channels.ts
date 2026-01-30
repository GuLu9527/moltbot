import { getChannelPlugin, listChannelPlugins } from "../channels/plugins/index.js";
import { formatCliCommand } from "../cli/command-format.js";
import type { OpenClawConfig } from "../config/config.js";
import { CONFIG_PATH } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { zhCN } from "../i18n/zh-CN.js";
import { note } from "../terminal/note.js";
import { shortenHomePath } from "../utils.js";
import { confirm, select } from "./configure.shared.js";
import { guardCancel } from "./onboard-helpers.js";

export async function removeChannelConfigWizard(
  cfg: OpenClawConfig,
  runtime: RuntimeEnv,
): Promise<OpenClawConfig> {
  let next = { ...cfg };

  const listConfiguredChannels = () =>
    listChannelPlugins()
      .map((plugin) => plugin.meta)
      .filter((meta) => next.channels?.[meta.id] !== undefined);

  while (true) {
    const configured = listConfiguredChannels();
    if (configured.length === 0) {
      note(
        [
          zhCN.output.noChannelConfigFound,
          `提示：\`${formatCliCommand("openclaw channels status")}\` 显示已配置和启用的内容。`,
        ].join("\n"),
        zhCN.output.removeChannelConfigPrompt,
      );
      return next;
    }

    const channel = guardCancel(
      await select({
        message: zhCN.output.removeChannelConfigPrompt,
        options: [
          ...configured.map((meta) => ({
            value: meta.id,
            label: meta.label,
            hint: zhCN.output.deleteTokenSettings,
          })),
          { value: "done", label: zhCN.output.channelConfigDone },
        ],
      }),
      runtime,
    ) as string;

    if (channel === "done") return next;

    const label = getChannelPlugin(channel)?.meta.label ?? channel;
    const confirmed = guardCancel(
      await confirm({
        message: zhCN.output.deleteChannelConfigConfirm
          .replace("{configPath}", shortenHomePath(CONFIG_PATH))
          .replace("{label}", String(label)),
        initialValue: false,
      }),
      runtime,
    );
    if (!confirmed) continue;

    const nextChannels: Record<string, unknown> = { ...next.channels };
    delete nextChannels[channel];
    next = {
      ...next,
      channels: Object.keys(nextChannels).length
        ? (nextChannels as OpenClawConfig["channels"])
        : undefined,
    };

    note(
      [`${label} ${zhCN.output.channelRemoved}`, zhCN.output.channelRemovedNote].join("\n"),
      zhCN.output.channelRemoved,
    );
  }
}
