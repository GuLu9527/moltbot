import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { SlackStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { zhCN } from "@openclaw/i18n";

export function renderSlackCard(params: {
  props: ChannelsProps;
  slack?: SlackStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, slack, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">${zhCN.ui.channels.slackDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${slack?.configured ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${slack?.running ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastStart}</span>
          <span>${slack?.lastStartAt ? formatAgo(slack.lastStartAt) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastProbe}</span>
          <span>${slack?.lastProbeAt ? formatAgo(slack.lastProbeAt) : zhCN.notAvailable}</span>
        </div>
      </div>

      ${slack?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${slack.lastError}
          </div>`
        : nothing}

      ${slack?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${slack.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${slack.probe.status ?? ""} ${slack.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "slack", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
