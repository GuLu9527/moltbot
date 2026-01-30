import { formatCliCommand } from "../cli/command-format.js";
import type { ZhCN } from "../i18n/zh-CN.js";

export function isSystemdUnavailableDetail(detail?: string): boolean {
  if (!detail) return false;
  const normalized = detail.toLowerCase();
  return (
    normalized.includes("systemctl --user unavailable") ||
    normalized.includes("systemctl not available") ||
    normalized.includes("not been booted with systemd") ||
    normalized.includes("failed to connect to bus") ||
    normalized.includes("systemd user services are required")
  );
}

export function renderSystemdUnavailableHints(
  options: { wsl?: boolean; output?: Pick<ZhCN["output"], "systemdUnavailable" | "wslSystemdHint"> } = {},
): string[] {
  const output = options.output;
  if (options.wsl) {
    if (output) {
      return [
        "WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
        "Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
        "Verify: systemctl --user status",
      ];
    }
    return [
      "WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
      "Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
      "Verify: systemctl --user status",
    ];
  }
  if (output) {
    return [
      output.systemdUnavailable,
      output.wslSystemdHint,
    ];
  }
  return [
    "systemd user services are unavailable; install/enable systemd or run the gateway under your supervisor.",
    `If you're in a container, run the gateway in the foreground instead of \`${formatCliCommand("moltbot gateway")}\`.`,
  ];
}
