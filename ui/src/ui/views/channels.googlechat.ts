import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { GoogleChatStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import type { ChannelsProps } from "./channels.types";
import { zhCN } from "@openclaw/i18n";

export function renderGoogleChatCard(params: {
  props: ChannelsProps;
  googleChat?: GoogleChatStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, googleChat, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">Google Chat</div>
      <div class="card-sub">${zhCN.ui.channels.googlechatDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${googleChat ? (googleChat.configured ? zhCN.yes : zhCN.no) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${googleChat ? (googleChat.running ? zhCN.yes : zhCN.no) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.credential}</span>
          <span>${googleChat?.credentialSource ?? zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.audience}</span>
          <span>
            ${googleChat?.audienceType
              ? `${googleChat.audienceType}${googleChat.audience ? ` · ${googleChat.audience}` : ""}`
              : zhCN.notAvailable}
          </span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastStart}</span>
          <span>${googleChat?.lastStartAt ? formatAgo(googleChat.lastStartAt) : zhCN.notAvailable}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastProbe}</span>
          <span>${googleChat?.lastProbeAt ? formatAgo(googleChat.lastProbeAt) : zhCN.notAvailable}</span>
        </div>
      </div>

      ${googleChat?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${googleChat.lastError}
          </div>`
        : nothing}

      ${googleChat?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${googleChat.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${googleChat.probe.status ?? ""} ${googleChat.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "googlechat", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
