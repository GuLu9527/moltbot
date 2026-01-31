import { html } from "lit";

import type { GatewayHelloOk } from "../gateway";
import { formatAgo, formatDurationMs } from "../format";
import { formatNextRun } from "../presenter";
import type { UiSettings } from "../storage";
import { zhCN } from "@openclaw/i18n";

export type OverviewProps = {
  connected: boolean;
  hello: GatewayHelloOk | null;
  settings: UiSettings;
  password: string;
  lastError: string | null;
  presenceCount: number;
  sessionsCount: number | null;
  cronEnabled: boolean | null;
  cronNext: number | null;
  lastChannelsRefresh: number | null;
  onSettingsChange: (next: UiSettings) => void;
  onPasswordChange: (next: string) => void;
  onSessionKeyChange: (next: string) => void;
  onConnect: () => void;
  onRefresh: () => void;
};

export function renderOverview(props: OverviewProps) {
  const snapshot = props.hello?.snapshot as
    | { uptimeMs?: number; policy?: { tickIntervalMs?: number } }
    | undefined;
  const uptime = snapshot?.uptimeMs ? formatDurationMs(snapshot.uptimeMs) : "n/a";
  const tick = snapshot?.policy?.tickIntervalMs
    ? `${snapshot.policy.tickIntervalMs}ms`
    : "n/a";
  const authHint = (() => {
    if (props.connected || !props.lastError) return null;
    const lower = props.lastError.toLowerCase();
    const authFailed = lower.includes("unauthorized") || lower.includes("connect failed");
    if (!authFailed) return null;
    const hasToken = Boolean(props.settings.token.trim());
    const hasPassword = Boolean(props.password.trim());
    if (!hasToken && !hasPassword) {
      return html`
        <div class="muted" style="margin-top: 8px;">
          ${zhCN.ui.overview.authRequired}
          <div style="margin-top: 6px;">
            <span class="mono">moltbot dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">moltbot doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px;">
            <a
              class="session-link"
              href="https://docs.molt.bot/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="控制 UI 认证文档（在新标签页中打开）"
              >${zhCN.ui.overview.docsControlUiAuth}</a
            >
          </div>
        </div>
      `;
    }
    return html`
      <div class="muted" style="margin-top: 8px;">
        ${zhCN.ui.overview.authFailed}
        <span class="mono">moltbot dashboard --no-open</span>
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.molt.bot/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="控制 UI 认证文档（在新标签页中打开）"
            >${zhCN.ui.overview.docsControlUiAuth}</a
          >
        </div>
      </div>
    `;
  })();
  const insecureContextHint = (() => {
    if (props.connected || !props.lastError) return null;
    const isSecureContext = typeof window !== "undefined" ? window.isSecureContext : true;
    if (isSecureContext !== false) return null;
    const lower = props.lastError.toLowerCase();
    if (!lower.includes("secure context") && !lower.includes("device identity required")) {
      return null;
    }
    return html`
      <div class="muted" style="margin-top: 8px;">
        ${zhCN.ui.overview.insecureContextHint}
        <span class="mono">http://127.0.0.1:18789</span>
        <div style="margin-top: 6px;">
          ${zhCN.ui.overview.insecureContextConfig}
          <span class="mono">gateway.controlUi.allowInsecureAuth: true</span> (token-only).
        </div>
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.molt.bot/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve 文档（在新标签页中打开）"
            >${zhCN.ui.overview.docsTailscaleServe}</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.molt.bot/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="不安全 HTTP 文档（在新标签页中打开）"
            >${zhCN.ui.overview.docsInsecureHttp}</a
          >
        </div>
      </div>
    `;
  })();

  return html`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">${zhCN.ui.overview.gatewayAccess}</div>
        <div class="card-sub">${zhCN.ui.overview.gatewayAccessSub}</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>${zhCN.ui.overview.websocketUrl}</span>
            <input
              .value=${props.settings.gatewayUrl}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSettingsChange({ ...props.settings, gatewayUrl: v });
              }}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          <label class="field">
            <span>${zhCN.ui.overview.gatewayToken}</span>
            <input
              .value=${props.settings.token}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSettingsChange({ ...props.settings, token: v });
              }}
              placeholder="CLAWDBOT_GATEWAY_TOKEN"
            />
          </label>
          <label class="field">
            <span>${zhCN.ui.overview.password}</span>
            <input
              type="password"
              .value=${props.password}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onPasswordChange(v);
              }}
              placeholder="system or shared password"
            />
          </label>
          <label class="field">
            <span>${zhCN.ui.overview.defaultSessionKey}</span>
            <input
              .value=${props.settings.sessionKey}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSessionKeyChange(v);
              }}
            />
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${() => props.onConnect()}>${zhCN.ui.overview.connect}</button>
          <button class="btn" @click=${() => props.onRefresh()}>${zhCN.ui.overview.refresh}</button>
          <span class="muted">${zhCN.ui.overview.clickConnectToApply}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${zhCN.ui.overview.snapshot}</div>
        <div class="card-sub">${zhCN.ui.overview.snapshotSub}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${zhCN.ui.overview.status}</div>
            <div class="stat-value ${props.connected ? "ok" : "warn"}">
              ${props.connected ? zhCN.ui.overview.connected : zhCN.ui.overview.disconnected}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${zhCN.ui.overview.uptime}</div>
            <div class="stat-value">${uptime}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${zhCN.ui.overview.tickInterval}</div>
            <div class="stat-value">${tick}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${zhCN.ui.overview.lastChannelsRefresh}</div>
            <div class="stat-value">
              ${props.lastChannelsRefresh
                ? formatAgo(props.lastChannelsRefresh)
                : "n/a"}
            </div>
          </div>
        </div>
        ${props.lastError
          ? html`<div class="callout danger" style="margin-top: 14px;">
              <div>${props.lastError}</div>
              ${authHint ?? ""}
              ${insecureContextHint ?? ""}
            </div>`
          : html`<div class="callout" style="margin-top: 14px;">
              ${zhCN.ui.overview.useChannelsHint}
            </div>`}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">${zhCN.ui.overview.instances}</div>
        <div class="stat-value">${props.presenceCount}</div>
        <div class="muted">${zhCN.ui.overview.instancesHint}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${zhCN.ui.overview.sessions}</div>
        <div class="stat-value">${props.sessionsCount ?? "n/a"}</div>
        <div class="muted">${zhCN.ui.overview.sessionsHint}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${zhCN.ui.overview.cron}</div>
        <div class="stat-value">
          ${props.cronEnabled == null
            ? "n/a"
            : props.cronEnabled
              ? zhCN.ui.overview.cronEnabled
              : zhCN.ui.overview.cronDisabled}
        </div>
        <div class="muted">${zhCN.ui.overview.cronNextWake} ${formatNextRun(props.cronNext)}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${zhCN.ui.overview.notes}</div>
      <div class="card-sub">${zhCN.ui.overview.notesSub}</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">${zhCN.ui.overview.noteTailscaleServe}</div>
          <div class="muted">
            ${zhCN.ui.overview.noteTailscaleServeHint}
          </div>
        </div>
        <div>
          <div class="note-title">${zhCN.ui.overview.noteSessionHygiene}</div>
          <div class="muted">${zhCN.ui.overview.noteSessionHygieneHint}</div>
        </div>
        <div>
          <div class="note-title">${zhCN.ui.overview.noteCronReminders}</div>
          <div class="muted">${zhCN.ui.overview.noteCronRemindersHint}</div>
        </div>
      </div>
    </section>
  `;
}
