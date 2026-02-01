[English](README_EN.md) | 中文

# 🦞 OpenClaw — 中文本地化个人 AI 助手

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/moltbot/moltbot/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/moltbot/moltbot/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>🇨🇳 专为中文用户优化的 AI 助手</strong>
</p>

<p align="center">
  <a href="https://github.com/GuLu9527/openclaw/actions"><img src="https://img.shields.io/github/actions/workflow/status/GuLu9527/openclaw/ci.yml?branch=main&style=for-the-badge&label=构建" alt="CI 状态"></a>
  <a href="https://github.com/GuLu9527/openclaw/releases"><img src="https://img.shields.io/github/v/release/GuLu9527/openclaw?include_prereleases&style=for-the-badge&label=版本" alt="GitHub 发布"></a>
  <a href="https://www.npmjs.com/package/@gulu9527/openclaw"><img src="https://img.shields.io/npm/v/@gulu9527/openclaw?style=for-the-badge&label=NPM" alt="NPM 版本"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/许可证-MIT-blue.svg?style=for-the-badge" alt="MIT 许可证"></a>
</p>

---

## 📌 项目简介

**OpenClaw** 是 [moltbot/moltbot](https://github.com/moltbot/moltbot) 的中文本地化分支，专为中文用户打造。

### ✨ 本项目特色

| 特性 | 说明 |
|------|------|
| 🌏 **完整中文化** | 所有界面、命令、提示均已汉化 |
| 🔄 **上游同步** | 定期合并上游更新，保持功能最新 |
| 📖 **中文文档** | 本地化的使用文档和指南 |
| 🛠️ **混合格式** | 技术术语采用"中文 English"格式，便于识别 |

### 🔗 相关链接

- **本仓库**: https://github.com/GuLu9527/openclaw
- **上游项目**: https://github.com/moltbot/moltbot
- **上游文档**: https://docs.molt.bot
- **NPM 包**: [@gulu9527/openclaw](https://www.npmjs.com/package/@gulu9527/openclaw)

---

## 🚀 快速开始

### 系统要求

- **Node.js ≥22**
- 支持 npm、pnpm 或 bun

### 安装

```bash
# 使用 npm 安装（推荐）
npm install -g @gulu9527/openclaw@latest

# 或使用 pnpm
pnpm add -g @gulu9527/openclaw@latest

# 运行引导向导
openclaw onboard --install-daemon
```

### 启动网关

```bash
# 启动网关服务
openclaw gateway run --port 18789

# 发送消息测试
openclaw message send --to +1234567890 --message "你好，来自 OpenClaw"

# 与助手对话
openclaw agent --message "帮我列个待办清单" --thinking high
```

---

## 🎯 核心功能

### 多渠道支持

OpenClaw 支持在多个平台上回复消息：

| 内置渠道 | 扩展渠道 |
|---------|---------|
| WhatsApp | BlueBubbles |
| Telegram | Microsoft Teams |
| Slack | Matrix |
| Discord | Zalo |
| Google Chat | Zalo Personal |
| Signal | 语音通话 |
| iMessage | |
| WebChat | |

### 主要特性

- 🏠 **本地优先网关** — 会话、渠道、工具和事件的单一控制平面
- 🔀 **多代理路由** — 将不同渠道/账户路由到隔离的代理
- 🎙️ **语音交互** — 语音唤醒 + 对话模式（macOS/iOS/Android）
- 🖼️ **实时 Canvas** — 代理驱动的可视化工作区
- 🛠️ **丰富工具** — 浏览器控制、Canvas、节点、定时任务等
- 📱 **配套应用** — macOS 菜单栏应用 + iOS/Android 节点

---

## 📦 从源码构建

```bash
# 克隆仓库
git clone https://github.com/GuLu9527/openclaw.git
cd openclaw

# 安装依赖
pnpm install

# 构建前端和后端
pnpm ui:build
pnpm build

# 运行引导向导
pnpm openclaw onboard --install-daemon

# 开发模式（自动重载）
pnpm gateway:watch
```

---

## ⚙️ 配置示例

最小配置 `~/.clawdbot/openclaw.json`：

```json5
{
  // 模型配置
  agent: {
    model: "anthropic/claude-opus-4-5"
  },
  
  // 网关配置
  gateway: {
    mode: "local",
    port: 18789
  }
}
```

### 渠道配置示例

<details>
<summary>Telegram 配置</summary>

```json5
{
  channels: {
    telegram: {
      botToken: "你的Bot Token"
    }
  }
}
```
</details>

<details>
<summary>Discord 配置</summary>

```json5
{
  channels: {
    discord: {
      token: "你的Bot Token"
    }
  }
}
```
</details>

<details>
<summary>WhatsApp 配置</summary>

```bash
# 链接设备
openclaw channels login
```
</details>

---

## 💬 聊天命令

在支持的渠道中发送以下命令：

| 命令 | 说明 |
|------|------|
| `/status` | 查看会话状态 |
| `/new` 或 `/reset` | 重置会话 |
| `/compact` | 压缩上下文 |
| `/think <level>` | 设置思考级别 (off/low/medium/high) |
| `/verbose on/off` | 详细模式开关 |
| `/usage off/tokens/full` | 使用量显示 |
| `/restart` | 重启网关 |

---

## 🔒 安全说明

OpenClaw 连接到真实的即时通讯界面。请将入站 DM 视为**不可信输入**。

### 默认安全策略

- **DM 配对** (`dmPolicy="pairing"`): 未知发送者需要配对码验证
- 使用 `openclaw pairing approve <channel> <code>` 批准配对
- 运行 `openclaw doctor` 检查安全配置

详情请参阅：[安全指南](https://docs.molt.bot/gateway/security)

---

## 🏗️ 架构概览

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat / ...
               │
               ▼
┌───────────────────────────────────┐
│             网关 Gateway           │
│          (控制平面)                │
│       ws://127.0.0.1:18789        │
└──────────────┬────────────────────┘
               │
               ├─ Pi 代理 (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS 应用
               └─ iOS / Android 节点
```

---

## 📚 文档资源

| 文档 | 说明 |
|------|------|
| [开始使用](https://docs.molt.bot/start/getting-started) | 初学者指南 |
| [配置参考](https://docs.molt.bot/gateway/configuration) | 完整配置说明 |
| [渠道设置](https://docs.molt.bot/channels) | 各渠道配置 |
| [工具文档](https://docs.molt.bot/tools) | 可用工具说明 |
| [安全指南](https://docs.molt.bot/gateway/security) | 安全最佳实践 |
| [故障排除](https://docs.molt.bot/channels/troubleshooting) | 常见问题解决 |

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

- 提交前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)
- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 中文化相关的 PR 请使用中文提交信息

### 本地化贡献

如果你想帮助改进中文本地化：

1. 查看 `src/i18n/zh-CN.ts` 了解翻译结构
2. 阅读 `docs/i18n-guidelines.md` 了解翻译规范
3. 技术术语使用"中文 English"混合格式

---

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

## 🙏 致谢

- 感谢 [moltbot/moltbot](https://github.com/moltbot/moltbot) 上游项目
- 感谢 Peter Steinberger 和社区的贡献
- 感谢所有帮助改进中文本地化的贡献者

---

<p align="center">
  <strong>🦞 OpenClaw — 让 AI 助手说中文</strong>
</p>
