import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { IMessageStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { zhCN } from "@openclaw/i18n";

export function renderIMessageCard(params: {
  props: ChannelsProps;
  imessage?: IMessageStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, imessage, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">${zhCN.ui.channels.imessageDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${imessage?.configured ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${imessage?.running ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastStart}</span>
          <span>${imessage?.lastStartAt ? formatAgo(imessage.lastStartAt) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastProbe}</span>
          <span>${imessage?.lastProbeAt ? formatAgo(imessage.lastProbeAt) : zhCN.notAvailable}</span>
        </div>
      </div>

      ${imessage?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${imessage.lastError}
          </div>`
        : nothing}

      ${imessage?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${imessage.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${imessage.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "imessage", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
