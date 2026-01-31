import { html, nothing } from "lit";

import { formatAgo } from "../format";
import type { ChannelAccountSnapshot, TelegramStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { zhCN } from "@openclaw/i18n";

export function renderTelegramCard(params: {
  props: ChannelsProps;
  telegram?: TelegramStatus;
  telegramAccounts: ChannelAccountSnapshot[];
  accountCountLabel: unknown;
}) {
  const { props, telegram, telegramAccounts, accountCountLabel } = params;
  const hasMultipleAccounts = telegramAccounts.length > 1;

  const renderAccountCard = (account: ChannelAccountSnapshot) => {
    const probe = account.probe as { bot?: { username?: string } } | undefined;
    const botUsername = probe?.bot?.username;
    const label = account.name || account.accountId;
    return html`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${botUsername ? `@${botUsername}` : label}
          </div>
          <div class="account-card-id">${account.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${zhCN.running}</span>
            <span>${account.running ? zhCN.yes : zhCN.no}</span>
          </div>
          <div>
            <span class="label">${zhCN.configured}</span>
            <span>${account.configured ? zhCN.yes : zhCN.no}</span>
          </div>
          <div>
            <span class="label">${zhCN.ui.channels.lastInbound}</span>
            <span>${account.lastInboundAt ? formatAgo(account.lastInboundAt) : zhCN.notAvailable}</span>
          </div>
          ${account.lastError
            ? html`
                <div class="account-card-error">
                  ${account.lastError}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  };

  return html`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">${zhCN.ui.channels.telegramDesc}</div>
      ${accountCountLabel}

      ${hasMultipleAccounts
        ? html`
            <div class="account-card-list">
              ${telegramAccounts.map((account) => renderAccountCard(account))}
            </div>
          `
        : html`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${zhCN.configured}</span>
                <span>${telegram?.configured ? zhCN.yes : zhCN.no}</span>
              </div>
              <div>
                <span class="label">${zhCN.running}</span>
                <span>${telegram?.running ? zhCN.yes : zhCN.no}</span>
              </div>
              <div>
                <span class="label">${zhCN.ui.channels.mode}</span>
                <span>${telegram?.mode ?? zhCN.notAvailable}</span>
              </div>
              <div>
                <span class="label">${zhCN.ui.channels.lastStart}</span>
                <span>${telegram?.lastStartAt ? formatAgo(telegram.lastStartAt) : zhCN.notAvailable}</span>
              </div>
              <div>
                <span class="label">${zhCN.ui.channels.lastProbe}</span>
                <span>${telegram?.lastProbeAt ? formatAgo(telegram.lastProbeAt) : zhCN.notAvailable}</span>
              </div>
            </div>
          `}

      ${telegram?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${telegram.lastError}
          </div>`
        : nothing}

      ${telegram?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            探测 ${telegram.probe.ok ? zhCN.ui.channels.probeOk : zhCN.ui.channels.probeFailed} ·
            ${telegram.probe.status ?? ""} ${telegram.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "telegram", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${zhCN.ui.channels.probe}
        </button>
      </div>
    </div>
  `;
}
