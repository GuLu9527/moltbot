import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { SignalStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { zhCN } from "@openclaw/i18n";

export function renderSignalCard(params: {
  props: ChannelsProps;
  signal?: SignalStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, signal, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">${zhCN.ui.channels.signalDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${signal?.configured ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${signal?.running ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.baseUrl}</span>
          <span>${signal?.baseUrl ?? zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastStart}</span>
          <span>${signal?.lastStartAt ? formatAgo(signal.lastStartAt) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastProbe}</span>
          <span>${signal?.lastProbeAt ? formatAgo(signal.lastProbeAt) : zhCN.notAvailable}</span>
        </div>
      </div>

      ${signal?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${signal.lastError}
          </div>`
        : nothing}

      ${signal?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${signal.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${signal.probe.status ?? ""} ${signal.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "signal", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
