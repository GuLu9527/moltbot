import { html, nothing } from "lit";

import type { AppViewState } from "../app-view-state";
import { zhCN } from "@openclaw/i18n";

function formatRemaining(ms: number): string {
  const remaining = Math.max(0, ms);
  const totalSeconds = Math.floor(remaining / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

function renderMetaRow(label: string, value?: string | null) {
  if (!value) return nothing;
  return html`<div class="exec-approval-meta-row"><span>${label}</span><span>${value}</span></div>`;
}

export function renderExecApprovalPrompt(state: AppViewState) {
  const active = state.execApprovalQueue[0];
  if (!active) return nothing;
  const request = active.request;
  const remainingMs = active.expiresAtMs - Date.now();
  const remaining = remainingMs > 0 ? zhCN.ui.execApproval.expiresIn.replace("{time}", formatRemaining(remainingMs)) : zhCN.ui.execApproval.expired;
  const queueCount = state.execApprovalQueue.length;
  return html`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${zhCN.ui.execApproval.title}</div>
            <div class="exec-approval-sub">${remaining}</div>
          </div>
          ${queueCount > 1
            ? html`<div class="exec-approval-queue">${zhCN.ui.execApproval.pending.replace("{count}", String(queueCount))}</div>`
            : nothing}
        </div>
        <div class="exec-approval-command mono">${request.command}</div>
        <div class="exec-approval-meta">
          ${renderMetaRow(zhCN.ui.execApproval.host, request.host)}
          ${renderMetaRow(zhCN.ui.execApproval.agent, request.agentId)}
          ${renderMetaRow(zhCN.ui.execApproval.session, request.sessionKey)}
          ${renderMetaRow(zhCN.ui.execApproval.cwd, request.cwd)}
          ${renderMetaRow(zhCN.ui.execApproval.resolved, request.resolvedPath)}
          ${renderMetaRow(zhCN.ui.execApproval.security, request.security)}
          ${renderMetaRow(zhCN.ui.execApproval.ask, request.ask)}
        </div>
        ${state.execApprovalError
          ? html`<div class="exec-approval-error">${state.execApprovalError}</div>`
          : nothing}
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("allow-once")}
          >
            ${zhCN.ui.execApproval.allowOnce}
          </button>
          <button
            class="btn"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("allow-always")}
          >
            ${zhCN.ui.execApproval.alwaysAllow}
          </button>
          <button
            class="btn danger"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("deny")}
          >
            ${zhCN.ui.execApproval.deny}
          </button>
        </div>
      </div>
    </div>
  `;
}
