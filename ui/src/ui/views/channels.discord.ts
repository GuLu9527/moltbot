import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { DiscordStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { zhCN } from "@openclaw/i18n";

export function renderDiscordCard(params: {
  props: ChannelsProps;
  discord?: DiscordStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, discord, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">${zhCN.ui.channels.discordDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${discord?.configured ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${discord?.running ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastStart}</span>
          <span>${discord?.lastStartAt ? formatAgo(discord.lastStartAt) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastProbe}</span>
          <span>${discord?.lastProbeAt ? formatAgo(discord.lastProbeAt) : zhCN.notAvailable}</span>
        </div>
      </div>

      ${discord?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${discord.lastError}
          </div>`
        : nothing}

      ${discord?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${discord.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${discord.probe.status ?? ""} ${discord.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "discord", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
