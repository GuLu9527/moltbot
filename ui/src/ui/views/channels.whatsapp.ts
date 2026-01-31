import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { WhatsAppStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { formatDuration } from "./channels.shared";
import { zhCN } from "@openclaw/i18n";

export function renderWhatsAppCard(params: {
  props: ChannelsProps;
  whatsapp?: WhatsAppStatus;
  accountCountLabel: unknown;
}) {
  const { props, whatsapp, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">${zhCN.ui.channels.whatsappDesc}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${zhCN.configured}</span>
          <span>${whatsapp?.configured ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.linked}</span>
          <span>${whatsapp?.linked ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.running}</span>
          <span>${whatsapp?.running ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.connected}</span>
          <span>${whatsapp?.connected ? zhCN.yes : zhCN.no}</span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastConnect}</span>
          <span>
            ${whatsapp?.lastConnectedAt
              ? formatAgo(whatsapp.lastConnectedAt)
              : zhCN.notAvailable}
          </span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.lastMessage}</span>
          <span>
            ${whatsapp?.lastMessageAt ? formatAgo(whatsapp.lastMessageAt) : zhCN.notAvailable}
          </span>
        </div>
        <div>
          <span class="label">${zhCN.ui.channels.authAge}</span>
          <span>
            ${whatsapp?.authAgeMs != null
              ? formatDuration(whatsapp.authAgeMs)
              : zhCN.notAvailable}
          </span>
        </div>
      </div>

      ${whatsapp?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${whatsapp.lastError}
          </div>`
        : nothing}

      ${props.whatsappMessage
        ? html`<div class="callout" style="margin-top: 12px;">
            ${props.whatsappMessage}
          </div>`
        : nothing}

      ${props.whatsappQrDataUrl
        ? html`<div class="qr-wrap">
            <img src=${props.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`
        : nothing}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(false)}
        >
          ${props.whatsappBusy ? zhCN.ui.channels.working : zhCN.ui.channels.showQR}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(true)}
        >
          ${zhCN.ui.channels.relink}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppWait()}
        >
          ${zhCN.ui.channels.waitForScan}
        </button>
        <button
          class="btn danger"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppLogout()}
        >
          ${zhCN.ui.channels.logout}
        </button>
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.refresh}
        </button>
      </div>

      ${renderChannelConfigSection({ channelId: "whatsapp", props })}
    </div>
  `;
}
