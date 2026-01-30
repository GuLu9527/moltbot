# 🦞 OpenClaw — 个人 AI 助手

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE!</strong>
</p>

<p align="center">
  <a href="https://github.com/openclaw/openclaw/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/openclaw/openclaw/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/openclaw/openclaw/releases"><img src="https://img.shields.io/github/v/release/openclaw/openclaw?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

**OpenClaw** 是一个运行在本地设备上的*个人 AI 助手*。

它在你已经使用的渠道上回复你（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、Microsoft Teams、WebChat），以及扩展渠道如 BlueBubbles、Matrix、Zalo 和 Zalo Personal。它可以在 macOS/iOS/Android 上说话和聆听，并可以渲染你控制的实时 Canvas。网关只是控制平面——产品是助手。

如果你想要一个感觉本地、快速、始终在线的个人单用户助手，这就是它。

[官网](https://openclaw.ai) · [文档](https://docs.openclaw.ai) · [DeepWiki](https://deepwiki.com/openclaw/openclaw) · [开始使用](https://docs.openclaw.ai/start/getting-started) · [更新](https://docs.openclaw.ai/install/updating) · [展示](https://docs.openclaw.ai/start/showcase) · [常见问题](https://docs.openclaw.ai/start/faq) · [向导](https://docs.openclaw.ai/start/wizard) · [Nix](https://github.com/openclaw/nix-clawdbot) · [Docker](https://docs.openclaw.ai/install/docker) · [Discord](https://discord.gg/clawd)

推荐方式：运行向导 (`openclaw onboard`)。它会引导你设置网关、工作区、渠道和技能。CLI 向导是推荐的方式，适用于 **macOS、Linux 和 Windows（通过 WSL2；强烈推荐）**。

支持 npm、pnpm 或 bun。

新安装？从这里开始：[开始使用](https://docs.openclaw.ai/start/getting-started)

**订阅 (OAuth)：**
- **[Anthropic](https://www.anthropic.com/)** (Claude Pro/Max)
- **[OpenAI](https://openai.com/)** (ChatGPT/Codex)

模型说明：虽然支持任何模型，但我强烈推荐 **Anthropic Pro/Max (100/200) + Opus 4.5**，因为它具有长上下文优势和更好的提示注入抵抗力。参见[向导](https://docs.openclaw.ai/start/onboarding)。

## 模型（选择 + 认证）

- 模型配置 + CLI：[Models](https://docs.openclaw.ai/concepts/models)
- 认证配置文件轮换（OAuth vs API 密钥）+ 故障转移：[Model failover](https://docs.openclaw.ai/concepts/model-failover)

## 安装（推荐）

运行时：**Node ≥22**。

```bash
npm install -g openclaw@latest
# 或：pnpm add -g openclaw@latest

openclaw onboard --install-daemon
```

向导会安装网关守护进程（launchd/systemd 用户服务），使其保持运行。

兼容说明：`clawdbot` 仍作为兼容包装器可用。

## 快速开始

运行时：**Node ≥22**。

完整初学者指南（认证、配对、渠道）：[开始使用](https://docs.molt.bot/start/getting-started)

```bash
openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# 发送消息
openclaw message send --to +1234567890 --message "Hello from Moltbot"

# 与助手对话（可选地回复到任何已连接的渠道：WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/Microsoft Teams/Matrix/Zalo/Zalo Personal/WebChat）
openclaw agent --message "Ship checklist" --thinking high
```

升级？[更新指南](https://docs.molt.bot/install/updating)（并运行 `openclaw doctor`）。

## 开发渠道

- **stable**：标记的发布版本 (`vYYYY.M.D` 或 `vYYYY.M.D-<patch>`)，npm 标签 `latest`。
- **beta**：预发布标签 (`vYYYY.M.D-beta.N`)，npm 标签 `beta`（可能没有 macOS 应用）。
- **dev**：主分支的最新代码，npm 标签 `dev`（发布时）。

切换渠道（git + npm）：`openclaw update --channel stable|beta|dev`

详情：[开发渠道](https://docs.molt.bot/install/development-channels)

## 从源码开发

构建时推荐使用 `pnpm`。Bun 可选用于直接运行 TypeScript。

```bash
git clone https://github.com/openclaw/openclaw.git
cd moltbot

pnpm install
pnpm ui:build # 首次运行自动安装 UI 依赖
pnpm build

pnpm openclaw onboard --install-daemon

# 开发循环（TS 更改自动重载）
pnpm gateway:watch
```

注意：`pnpm openclaw ...` 直接运行 TypeScript（通过 `tsx`）。`pnpm build` 产出 `dist/` 用于通过 Node 或打包的 `moltbot` 二进制文件运行。

## 安全默认设置（DM 访问）

OpenClaw 连接到真实的即时通讯界面。将入站 DM 视为**不可信输入**。

完整安全指南：[Security](https://docs.molt.bot/gateway/security)

Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack 上的默认行为：
- **DM 配对** (`dmPolicy="pairing"` / `channels.discord.dm.policy="pairing"` / `channels.slack.dm.policy="pairing"`): 未知发送者会收到一个简短的配对代码，机器人不会处理他们的消息。
- 使用批准：`moltbot pairing approve <channel> <code>`（然后发送者被添加到本地允许列表存储）。
- 公共入站 DM 需要明确选择加入：设置 `dmPolicy="open"` 并在渠道允许列表中包含 `"*"` (`allowFrom` / `channels.discord.dm.allowFrom` / `channels.slack.dm.allowFrom`)。

运行 `openclaw doctor` 以显示有风险/配置错误的 DM 策略。

## 亮点

- **[本地优先网关](https://docs.molt.bot/gateway)** — 会话、渠道、工具和事件的单一控制平面。
- **[多渠道收件箱](https://docs.molt.bot/channels)** — WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、BlueBubbles、Microsoft Teams、Matrix、Zalo、Zalo Personal、WebChat、macOS、iOS/Android。
- **[多代理路由](https://docs.molt.bot/gateway/configuration)** — 将入站渠道/账户/对等体路由到隔离的代理（工作区 + 每个代理的会话）。
- **[语音唤醒](https://docs.molt.bot/nodes/voicewake) + [对话模式](https://docs.molt.bot/nodes/talk)** — 使用 ElevenLabs 在 macOS/iOS/Android 上实现持续语音交互。
- **[实时 Canvas](https://docs.molt.bot/platforms/mac/canvas)** — 代理驱动的可视化工作区，使用 [A2UI](https://docs.molt.bot/platforms/mac/canvas#canvas-a2ui)。
- **[一流工具](https://docs.molt.bot/tools)** — 浏览器、画布、节点、cron、会话以及 Discord/Slack 操作。
- **[配套应用](https://docs.molt.bot/platforms/macos)** — macOS 菜单栏应用 + iOS/Android [节点](https://docs.molt.bot/nodes)。
- **[向导](https://docs.molt.bot/start/wizard) + [技能](https://docs.molt.bot/tools/skills)** — 向导驱动的设置，带有捆绑/管理/工作区技能。

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=openclaw/openclaw&type=date&legend=top-left)](https://www.star-history.com/#moltbot/moltbot&type=date&legend=top-left)

## 我们构建的一切

### 核心平台
- [Gateway WS 控制平面](https://docs.molt.bot/gateway)，带有会话、存在、配置、cron、webhook、[控制 UI](https://docs.molt.bot/web) 和 [Canvas 主机](https://docs.molt.bot/platforms/mac/canvas#canvas-a2ui)。
- [CLI 界面](https://docs.molt.bot/tools/agent-send)：gateway、agent、send、[向导](https://docs.molt.bot/start/wizard) 和 [doctor](https://docs.molt.bot/gateway/doctor)。
- [Pi 代理运行时](https://docs.molt.bot/concepts/agent) 在 RPC 模式下，具有工具流和块流。
- [会话模型](https://docs.molt.bot/concepts/session)：`main` 用于直接聊天、群组隔离、激活模式、队列模式、回复。群组规则：[Groups](https://docs.molt.bot/concepts/groups)。
- [媒体管道](https://docs.molt.bot/nodes/images)：图像/音频/视频、转录钩子、大小限制、临时文件生命周期。音频详情：[Audio](https://docs.molt.bot/nodes/audio)。

### 渠道
- [Channels](https://docs.molt.bot/channels): [WhatsApp](https://docs.molt.bot/channels/whatsapp) (Baileys), [Telegram](https://docs.molt.bot/channels/telegram) (grammY), [Slack](https://docs.molt.bot/channels/slack) (Bolt), [Discord](https://docs.molt.bot/channels/discord) (discord.js), [Google Chat](https://docs.molt.bot/channels/googlechat) (Chat API), [Signal](https://docs.molt.bot/channels/signal) (signal-cli), [iMessage](https://docs.molt.bot/channels/imessage) (imsg), [BlueBubbles](https://docs.molt.bot/channels/bluebubbles) (扩展), [Microsoft Teams](https://docs.molt.bot/channels/msteams) (扩展), [Matrix](https://docs.molt.bot/channels/matrix) (扩展), [Zalo](https://docs.molt.bot/channels/zalo) (扩展), [Zalo Personal](https://docs.molt.bot/channels/zalouser) (扩展), [WebChat](https://docs.molt.bot/web/webchat)。
- [群组路由](https://docs.molt.bot/concepts/group-messages)：提及门控、回复标签、每个渠道的分块和路由。渠道规则：[Channels](https://docs.molt.bot/channels)。

### 应用 + 节点
- [macOS 应用](https://docs.molt.bot/platforms/macos)：菜单栏控制平面、[语音唤醒](https://docs.molt.bot/nodes/voicewake)/PTT、[对话模式](https://docs.molt.bot/nodes/talk) 叠加层、[WebChat](https://docs.molt.bot/web/webchat)、调试工具、[远程网关](https://docs.molt.bot/gateway/remote) 控制。
- [iOS 节点](https://docs.molt.bot/platforms/ios): [Canvas](https://docs.molt.bot/platforms/mac/canvas)、[语音唤醒](https://docs.molt.bot/nodes/voicewake)、[对话模式](https://docs.molt.bot/nodes/talk)、相机、屏幕录制、Bonjour 配对。
- [Android 节点](https://docs.molt.bot/platforms/android): [Canvas](https://docs.molt.bot/platforms/mac/canvas)、[对话模式](https://docs.molt.bot/nodes/talk)、相机、屏幕录制、可选 SMS。
- [macOS 节点模式](https://docs.molt.bot/nodes)：system.run/notify + canvas/camera 暴露。

### 工具 + 自动化
- [浏览器控制](https://docs.molt.bot/tools/browser)：专用的 openclaw Chrome/Chromium、快照、操作、上传、配置文件。
- [Canvas](https://docss/mac/.molt.bot/platformcanvas): [A2UI](https://docs.molt.bot/platforms/mac/canvas#canvas-a2ui) 推送/重置、eval、快照。
- [节点](https://docs.molt.bot/nodes)：相机快照/剪辑、屏幕录制、[location.get](https://docs.molt.bot/nodes/location-command)、通知。
- [Cron + 唤醒](https://docs.molt.bot/automation/cron-jobs); [webhooks](https://docs.molt.bot/automation/webhook); [Gmail Pub/Sub](https://docs.molt.bot/automation/gmail-pubsub)。
- [技能平台](https://docs.molt.bot/tools/skills)：捆绑、管理和工作区技能，带有安装门控 + UI。

### 运行时 + 安全性
- [渠道路由](https://docs.molt.bot/concepts/channel-routing)、[重试策略](https://docs.molt.bot/concepts/retry) 和 [流式传输/分块](https://docs.molt.bot/concepts/streaming)。
- [存在](https://docs.molt.bot/concepts/presence)、[输入指示器](https://docs.molt.bot/concepts/typing-indicators) 和 [使用跟踪](https://docs.molt.bot/concepts/usage-tracking)。
- [模型](https://docs.molt.bot/concepts/models)、[模型故障转移](https://docs.molt.bot/concepts/model-failover) 和 [会话修剪](https://docs.molt.bot/concepts/session-pruning)。
- [安全性](https://docs.molt.bot/gateway/security) 和 [故障排除](https://docs.molt.bot/channels/troubleshooting)。

### 运维 + 打包
- [控制 UI](https://docs.molt.bot/web) + [WebChat](https://docs.molt.bot/web/webchat) 直接从网关提供。
- [Tailscale Serve/Funnel](https://docs.molt.bot/gateway/tailscale) 或 [SSH 隧道](https://docs.molt.bot/gateway/remote)，带有令牌/密码认证。
- [Nix 模式](https://docs.molt.bot/install/nix) 用于声明式配置；[Docker](https://docs.molt.bot/install/docker) 基于安装。
- [Doctor](https://docs.molt.bot/gateway/doctor) 迁移、[日志](https://docs.molt.bot/logging)。

## 工作原理（简要）

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / Zalo / Zalo Personal / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi agent (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS app
               └─ iOS / Android nodes
```

## 关键子系统

- **[Gateway WebSocket 网络](https://docs.molt.bot/concepts/architecture)** — 客户端、工具和事件的单一 WS 控制平面（以及运维：[Gateway runbook](https://docs.molt.bot/gateway)）。
- **[Tailscale 暴露](https://docs.molt.bot/gateway/tailscale)** — Serve/Funnel 用于网关仪表板 + WS（远程访问：[Remote](https://docs.molt.bot/gateway/remote)）。
- **[浏览器控制](https://docs.molt.bot/tools/browser)** — moltbot 管理的 Chrome/Chromium，带有 CDP 控制。
- **[Canvas + A2UI](https://docs.molt.bot/platforms/mac/canvas)** — 代理驱动的可视化工作区（A2UI 主机：[Canvas/A2UI](https://docs.molt.bot/platforms/mac/canvas#canvas-a2ui)）。
- **[语音唤醒](https://docs.molt.bot/nodes/voicewake) + [对话模式](https://docs.molt.bot/nodes/talk)** — 持续语音和连续对话。
- **[节点](https://docs.molt.bot/nodes)** — Canvas、相机快照/剪辑、屏幕录制、`location.get`、通知，加上 macOS 专用的 `system.run`/`system.notify`。

## Tailscale 访问（网关仪表板）

OpenClaw 可以自动配置 Tailscale **Serve**（仅 tailnet）或 **Funnel**（公开），同时网关保持绑定到环回。配置 `gateway.tailscale.mode`：

- `off`：无 Tailscale 自动化（默认）。
- `serve`：通过 `tailscale serve` 提供仅 tailnet 的 HTTPS（默认使用 Tailscale 身份标头）。
- `funnel`：通过 `tailscale funnel` 提供公开的 HTTPS（需要共享密码认证）。

注意：
- 启用 Serve/Funnel 时，`gateway.bind` 必须保持为 `loopback`（OpenClaw 会强制执行）。
- 可以通过设置 `gateway.auth.mode: "password"` 或 `gateway.auth.allowTailscale: false` 来强制 Serve 需要密码。
- Funnel 除非设置了 `gateway.auth.mode: "password"`，否则拒绝启动。
- 可选：`gateway.tailscale.resetOnExit` 在关闭时撤销 Serve/Funnel。

详情：[Tailscale 指南](https://docs.molt.bot/gateway/tailscale) · [Web 界面](https://docs.molt.bot/web)

## 远程网关（Linux 很棒）

在小型 Linux 实例上运行网关完全没问题。客户端（macOS 应用、CLI、WebChat）可以通过 **Tailscale Serve/Funnel** 或 **SSH 隧道** 连接，你仍然可以配对设备节点（macOS/iOS/Android）以在需要时执行设备本地操作。

- **网关主机**默认运行 exec 工具和渠道连接。
- **设备节点**通过 `node.invoke` 运行设备本地操作（`system.run`、相机、屏幕录制、通知）。

简而言之：exec 在网关所在位置运行；设备操作在设备所在位置运行。

详情：[远程访问](https://docs.molt.bot/gateway/remote) · [节点](https://docs.molt.bot/nodes) · [安全性](https://docs.molt.bot/gateway/security)

## 通过网关协议的 macOS 权限

macOS 应用可以以 **节点模式**运行，并通过网关 WebSocket 通告其功能 + 权限映射（`node.list` / `node.describe`）。客户端可以通过 `node.invoke` 执行本地操作：

- `system.run` 在本地运行命令并返回 stdout/stderr/退出代码；设置 `needsScreenRecording: true` 以要求屏幕录制权限（否则会得到 `PERMISSION_MISSING`）。
- `system.notify` 发布用户通知，如果通知被拒绝则失败。
- `canvas.*`、`camera.*`、`screen.record` 和 `location.get` 也通过 `node.invoke` 路由，并遵循 TCC 权限状态。

提升的 bash（主机权限）独立于 macOS TCC：

- 使用 `/elevated on|off` 在启用 + 允许列表时切换每个会话的提升访问。
- 网关通过 `sessions.patch`（WS 方法）以及 `thinkingLevel`、`verboseLevel`、`model`、`sendPolicy` 和 `groupActivation` 保留每个会话的切换。

详情：[节点](https://docs.molt.bot/nodes) · [macOS 应用](https://docs.molt.bot/platforms/macos) · [网关协议](https://docs.molt.bot/concepts/architecture)

## 代理到代理（sessions_* 工具）

- 使用这些来协调跨会话的工作，而无需在聊天界面之间跳转。
- `sessions_list` — 发现活动会话（代理）及其元数据。
- `sessions_history` — 获取会话的对话日志。
- `sessions_send` — 向另一个会话发送消息；可选的回复回 ping-pong + 公告步骤（`REPLY_SKIP`、`ANNOUNCE_SKIP`）。

详情：[会话工具](https://docs.molt.bot/concepts/session-tool)

## 技能注册表（ClawdHub）

ClawdHub 是一个极简的技能注册表。启用 ClawdHub 后，代理可以自动搜索技能，并根据需要拉取新技能。

[ClawdHub](https://ClawdHub.com)

## 聊天命令

在 WhatsApp/Telegram/Slack/Google Chat/Microsoft Teams/WebChat 中发送这些命令（群组命令仅所有者可用）：

- `/status` — 紧凑的会话状态（模型 + 令牌，可用时显示成本）
- `/new` 或 `/reset` — 重置会话
- `/compact` — 压缩会话上下文（摘要）
- `/think <level>` — off|minimal|low|medium|high|xhigh（仅 GPT-5.2 + Codex 模型）
- `/verbose on|off`
- `/usage off|tokens|full` — 每个响应的使用情况页脚
- `/restart` — 重启网关（群组中仅所有者可用）
- `/activation mention|always` — 群组激活切换（仅群组）

## 应用（可选）

仅网关本身就能提供很好的体验。所有应用都是可选的，并添加额外功能。

如果你计划构建/运行配套应用，请按照下面的平台运行手册操作。

### macOS（OpenClaw.app）（可选）

- 网关和运行状况的菜单栏控制。
- 语音唤醒 + 按键说话叠加层。
- WebChat + 调试工具。
- 通过 SSH 远程控制网关。

注意：macOS 权限需要在重建后保持，需要签名构建（参见 `docs/mac/permissions.md`）。

### iOS 节点（可选）

- 通过 Bridge 配对为节点。
- 语音触发转发 + Canvas 界面。
- 通过 `openclaw nodes …` 控制。

运行手册：[iOS 连接](https://docs.molt.bot/platforms/ios)

### Android 节点（可选）

- 通过与 iOS 相同的 Bridge + 配对流程配对。
- 暴露 Canvas、相机和屏幕捕获命令。
- 运行手册：[Android 连接](https://docs.molt.bot/platforms/android)

## 代理工作区 + 技能

- 工作区根目录：`~/clawd`（可通过 `agents.defaults.workspace` 配置）。
- 注入的提示文件：`AGENTS.md`、`SOUL.md`、`TOOLS.md`。
- 技能：`~/clawd/skills/<skill>/SKILL.md`。

## 配置

最小的 `~/.clawdbot/openclaw.json`（模型 + 默认值）：

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5"
  }
}
```

[完整配置参考（所有键 + 示例）。](https://docs.molt.bot/gateway/configuration)

## 安全模型（重要）

- **默认：** 工具在 **main** 会话的主机上运行，所以当只有你一个人时，代理拥有完全访问权限。
- **群组/渠道安全性：** 设置 `agents.defaults.sandbox.mode: "non-main"` 以在每个会话的 Docker 沙箱中运行 **非 main 会话**（群组/渠道）；对于这些会话，bash 在 Docker 中运行。
- **沙箱默认设置：** 允许列表 `bash`、`process`、`read`、`write`、`edit`、`sessions_list`、`sessions_history`、`sessions_send`、`sessions_spawn`；拒绝列表 `browser`、`canvas`、`nodes`、`cron`、`discord`、`gateway`。

详情：[安全指南](https://docs.molt.bot/gateway/security) · [Docker + 沙箱](https://docs.molt.bot/install/docker) · [沙箱配置](https://docs.molt.bot/gateway/configuration)

### [WhatsApp](https://docs.molt.bot/channels/whatsapp)

- 链接设备：`pnpm openclaw channels login`（凭据存储在 `~/.clawdbot/credentials` 中）。
- 通过 `channels.whatsapp.allowFrom` 允许列表谁可以与助手交谈。
- 如果设置了 `channels.whatsapp.groups`，它将成为群组允许列表；包含 `"*"` 以允许所有。

### [Telegram](https://docs.molt.bot/channels/telegram)

- 设置 `TELEGRAM_BOT_TOKEN` 或 `channels.telegram.botToken`（环境变量优先）。
- 可选：设置 `channels.telegram.groups`（带有 `channels.telegram.groups."*".requireMention`）；设置后，它是群组允许列表（包含 `"*"` 以允许所有）。同时根据需要设置 `channels.telegram.allowFrom` 或 `channels.telegram.webhookUrl`。

```json5
{
  channels: {
    telegram: {
      botToken: "123456:ABCDEF"
    }
  }
}
```

### [Slack](https://docs.molt.bot/channels/slack)

- 设置 `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN`（或 `channels.slack.botToken` + `channels.slack.appToken`）。

### [Discord](https://docs.molt.bot/channels/discord)

- 设置 `DISCORD_BOT_TOKEN` 或 `channels.discord.token`（环境变量优先）。
- 可选：根据需要设置 `commands.native`、`commands.text` 或 `commands.useAccessGroups`，以及 `channels.discord.dm.allowFrom`、`channels.discord.guilds` 或 `channels.discord.mediaMaxMb`。

```json5
{
  channels: {
    discord: {
      token: "1234abcd"
    }
  }
}
```

### [Signal](https://docs.molt.bot/channels/signal)

- 需要 `signal-cli` 和 `channels.signal` 配置部分。

### [iMessage](https://docs.molt.bot/channels/imessage)

- 仅限 macOS；Messages 必须已登录。
- 如果设置了 `channels.imessage.groups`，它将成为群组允许列表；包含 `"*"` 以允许所有。

### [Microsoft Teams](https://docs.molt.bot/channels/msteams)

- 配置 Teams 应用 + Bot Framework，然后添加 `msteams` 配置部分。
- 通过 `msteams.allowFrom` 允许列表谁可以交谈；群组访问通过 `msteams.groupAllowFrom` 或 `msteams.groupPolicy: "open"`。

### [WebChat](https://docs.molt.bot/web/webchat)

- 使用网关 WebSocket；没有单独的 WebChat 端口/配置。

浏览器控制（可选）：

```json5
{
  browser: {
    enabled: true,
    color: "#FF4500"
  }
}
```

## 文档

当你完成引导流程并想要更深入的参考时使用这些：
- [从文档索引开始进行导航和"在哪里"。](https://docs.molt.bot)
- [阅读架构概述以了解网关 + 协议模型。](https://docs.molt.bot/concepts/architecture)
- [当你需要每个键和示例时，使用完整的配置参考。](https://docs.molt.bot/gateway/configuration)
- [按照运维手册规范运行网关。](https://docs.molt.bot/gateway)
- [了解控制 UI/Web 界面如何工作以及如何安全地暴露它们。](https://docs.molt.bot/web)
- [了解通过 SSH 隧道或 tailnets 的远程访问。](https://docs.molt.bot/gateway/remote)
- [按照引导向导流程进行设置指导。](https://docs.molt.bot/start/wizard)
- [通过 webhook 界面连接外部触发器。](https://docs.molt.bot/automation/webhook)
- [设置 Gmail Pub/Sub 触发器。](https://docs.molt.bot/automation/gmail-pubsub)
- [了解 macOS 菜单栏配套应用的详情。](https://docs.molt.bot/platforms/mac/menu-bar)
- [平台指南：Windows (WSL2)](https://docs.molt.bot/platforms/windows)、[Linux](https://docs.molt.bot/platforms/linux)、[macOS](https://docs.molt.bot/platforms/macos)、[iOS](https://docs.molt.bot/platforms/ios)、[Android](https://docs.molt.bot/platforms/android)
- [使用故障排除指南调试常见失败。](https://docs.molt.bot/channels/troubleshooting)
- [在暴露任何内容之前查看安全指南。](https://docs.molt.bot/gateway/security)

## 高级文档（发现 + 控制）

- [发现 + 传输](https://docs.molt.bot/gateway/discovery)
- [Bonjour/mDNS](https://docs.molt.bot/gateway/bonjour)
- [网关配对](https://docs.molt.bot/gateway/pairing)
- [远程网关 README](https://docs.molt.bot/gateway/remote-gateway-readme)
- [控制 UI](https://docs.molt.bot/web/control-ui)
- [仪表板](https://docs.molt.bot/web/dashboard)

## 运维与故障排除

- [健康检查](https://docs.molt.bot/gateway/health)
- [网关锁](https://docs.molt.bot/gateway/gateway-lock)
- [后台进程](https://docs.molt.bot/gateway/background-process)
- [浏览器故障排除 (Linux)](https://docs.molt.bot/tools/browser-linux-troubleshooting)
- [日志](https://docs.molt.bot/logging)

## 深入了解

- [代理循环](https://docs.molt.bot/concepts/agent-loop)
- [存在](https://docs.molt.bot/concepts/presence)
- [TypeBox 模式](https://docs.molt.bot/concepts/typebox)
- [RPC 适配器](https://docs.molt.bot/reference/rpc)
- [队列](https://docs.molt.bot/concepts/queue)

## 工作区与技能

- [技能配置](https://docs.molt.bot/tools/skills-config)
- [默认 AGENTS](https://docs.molt.bot/reference/AGENTS.default)
- [模板：AGENTS](https://docs.molt.bot/reference/templates/AGENTS)
- [模板：BOOTSTRAP](https://docs.molt.bot/reference/templates/BOOTSTRAP)
- [模板：IDENTITY](https://docs.molt.bot/reference/templates/IDENTITY)
- [模板：SOUL](https://docs.molt.bot/reference/templates/SOUL)
- [模板：TOOLS](https://docs.molt.bot/reference/templates/TOOLS)
- [模板：USER](https://docs.molt.bot/reference/templates/USER)

## 平台内部

- [macOS 开发设置](https://docs.molt.bot/platforms/mac/dev-setup)
- [macOS 菜单栏](https://docs.molt.bot/platforms/mac/menu-bar)
- [macOS 语音唤醒](https://docs.molt.bot/platforms/mac/voicewake)
- [iOS 节点](https://docs.molt.bot/platforms/ios)
- [Android 节点](https://docs.molt.bot/platforms/android)
- [Windows (WSL2)](https://docs.molt.bot/platforms/windows)
- [Linux 应用](https://docs.molt.bot/platforms/linux)

## 邮箱钩子（Gmail）

- [docs.molt.bot/gmail-pubsub](https://docs.molt.bot/automation/gmail-pubsub)

## Molty

OpenClaw 是为 **Molty** 构建的，一只太空龙虾 AI 助手。🦞
由 Peter Steinberger 和社区构建。

- [clawd.me](https://clawd.me)
- [soul.md](https://soul.md)
- [steipete.me](https://steipete.me)
- [@openclaw](https://x.com/moltbot)

## 社区

查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南、维护者以及如何提交 PR。
AI/vibe-coded PR 欢迎！🤖

特别感谢 [Mario Zechner](https://mariozechner.at/) 的支持以及 [pi-mono](https://github.com/badlogic/pi-mono)。

感谢所有贡献者，详见 GitHub 贡献者列表。
