import { CHANNEL_IDS } from "../channels/registry.js";
import { VERSION } from "../version.js";
import { MoltbotSchema } from "./zod-schema.js";

export type ConfigUiHint = {
  label?: string;
  help?: string;
  group?: string;
  order?: number;
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  itemTemplate?: unknown;
};

export type ConfigUiHints = Record<string, ConfigUiHint>;

export type ConfigSchema = ReturnType<typeof MoltbotSchema.toJSONSchema>;

type JsonSchemaNode = Record<string, unknown>;

export type ConfigSchemaResponse = {
  schema: ConfigSchema;
  uiHints: ConfigUiHints;
  version: string;
  generatedAt: string;
};

export type PluginUiMetadata = {
  id: string;
  name?: string;
  description?: string;
  configUiHints?: Record<
    string,
    Pick<ConfigUiHint, "label" | "help" | "advanced" | "sensitive" | "placeholder">
  >;
  configSchema?: JsonSchemaNode;
};

export type ChannelUiMetadata = {
  id: string;
  label?: string;
  description?: string;
  configSchema?: JsonSchemaNode;
  configUiHints?: Record<string, ConfigUiHint>;
};

// 配置分组标签（混合格式：便于与 config 路径对应）
const GROUP_LABELS: Record<string, string> = {
  // 基础配置
  env: "环境变量 env",
  meta: "元数据 meta",
  update: "更新 update",
  wizard: "向导 wizard",
  // 核心功能
  agents: "代理 agents",
  auth: "认证 auth",
  channels: "渠道 channels",
  messages: "消息 messages",
  commands: "命令 commands",
  hooks: "钩子 hooks",
  skills: "技能 skills",
  tools: "工具 tools",
  // 网关和节点
  gateway: "网关 gateway",
  nodeHost: "节点主机 nodeHost",
  // 诊断和日志
  diagnostics: "诊断 diagnostics",
  logging: "日志 logging",
  // 界面和浏览器
  ui: "界面 ui",
  browser: "浏览器 browser",
  // 模型和绑定
  models: "模型 models",
  bindings: "绑定 bindings",
  // 媒体和音频
  broadcast: "广播 broadcast",
  audio: "音频 audio",
  media: "媒体 media",
  // 审批和会话
  approvals: "审批 approvals",
  session: "会话 session",
  // 定时任务和 Web
  cron: "定时任务 cron",
  web: "Web",
  // 发现和画布
  discovery: "发现 discovery",
  canvasHost: "画布主机 canvasHost",
  // 语音
  talk: "语音 talk",
  // 插件
  plugins: "插件 plugins",
  // 在线状态
  presence: "在线状态 presence",
  voicewake: "语音唤醒 voicewake",
};

const GROUP_ORDER: Record<string, number> = {
  // 基础配置
  env: 10,
  meta: 15,
  update: 20,
  wizard: 25,
  // 核心功能
  agents: 30,
  auth: 35,
  channels: 40,
  messages: 45,
  commands: 50,
  hooks: 55,
  skills: 60,
  tools: 65,
  // 网关和节点
  gateway: 70,
  nodeHost: 75,
  // 诊断和日志
  diagnostics: 80,
  logging: 85,
  // 界面和浏览器
  ui: 90,
  browser: 95,
  // 模型和绑定
  models: 100,
  bindings: 105,
  // 媒体和音频
  broadcast: 110,
  audio: 115,
  media: 120,
  // 审批和会话
  approvals: 125,
  session: 130,
  // 定时任务和 Web
  cron: 135,
  web: 140,
  // 发现和画布
  discovery: 145,
  canvasHost: 150,
  // 语音
  talk: 155,
  // 插件
  plugins: 160,
  presence: 165,
  voicewake: 170,
};

const FIELD_LABELS: Record<string, string> = {
  // 元数据 meta
  "meta.lastTouchedVersion": "最后修改版本 (meta.lastTouchedVersion)",
  "meta.lastTouchedAt": "最后修改时间 (meta.lastTouchedAt)",
  // 更新 update
  "update.channel": "更新渠道 (update.channel)",
  "update.checkOnStart": "启动时检查更新 (update.checkOnStart)",
  // 诊断 diagnostics
  "diagnostics.enabled": "启用诊断 (diagnostics.enabled)",
  "diagnostics.flags": "诊断标志 (diagnostics.flags)",
  "diagnostics.otel.enabled": "启用 OpenTelemetry (diagnostics.otel.enabled)",
  "diagnostics.otel.endpoint": "OTel 端点 (diagnostics.otel.endpoint)",
  "diagnostics.otel.protocol": "OTel 协议 (diagnostics.otel.protocol)",
  "diagnostics.otel.headers": "OTel 请求头 (diagnostics.otel.headers)",
  "diagnostics.otel.serviceName": "OTel 服务名称 (diagnostics.otel.serviceName)",
  "diagnostics.otel.traces": "启用 OTel 追踪 (diagnostics.otel.traces)",
  "diagnostics.otel.metrics": "启用 OTel 指标 (diagnostics.otel.metrics)",
  "diagnostics.otel.logs": "启用 OTel 日志 (diagnostics.otel.logs)",
  "diagnostics.otel.sampleRate": "OTel 采样率 (diagnostics.otel.sampleRate)",
  "diagnostics.otel.flushIntervalMs": "OTel 刷新间隔 (diagnostics.otel.flushIntervalMs)",
  "diagnostics.cacheTrace.enabled": "启用缓存追踪 (diagnostics.cacheTrace.enabled)",
  "diagnostics.cacheTrace.filePath": "缓存追踪路径 (diagnostics.cacheTrace.filePath)",
  "diagnostics.cacheTrace.includeMessages": "追踪包含消息 (diagnostics.cacheTrace.includeMessages)",
  "diagnostics.cacheTrace.includePrompt": "追踪包含提示词 (diagnostics.cacheTrace.includePrompt)",
  "diagnostics.cacheTrace.includeSystem": "追踪包含系统信息 (diagnostics.cacheTrace.includeSystem)",
  // 代理 agents
  "agents.list.*.identity.avatar": "身份头像 (agents.list.*.identity.avatar)",
  // 网关 gateway
  "gateway.remote.url": "远程网关 URL (gateway.remote.url)",
  "gateway.remote.sshTarget": "远程 SSH 目标 (gateway.remote.sshTarget)",
  "gateway.remote.sshIdentity": "远程 SSH 身份 (gateway.remote.sshIdentity)",
  "gateway.remote.token": "远程网关令牌 (gateway.remote.token)",
  "gateway.remote.password": "远程网关密码 (gateway.remote.password)",
  "gateway.remote.tlsFingerprint": "远程 TLS 指纹 (gateway.remote.tlsFingerprint)",
  "gateway.auth.token": "网关令牌 (gateway.auth.token)",
  "gateway.auth.password": "网关密码 (gateway.auth.password)",
  // 工具 - 媒体 tools.media
  "tools.media.image.enabled": "启用图像理解 (tools.media.image.enabled)",
  "tools.media.image.maxBytes": "图像最大字节 (tools.media.image.maxBytes)",
  "tools.media.image.maxChars": "图像最大字符 (tools.media.image.maxChars)",
  "tools.media.image.prompt": "图像提示词 (tools.media.image.prompt)",
  "tools.media.image.timeoutSeconds": "图像超时秒数 (tools.media.image.timeoutSeconds)",
  "tools.media.image.attachments": "图像附件策略 (tools.media.image.attachments)",
  "tools.media.image.models": "图像理解模型 (tools.media.image.models)",
  "tools.media.image.scope": "图像作用域 (tools.media.image.scope)",
  "tools.media.models": "媒体共享模型 (tools.media.models)",
  "tools.media.concurrency": "媒体并发数 (tools.media.concurrency)",
  "tools.media.audio.enabled": "启用音频理解 (tools.media.audio.enabled)",
  "tools.media.audio.maxBytes": "音频最大字节 (tools.media.audio.maxBytes)",
  "tools.media.audio.maxChars": "音频最大字符 (tools.media.audio.maxChars)",
  "tools.media.audio.prompt": "音频提示词 (tools.media.audio.prompt)",
  "tools.media.audio.timeoutSeconds": "音频超时秒数 (tools.media.audio.timeoutSeconds)",
  "tools.media.audio.language": "音频识别语言 (tools.media.audio.language)",
  "tools.media.audio.attachments": "音频附件策略 (tools.media.audio.attachments)",
  "tools.media.audio.models": "音频理解模型 (tools.media.audio.models)",
  "tools.media.audio.scope": "音频作用域 (tools.media.audio.scope)",
  "tools.media.video.enabled": "启用视频理解 (tools.media.video.enabled)",
  "tools.media.video.maxBytes": "视频最大字节 (tools.media.video.maxBytes)",
  "tools.media.video.maxChars": "视频最大字符 (tools.media.video.maxChars)",
  "tools.media.video.prompt": "视频提示词 (tools.media.video.prompt)",
  "tools.media.video.timeoutSeconds": "视频超时秒数 (tools.media.video.timeoutSeconds)",
  "tools.media.video.attachments": "视频附件策略 (tools.media.video.attachments)",
  "tools.media.video.models": "视频理解模型 (tools.media.video.models)",
  "tools.media.video.scope": "视频作用域 (tools.media.video.scope)",
  // 工具 - 链接 tools.links
  "tools.links.enabled": "启用链接理解 (tools.links.enabled)",
  "tools.links.maxLinks": "最大链接数 (tools.links.maxLinks)",
  "tools.links.timeoutSeconds": "链接超时秒数 (tools.links.timeoutSeconds)",
  "tools.links.models": "链接理解模型 (tools.links.models)",
  "tools.links.scope": "链接作用域 (tools.links.scope)",
  // 工具配置 tools
  "tools.profile": "工具配置文件 (tools.profile)",
  "tools.alsoAllow": "工具允许列表 (tools.alsoAllow)",
  "agents.list[].tools.profile": "代理工具配置 (agents.list[].tools.profile)",
  "agents.list[].tools.alsoAllow": "代理工具允许列表 (agents.list[].tools.alsoAllow)",
  "tools.byProvider": "按提供商策略 (tools.byProvider)",
  "agents.list[].tools.byProvider": "代理按提供商策略 (agents.list[].tools.byProvider)",
  // 工具 - 执行审批 tools.exec (Approvals)
  "tools.exec.applyPatch.enabled": "启用 apply_patch (tools.exec.applyPatch.enabled)",
  "tools.exec.applyPatch.allowModels": "apply_patch 白名单 (tools.exec.applyPatch.allowModels)",
  "tools.exec.notifyOnExit": "退出时通知 (tools.exec.notifyOnExit)",
  "tools.exec.approvalRunningNoticeMs": "审批运行通知 (tools.exec.approvalRunningNoticeMs)",
  "tools.exec.host": "执行主机 (tools.exec.host)",
  "tools.exec.security": "安全策略 (tools.exec.security)",
  "tools.exec.ask": "询问策略 (tools.exec.ask)",
  "tools.exec.node": "节点绑定 (tools.exec.node)",
  "tools.exec.pathPrepend": "PATH 前置 (tools.exec.pathPrepend)",
  "tools.exec.safeBins": "安全二进制 (tools.exec.safeBins)",
  // 工具 - 消息 tools.message
  "tools.message.allowCrossContextSend": "跨上下文发送 (tools.message.allowCrossContextSend)",
  "tools.message.crossContext.allowWithinProvider":
    "同提供商跨上下文 (tools.message.crossContext.allowWithinProvider)",
  "tools.message.crossContext.allowAcrossProviders":
    "跨提供商跨上下文 (tools.message.crossContext.allowAcrossProviders)",
  "tools.message.crossContext.marker.enabled":
    "跨上下文标记 (tools.message.crossContext.marker.enabled)",
  "tools.message.crossContext.marker.prefix": "标记前缀 (tools.message.crossContext.marker.prefix)",
  "tools.message.crossContext.marker.suffix": "标记后缀 (tools.message.crossContext.marker.suffix)",
  "tools.message.broadcast.enabled": "启用广播 (tools.message.broadcast.enabled)",
  // 工具 - Web tools.web
  "tools.web.search.enabled": "启用网络搜索 (tools.web.search.enabled)",
  "tools.web.search.provider": "搜索提供商 (tools.web.search.provider)",
  "tools.web.search.apiKey": "Brave API 密钥 (tools.web.search.apiKey)",
  "tools.web.search.maxResults": "最大搜索结果 (tools.web.search.maxResults)",
  "tools.web.search.timeoutSeconds": "搜索超时秒数 (tools.web.search.timeoutSeconds)",
  "tools.web.search.cacheTtlMinutes": "搜索缓存 TTL (tools.web.search.cacheTtlMinutes)",
  "tools.web.fetch.enabled": "启用网络抓取 (tools.web.fetch.enabled)",
  "tools.web.fetch.maxChars": "抓取最大字符 (tools.web.fetch.maxChars)",
  "tools.web.fetch.timeoutSeconds": "抓取超时秒数 (tools.web.fetch.timeoutSeconds)",
  "tools.web.fetch.cacheTtlMinutes": "抓取缓存 TTL (tools.web.fetch.cacheTtlMinutes)",
  "tools.web.fetch.maxRedirects": "最大重定向次数 (tools.web.fetch.maxRedirects)",
  "tools.web.fetch.userAgent": "User-Agent (tools.web.fetch.userAgent)",
  // 网关 - 控制 UI gateway.controlUi
  "gateway.controlUi.basePath": "控制 UI 路径 (gateway.controlUi.basePath)",
  "gateway.controlUi.allowInsecureAuth": "允许不安全认证 (gateway.controlUi.allowInsecureAuth)",
  "gateway.controlUi.dangerouslyDisableDeviceAuth":
    "禁用设备认证 (gateway.controlUi.dangerouslyDisableDeviceAuth)",
  "gateway.http.endpoints.chatCompletions.enabled":
    "聊天补全端点 (gateway.http.endpoints.chatCompletions.enabled)",
  "gateway.reload.mode": "重载模式 (gateway.reload.mode)",
  "gateway.reload.debounceMs": "重载防抖 (gateway.reload.debounceMs)",
  "gateway.nodes.browser.mode": "浏览器模式 (gateway.nodes.browser.mode)",
  "gateway.nodes.browser.node": "浏览器节点 (gateway.nodes.browser.node)",
  "gateway.nodes.allowCommands": "节点允许命令 (gateway.nodes.allowCommands)",
  "gateway.nodes.denyCommands": "节点禁止命令 (gateway.nodes.denyCommands)",
  // 节点主机 nodeHost
  "nodeHost.browserProxy.enabled": "浏览器代理 (nodeHost.browserProxy.enabled)",
  "nodeHost.browserProxy.allowProfiles": "代理配置文件 (nodeHost.browserProxy.allowProfiles)",
  // 技能 skills
  "skills.load.watch": "监视技能 (skills.load.watch)",
  "skills.load.watchDebounceMs": "监视防抖 (skills.load.watchDebounceMs)",
  // 代理默认设置 agents.defaults
  "agents.defaults.workspace": "工作区 (agents.defaults.workspace)",
  "agents.defaults.repoRoot": "仓库根目录 (agents.defaults.repoRoot)",
  "agents.defaults.bootstrapMaxChars": "引导最大字符 (agents.defaults.bootstrapMaxChars)",
  "agents.defaults.envelopeTimezone": "信封时区 (agents.defaults.envelopeTimezone)",
  "agents.defaults.envelopeTimestamp": "信封时间戳 (agents.defaults.envelopeTimestamp)",
  "agents.defaults.envelopeElapsed": "信封经过时间 (agents.defaults.envelopeElapsed)",
  // 代理 - 记忆搜索 agents.defaults.memorySearch
  "agents.defaults.memorySearch": "记忆搜索 (agents.defaults.memorySearch)",
  "agents.defaults.memorySearch.enabled": "启用记忆搜索 (memorySearch.enabled)",
  "agents.defaults.memorySearch.sources": "记忆源 (memorySearch.sources)",
  "agents.defaults.memorySearch.extraPaths": "额外路径 (memorySearch.extraPaths)",
  "agents.defaults.memorySearch.experimental.sessionMemory":
    "会话索引 (memorySearch.experimental.sessionMemory)",
  "agents.defaults.memorySearch.provider": "搜索提供商 (memorySearch.provider)",
  "agents.defaults.memorySearch.remote.baseUrl": "远程嵌入 URL (memorySearch.remote.baseUrl)",
  "agents.defaults.memorySearch.remote.apiKey": "远程嵌入密钥 (memorySearch.remote.apiKey)",
  "agents.defaults.memorySearch.remote.headers": "远程请求头 (memorySearch.remote.headers)",
  "agents.defaults.memorySearch.remote.batch.concurrency":
    "批处理并发 (memorySearch.remote.batch.concurrency)",
  "agents.defaults.memorySearch.model": "搜索模型 (memorySearch.model)",
  "agents.defaults.memorySearch.fallback": "搜索回退 (memorySearch.fallback)",
  "agents.defaults.memorySearch.local.modelPath": "本地模型路径 (memorySearch.local.modelPath)",
  "agents.defaults.memorySearch.store.path": "索引路径 (memorySearch.store.path)",
  "agents.defaults.memorySearch.store.vector.enabled":
    "向量索引 (memorySearch.store.vector.enabled)",
  "agents.defaults.memorySearch.store.vector.extensionPath":
    "向量扩展路径 (memorySearch.store.vector.extensionPath)",
  "agents.defaults.memorySearch.chunking.tokens": "块令牌数 (memorySearch.chunking.tokens)",
  "agents.defaults.memorySearch.chunking.overlap": "块重叠数 (memorySearch.chunking.overlap)",
  "agents.defaults.memorySearch.sync.onSessionStart":
    "会话启动索引 (memorySearch.sync.onSessionStart)",
  "agents.defaults.memorySearch.sync.onSearch": "搜索时索引 (memorySearch.sync.onSearch)",
  "agents.defaults.memorySearch.sync.watch": "监视记忆 (memorySearch.sync.watch)",
  "agents.defaults.memorySearch.sync.watchDebounceMs":
    "监视防抖 (memorySearch.sync.watchDebounceMs)",
  "agents.defaults.memorySearch.sync.sessions.deltaBytes":
    "会话增量字节 (memorySearch.sync.sessions.deltaBytes)",
  "agents.defaults.memorySearch.sync.sessions.deltaMessages":
    "会话增量消息 (memorySearch.sync.sessions.deltaMessages)",
  "agents.defaults.memorySearch.query.maxResults": "最大结果数 (memorySearch.query.maxResults)",
  "agents.defaults.memorySearch.query.minScore": "最小分数 (memorySearch.query.minScore)",
  "agents.defaults.memorySearch.query.hybrid.enabled":
    "混合模式 (memorySearch.query.hybrid.enabled)",
  "agents.defaults.memorySearch.query.hybrid.vectorWeight":
    "向量权重 (memorySearch.query.hybrid.vectorWeight)",
  "agents.defaults.memorySearch.query.hybrid.textWeight":
    "文本权重 (memorySearch.query.hybrid.textWeight)",
  "agents.defaults.memorySearch.query.hybrid.candidateMultiplier":
    "候选乘数 (memorySearch.query.hybrid.candidateMultiplier)",
  "agents.defaults.memorySearch.cache.enabled": "嵌入缓存 (memorySearch.cache.enabled)",
  "agents.defaults.memorySearch.cache.maxEntries": "缓存最大条目 (memorySearch.cache.maxEntries)",
  // 认证 auth
  "auth.profiles": "认证配置文件 (auth.profiles)",
  "auth.order": "认证顺序 (auth.order)",
  "auth.cooldowns.billingBackoffHours": "计费退避小时 (auth.cooldowns.billingBackoffHours)",
  "auth.cooldowns.billingBackoffHoursByProvider":
    "计费退避覆盖 (auth.cooldowns.billingBackoffHoursByProvider)",
  "auth.cooldowns.billingMaxHours": "计费退避上限 (auth.cooldowns.billingMaxHours)",
  "auth.cooldowns.failureWindowHours": "故障窗口小时 (auth.cooldowns.failureWindowHours)",
  // 代理 - 模型 agents.defaults.model
  "agents.defaults.models": "模型配置 (agents.defaults.models)",
  "agents.defaults.model.primary": "主要模型 (agents.defaults.model.primary)",
  "agents.defaults.model.fallbacks": "模型回退 (agents.defaults.model.fallbacks)",
  "agents.defaults.imageModel.primary": "图像模型 (agents.defaults.imageModel.primary)",
  "agents.defaults.imageModel.fallbacks": "图像模型回退 (agents.defaults.imageModel.fallbacks)",
  "agents.defaults.humanDelay.mode": "类人延迟模式 (agents.defaults.humanDelay.mode)",
  "agents.defaults.humanDelay.minMs": "类人延迟最小 (agents.defaults.humanDelay.minMs)",
  "agents.defaults.humanDelay.maxMs": "类人延迟最大 (agents.defaults.humanDelay.maxMs)",
  "agents.defaults.cliBackends": "CLI 后端 (agents.defaults.cliBackends)",
  // 命令 commands
  "commands.native": "原生命令 (commands.native)",
  "commands.nativeSkills": "原生技能命令 (commands.nativeSkills)",
  "commands.text": "文本命令 (commands.text)",
  "commands.bash": "允许 Bash 命令 (commands.bash)",
  "commands.bashForegroundMs": "Bash 前台窗口 (commands.bashForegroundMs)",
  "commands.config": "允许 /config (commands.config)",
  "commands.debug": "允许 /debug (commands.debug)",
  "commands.restart": "允许重启 (commands.restart)",
  "commands.useAccessGroups": "访问组 (commands.useAccessGroups)",
  // 界面 ui
  "ui.seamColor": "强调色 (ui.seamColor)",
  "ui.assistant.name": "助手名称 (ui.assistant.name)",
  "ui.assistant.avatar": "助手头像 (ui.assistant.avatar)",
  // 浏览器 browser
  "browser.evaluateEnabled": "浏览器评估 (browser.evaluateEnabled)",
  "browser.snapshotDefaults": "快照默认值 (browser.snapshotDefaults)",
  "browser.snapshotDefaults.mode": "快照模式 (browser.snapshotDefaults.mode)",
  "browser.remoteCdpTimeoutMs": "CDP 超时 (browser.remoteCdpTimeoutMs)",
  "browser.remoteCdpHandshakeTimeoutMs": "CDP 握手超时 (browser.remoteCdpHandshakeTimeoutMs)",
  // 会话 session
  "session.dmScope": "私信作用域 (session.dmScope)",
  "session.agentToAgent.maxPingPongTurns": "代理间回合数 (session.agentToAgent.maxPingPongTurns)",
  // 消息 messages
  "messages.ackReaction": "确认反应 (messages.ackReaction)",
  "messages.ackReactionScope": "确认作用域 (messages.ackReactionScope)",
  "messages.inbound.debounceMs": "入站防抖 (messages.inbound.debounceMs)",
  // 语音 talk
  "talk.apiKey": "Talk API 密钥 (talk.apiKey)",
  // 渠道 channels
  "channels.whatsapp": "WhatsApp (channels.whatsapp)",
  "channels.telegram": "Telegram (channels.telegram)",
  "channels.telegram.customCommands": "自定义命令 (telegram.customCommands)",
  "channels.discord": "Discord (channels.discord)",
  "channels.slack": "Slack (channels.slack)",
  "channels.mattermost": "Mattermost (channels.mattermost)",
  "channels.signal": "Signal (channels.signal)",
  "channels.imessage": "iMessage (channels.imessage)",
  "channels.bluebubbles": "BlueBubbles (channels.bluebubbles)",
  "channels.msteams": "MS Teams (channels.msteams)",
  "channels.telegram.botToken": "机器人令牌 (telegram.botToken)",
  "channels.telegram.dmPolicy": "私信策略 (telegram.dmPolicy)",
  "channels.telegram.streamMode": "草稿流模式 (telegram.streamMode)",
  "channels.telegram.draftChunk.minChars": "草稿最小字符 (telegram.draftChunk.minChars)",
  "channels.telegram.draftChunk.maxChars": "草稿最大字符 (telegram.draftChunk.maxChars)",
  "channels.telegram.draftChunk.breakPreference": "草稿断点 (telegram.draftChunk.breakPreference)",
  "channels.telegram.retry.attempts": "重试次数 (telegram.retry.attempts)",
  "channels.telegram.retry.minDelayMs": "重试最小延迟 (telegram.retry.minDelayMs)",
  "channels.telegram.retry.maxDelayMs": "重试最大延迟 (telegram.retry.maxDelayMs)",
  "channels.telegram.retry.jitter": "重试抖动 (telegram.retry.jitter)",
  "channels.telegram.network.autoSelectFamily": "自动选择协议 (telegram.network.autoSelectFamily)",
  "channels.telegram.timeoutSeconds": "API 超时 (telegram.timeoutSeconds)",
  "channels.telegram.capabilities.inlineButtons": "内联按钮 (telegram.capabilities.inlineButtons)",
  "channels.whatsapp.dmPolicy": "私信策略 (whatsapp.dmPolicy)",
  "channels.whatsapp.selfChatMode": "自聊模式 (whatsapp.selfChatMode)",
  "channels.whatsapp.debounceMs": "消息防抖 (whatsapp.debounceMs)",
  "channels.signal.dmPolicy": "私信策略 (signal.dmPolicy)",
  "channels.imessage.dmPolicy": "私信策略 (imessage.dmPolicy)",
  "channels.bluebubbles.dmPolicy": "私信策略 (bluebubbles.dmPolicy)",
  "channels.discord.dm.policy": "私信策略 (discord.dm.policy)",
  "channels.discord.retry.attempts": "重试次数 (discord.retry.attempts)",
  "channels.discord.retry.minDelayMs": "重试最小延迟 (discord.retry.minDelayMs)",
  "channels.discord.retry.maxDelayMs": "重试最大延迟 (discord.retry.maxDelayMs)",
  "channels.discord.retry.jitter": "重试抖动 (discord.retry.jitter)",
  "channels.discord.maxLinesPerMessage": "每条消息行数 (discord.maxLinesPerMessage)",
  "channels.discord.intents.presence": "在线状态意图 (discord.intents.presence)",
  "channels.discord.intents.guildMembers": "公会成员意图 (discord.intents.guildMembers)",
  "channels.slack.dm.policy": "私信策略 (slack.dm.policy)",
  "channels.slack.allowBots": "允许机器人 (slack.allowBots)",
  "channels.discord.token": "机器人令牌 (discord.token)",
  "channels.slack.botToken": "机器人令牌 (slack.botToken)",
  "channels.slack.appToken": "应用令牌 (slack.appToken)",
  "channels.slack.userToken": "用户令牌 (slack.userToken)",
  "channels.slack.userTokenReadOnly": "用户令牌只读 (slack.userTokenReadOnly)",
  "channels.slack.thread.historyScope": "线程历史作用域 (slack.thread.historyScope)",
  "channels.slack.thread.inheritParent": "线程继承父级 (slack.thread.inheritParent)",
  "channels.mattermost.botToken": "机器人令牌 (mattermost.botToken)",
  "channels.mattermost.baseUrl": "基础 URL (mattermost.baseUrl)",
  "channels.mattermost.chatmode": "聊天模式 (mattermost.chatmode)",
  "channels.mattermost.oncharPrefixes": "触发前缀 (mattermost.oncharPrefixes)",
  "channels.mattermost.requireMention": "需要提及 (mattermost.requireMention)",
  "channels.signal.account": "账户 (signal.account)",
  "channels.imessage.cliPath": "CLI 路径 (imessage.cliPath)",
  "agents.list[].identity.avatar": "代理头像 (agents.list[].identity.avatar)",
  // 发现 discovery
  "discovery.mdns.mode": "mDNS 模式 (discovery.mdns.mode)",
  // 插件 plugins
  "plugins.enabled": "启用插件 (plugins.enabled)",
  "plugins.allow": "插件白名单 (plugins.allow)",
  "plugins.deny": "插件黑名单 (plugins.deny)",
  "plugins.load.paths": "加载路径 (plugins.load.paths)",
  "plugins.slots": "插件插槽 (plugins.slots)",
  "plugins.slots.memory": "记忆插件 (plugins.slots.memory)",
  "plugins.entries": "插件条目 (plugins.entries)",
  "plugins.entries.*.enabled": "已启用 (plugins.entries.*.enabled)",
  "plugins.entries.*.config": "插件配置 (plugins.entries.*.config)",
  "plugins.installs": "安装记录 (plugins.installs)",
  "plugins.installs.*.source": "安装源 (plugins.installs.*.source)",
  "plugins.installs.*.spec": "安装规范 (plugins.installs.*.spec)",
  "plugins.installs.*.sourcePath": "源路径 (plugins.installs.*.sourcePath)",
  "plugins.installs.*.installPath": "安装路径 (plugins.installs.*.installPath)",
  "plugins.installs.*.version": "安装版本 (plugins.installs.*.version)",
  "plugins.installs.*.installedAt": "安装时间 (plugins.installs.*.installedAt)",
};

const FIELD_HELP: Record<string, string> = {
  "meta.lastTouchedVersion": "当 Moltbot 写入配置时自动设置。",
  "meta.lastTouchedAt": "最后一次配置写入的 ISO 时间戳（自动设置）。",
  "update.channel": 'Git + npm 安装的更新渠道（"stable"、"beta" 或 "dev"）。',
  "update.checkOnStart": "网关启动时检查 npm 更新（默认：true）。",
  "gateway.remote.url": "远程网关 WebSocket URL（ws:// 或 wss://）。",
  "gateway.remote.tlsFingerprint": "远程网关的预期 sha256 TLS 指纹（固定以避免中间人攻击）。",
  "gateway.remote.sshTarget":
    "通过 SSH 连接远程网关（将网关端口隧道到 localhost）。格式：user@host 或 user@host:port。",
  "gateway.remote.sshIdentity": "可选的 SSH 身份文件路径（传递给 ssh -i）。",
  "agents.list[].identity.avatar": "头像图片路径（仅相对于代理工作区）或远程 URL/data URL。",
  "discovery.mdns.mode":
    'mDNS 广播模式（"minimal" 默认，"full" 包含 cliPath/sshPort，"off" 禁用 mDNS）。',
  "gateway.auth.token":
    "默认情况下网关访问所需（除非使用 Tailscale Serve 身份）；非环回绑定时必需。",
  "gateway.auth.password": "Tailscale funnel 所需。",
  "gateway.controlUi.basePath": "控制 UI 服务的可选 URL 前缀（例如 /moltbot）。",
  "gateway.controlUi.allowInsecureAuth":
    "允许通过不安全的 HTTP 进行控制 UI 认证（仅令牌；不推荐）。",
  "gateway.controlUi.dangerouslyDisableDeviceAuth":
    "危险。禁用控制 UI 设备身份检查（仅令牌/密码）。",
  "gateway.http.endpoints.chatCompletions.enabled":
    "启用 OpenAI 兼容的 `POST /v1/chat/completions` 端点（默认：false）。",
  "gateway.reload.mode": '配置更改的热重载策略（推荐 "hybrid"）。',
  "gateway.reload.debounceMs": "应用配置更改前的防抖窗口（毫秒）。",
  "gateway.nodes.browser.mode":
    '节点浏览器路由（"auto" = 选择单个已连接的浏览器节点，"manual" = 需要节点参数，"off" = 禁用）。',
  "gateway.nodes.browser.node": "将浏览器路由固定到特定节点 ID 或名称（可选）。",
  "gateway.nodes.allowCommands": "除网关默认值外允许的额外 node.invoke 命令（命令字符串数组）。",
  "gateway.nodes.denyCommands": "即使存在于节点声明或默认允许列表中也要阻止的命令。",
  "nodeHost.browserProxy.enabled": "通过节点代理公开本地浏览器控制服务器。",
  "nodeHost.browserProxy.allowProfiles": "通过节点代理公开的浏览器配置文件名称的可选允许列表。",
  "diagnostics.flags":
    '按标志启用针对性诊断日志（例如 ["telegram.http"]）。支持通配符如 "telegram.*" 或 "*"。',
  "diagnostics.cacheTrace.enabled": "为嵌入式代理运行记录缓存追踪快照（默认：false）。",
  "diagnostics.cacheTrace.filePath":
    "缓存追踪日志的 JSONL 输出路径（默认：$CLAWDBOT_STATE_DIR/logs/cache-trace.jsonl）。",
  "diagnostics.cacheTrace.includeMessages": "在追踪输出中包含完整消息负载（默认：true）。",
  "diagnostics.cacheTrace.includePrompt": "在追踪输出中包含提示词文本（默认：true）。",
  "diagnostics.cacheTrace.includeSystem": "在追踪输出中包含系统提示词（默认：true）。",
  "tools.exec.applyPatch.enabled": "实验性。当工具策略允许时，为 OpenAI 模型启用 apply_patch。",
  "tools.exec.applyPatch.allowModels":
    '模型 ID 的可选允许列表（例如 "gpt-5.2" 或 "openai/gpt-5.2"）。',
  "tools.exec.notifyOnExit": "当为 true（默认）时，后台执行会话在退出时排队系统事件并请求心跳。",
  "tools.exec.pathPrepend": "为执行运行（网关/沙箱）添加到 PATH 前面的目录。",
  "tools.exec.safeBins": "允许仅 stdin 的安全二进制文件运行，无需显式允许列表条目。",
  "tools.message.allowCrossContextSend": "旧版覆盖：允许跨所有提供商的跨上下文发送。",
  "tools.message.crossContext.allowWithinProvider":
    "允许发送到同一提供商内的其他渠道（默认：true）。",
  "tools.message.crossContext.allowAcrossProviders": "允许跨不同提供商发送（默认：false）。",
  "tools.message.crossContext.marker.enabled": "跨上下文发送时添加可见的来源标记（默认：true）。",
  "tools.message.crossContext.marker.prefix": '跨上下文标记的文本前缀（支持 "{channel}"）。',
  "tools.message.crossContext.marker.suffix": '跨上下文标记的文本后缀（支持 "{channel}"）。',
  "tools.message.broadcast.enabled": "启用广播操作（默认：true）。",
  "tools.web.search.enabled": "启用 web_search 工具（需要提供商 API 密钥）。",
  "tools.web.search.provider": '搜索提供商（"brave" 或 "perplexity"）。',
  "tools.web.search.apiKey": "Brave Search API 密钥（回退：BRAVE_API_KEY 环境变量）。",
  "tools.web.search.maxResults": "返回的默认结果数（1-10）。",
  "tools.web.search.timeoutSeconds": "web_search 请求的超时时间（秒）。",
  "tools.web.search.cacheTtlMinutes": "web_search 结果的缓存 TTL（分钟）。",
  "tools.web.search.perplexity.apiKey":
    "Perplexity 或 OpenRouter API 密钥（回退：PERPLEXITY_API_KEY 或 OPENROUTER_API_KEY 环境变量）。",
  "tools.web.search.perplexity.baseUrl":
    "Perplexity 基础 URL 覆盖（默认：https://openrouter.ai/api/v1 或 https://api.perplexity.ai）。",
  "tools.web.search.perplexity.model": 'Perplexity 模型覆盖（默认："perplexity/sonar-pro"）。',
  "tools.web.fetch.enabled": "启用 web_fetch 工具（轻量级 HTTP 抓取）。",
  "tools.web.fetch.maxChars": "web_fetch 返回的最大字符数（截断）。",
  "tools.web.fetch.timeoutSeconds": "web_fetch 请求的超时时间（秒）。",
  "tools.web.fetch.cacheTtlMinutes": "web_fetch 结果的缓存 TTL（分钟）。",
  "tools.web.fetch.maxRedirects": "web_fetch 允许的最大重定向次数（默认：3）。",
  "tools.web.fetch.userAgent": "覆盖 web_fetch 请求的 User-Agent 头。",
  "tools.web.fetch.readability":
    "使用 Readability 从 HTML 中提取主要内容（回退到基本 HTML 清理）。",
  "tools.web.fetch.firecrawl.enabled": "为 web_fetch 启用 Firecrawl 回退（如果已配置）。",
  "tools.web.fetch.firecrawl.apiKey": "Firecrawl API 密钥（回退：FIRECRAWL_API_KEY 环境变量）。",
  "tools.web.fetch.firecrawl.baseUrl":
    "Firecrawl 基础 URL（例如 https://api.firecrawl.dev 或自定义端点）。",
  "tools.web.fetch.firecrawl.onlyMainContent":
    "当为 true 时，Firecrawl 仅返回主要内容（默认：true）。",
  "tools.web.fetch.firecrawl.maxAgeMs": "当 API 支持时，Firecrawl 缓存结果的 maxAge（毫秒）。",
  "tools.web.fetch.firecrawl.timeoutSeconds": "Firecrawl 请求的超时时间（秒）。",
  "channels.slack.allowBots": "允许机器人创作的消息触发 Slack 回复（默认：false）。",
  "channels.slack.thread.historyScope":
    'Slack 线程历史上下文的范围（"thread" 按线程隔离；"channel" 重用频道历史）。',
  "channels.slack.thread.inheritParent":
    "如果为 true，Slack 线程会话继承父频道记录（默认：false）。",
  "channels.mattermost.botToken": "来自 Mattermost 系统控制台 -> 集成 -> 机器人账户的机器人令牌。",
  "channels.mattermost.baseUrl": "Mattermost 服务器的基础 URL（例如 https://chat.example.com）。",
  "channels.mattermost.chatmode":
    '在提及时回复频道消息（"oncall"），在触发字符（">" 或 "!"）时（"onchar"），或在每条消息时（"onmessage"）。',
  "channels.mattermost.oncharPrefixes": 'onchar 模式的触发前缀（默认：[">", "!"]）。',
  "channels.mattermost.requireMention": "在频道中响应前需要 @提及（默认：true）。",
  "auth.profiles": "命名的认证配置文件（提供商 + 模式 + 可选电子邮件）。",
  "auth.order": "每个提供商的有序认证配置文件 ID（用于自动故障转移）。",
  "auth.cooldowns.billingBackoffHours":
    "当配置文件因计费/信用不足而失败时的基础退避时间（小时）（默认：5）。",
  "auth.cooldowns.billingBackoffHoursByProvider": "计费退避的可选每个提供商覆盖（小时）。",
  "auth.cooldowns.billingMaxHours": "计费退避的上限（小时）（默认：24）。",
  "auth.cooldowns.failureWindowHours": "退避计数器的故障窗口（小时）（默认：24）。",
  "agents.defaults.bootstrapMaxChars":
    "在截断前注入到系统提示词中的每个工作区引导文件的最大字符数（默认：20000）。",
  "agents.defaults.repoRoot": "系统提示词运行时行中显示的可选仓库根目录（覆盖自动检测）。",
  "agents.defaults.envelopeTimezone":
    '消息信封的时区（"utc"、"local"、"user" 或 IANA 时区字符串）。',
  "agents.defaults.envelopeTimestamp": '在消息信封中包含绝对时间戳（"on" 或 "off"）。',
  "agents.defaults.envelopeElapsed": '在消息信封中包含经过时间（"on" 或 "off"）。',
  "agents.defaults.models": "已配置的模型目录（键是完整的提供商/模型 ID）。",
  "agents.defaults.memorySearch": "对 MEMORY.md 和 memory/*.md 的向量搜索（支持每个代理覆盖）。",
  "agents.defaults.memorySearch.sources":
    '要为记忆搜索索引的源（默认：["memory"]；添加 "sessions" 以包含会话记录）。',
  "agents.defaults.memorySearch.extraPaths":
    "要包含在记忆搜索中的额外路径（目录或 .md 文件；相对路径从工作区解析）。",
  "agents.defaults.memorySearch.experimental.sessionMemory":
    "为记忆搜索启用实验性会话记录索引（默认：false）。",
  "agents.defaults.memorySearch.provider": '嵌入提供商（"openai"、"gemini" 或 "local"）。',
  "agents.defaults.memorySearch.remote.baseUrl":
    "远程嵌入的自定义基础 URL（OpenAI 兼容代理或 Gemini 覆盖）。",
  "agents.defaults.memorySearch.remote.apiKey": "远程嵌入提供商的自定义 API 密钥。",
  "agents.defaults.memorySearch.remote.headers":
    "远程嵌入的额外标头（合并；远程覆盖 OpenAI 标头）。",
  "agents.defaults.memorySearch.remote.batch.enabled":
    "为记忆嵌入启用批处理 API（OpenAI/Gemini；默认：true）。",
  "agents.defaults.memorySearch.remote.batch.wait": "索引时等待批处理完成（默认：true）。",
  "agents.defaults.memorySearch.remote.batch.concurrency":
    "记忆索引的最大并发嵌入批处理作业数（默认：2）。",
  "agents.defaults.memorySearch.remote.batch.pollIntervalMs":
    "批处理状态的轮询间隔（毫秒）（默认：2000）。",
  "agents.defaults.memorySearch.remote.batch.timeoutMinutes":
    "批处理索引的超时时间（分钟）（默认：60）。",
  "agents.defaults.memorySearch.local.modelPath":
    "本地 GGUF 模型路径或 hf: URI（node-llama-cpp）。",
  "agents.defaults.memorySearch.fallback":
    '嵌入失败时的回退提供商（"openai"、"gemini"、"local" 或 "none"）。',
  "agents.defaults.memorySearch.store.path":
    "SQLite 索引路径（默认：~/.clawdbot/memory/{agentId}.sqlite）。",
  "agents.defaults.memorySearch.store.vector.enabled":
    "为向量搜索启用 sqlite-vec 扩展（默认：true）。",
  "agents.defaults.memorySearch.store.vector.extensionPath":
    "sqlite-vec 扩展库的可选覆盖路径（.dylib/.so/.dll）。",
  "agents.defaults.memorySearch.query.hybrid.enabled":
    "为记忆启用混合 BM25 + 向量搜索（默认：true）。",
  "agents.defaults.memorySearch.query.hybrid.vectorWeight": "合并结果时向量相似度的权重（0-1）。",
  "agents.defaults.memorySearch.query.hybrid.textWeight":
    "合并结果时 BM25 文本相关性的权重（0-1）。",
  "agents.defaults.memorySearch.query.hybrid.candidateMultiplier": "候选池大小的乘数（默认：4）。",
  "agents.defaults.memorySearch.cache.enabled":
    "在 SQLite 中缓存块嵌入以加速重新索引和频繁更新（默认：true）。",
  "agents.defaults.memorySearch.cache.maxEntries": "缓存嵌入的可选上限（尽力而为）。",
  "agents.defaults.memorySearch.sync.onSearch": "懒惰同步：在更改后的搜索时安排重新索引。",
  "agents.defaults.memorySearch.sync.watch": "监视记忆文件的更改（chokidar）。",
  "agents.defaults.memorySearch.sync.sessions.deltaBytes":
    "会话记录触发重新索引前的最小追加字节数（默认：100000）。",
  "agents.defaults.memorySearch.sync.sessions.deltaMessages":
    "会话记录触发重新索引前的最小追加 JSONL 行数（默认：50）。",
  "plugins.enabled": "启用插件/扩展加载（默认：true）。",
  "plugins.allow": "插件 ID 的可选允许列表；设置后，仅列出的插件加载。",
  "plugins.deny": "插件 ID 的可选拒绝列表；拒绝优先于允许列表。",
  "plugins.load.paths": "要加载的额外插件文件或目录。",
  "plugins.slots": "选择哪些插件拥有独占插槽（记忆等）。",
  "plugins.slots.memory": '按 ID 选择活动记忆插件，或 "none" 以禁用记忆插件。',
  "plugins.entries": "按插件 ID 键入的每个插件设置（启用/禁用 + 配置负载）。",
  "plugins.entries.*.enabled": "覆盖此条目的插件启用/禁用（需要重启）。",
  "plugins.entries.*.config": "插件定义的配置负载（架构由插件提供）。",
  "plugins.installs": "CLI 管理的安装元数据（由 `moltbot plugins update` 使用以定位安装源）。",
  "plugins.installs.*.source": '安装源（"npm"、"archive" 或 "path"）。',
  "plugins.installs.*.spec": "用于安装的原始 npm 规范（如果源是 npm）。",
  "plugins.installs.*.sourcePath": "用于安装的原始存档/路径（如果有）。",
  "plugins.installs.*.installPath": "解析的安装目录（通常是 ~/.clawdbot/extensions/<id>）。",
  "plugins.installs.*.version": "安装时记录的版本（如果可用）。",
  "plugins.installs.*.installedAt": "最后安装/更新的 ISO 时间戳。",
  "agents.list.*.identity.avatar": "代理头像（工作区相对路径、http(s) URL 或 data URI）。",
  "agents.defaults.model.primary": "主要模型（提供商/模型）。",
  "agents.defaults.model.fallbacks": "有序回退模型（提供商/模型）。当主要模型失败时使用。",
  "agents.defaults.imageModel.primary":
    "可选的图像模型（提供商/模型），当主要模型缺少图像输入时使用。",
  "agents.defaults.imageModel.fallbacks": "有序回退图像模型（提供商/模型）。",
  "agents.defaults.cliBackends": "用于纯文本回退的可选 CLI 后端（claude-cli 等）。",
  "agents.defaults.humanDelay.mode": '块回复的延迟样式（"off"、"natural"、"custom"）。',
  "agents.defaults.humanDelay.minMs": "自定义 humanDelay 的最小延迟（毫秒）（默认：800）。",
  "agents.defaults.humanDelay.maxMs": "自定义 humanDelay 的最大延迟（毫秒）（默认：2500）。",
  "commands.native": "向支持的渠道注册本机命令（Discord/Slack/Telegram）。",
  "commands.nativeSkills": "向支持的渠道注册本机技能命令（用户可调用的技能）。",
  "commands.text": "允许文本命令解析（仅斜杠命令）。",
  "commands.bash":
    "允许 bash 聊天命令（`!`；`/bash` 别名）运行主机 shell 命令（默认：false；需要 tools.elevated）。",
  "commands.bashForegroundMs": "bash 在后台运行前等待的时间（默认：2000；0 立即后台运行）。",
  "commands.config": "允许 /config 聊天命令读取/写入磁盘上的配置（默认：false）。",
  "commands.debug": "允许 /debug 聊天命令进行仅运行时覆盖（默认：false）。",
  "commands.restart": "允许 /restart 和网关重启工具操作（默认：false）。",
  "commands.useAccessGroups": "对命令强制执行访问组允许列表/策略。",
  "session.dmScope":
    'DM 会话范围："main" 保持连续性；"per-peer"、"per-channel-peer" 或 "per-account-channel-peer" 隔离 DM 历史（推荐用于共享收件箱/多账户）。',
  "session.identityLinks":
    "将规范身份映射到提供商前缀的对等 ID 以进行 DM 会话链接（示例：telegram:123456）。",
  "channels.telegram.configWrites": "允许 Telegram 响应渠道事件/命令写入配置（默认：true）。",
  "channels.slack.configWrites": "允许 Slack 响应渠道事件/命令写入配置（默认：true）。",
  "channels.mattermost.configWrites": "允许 Mattermost 响应渠道事件/命令写入配置（默认：true）。",
  "channels.discord.configWrites": "允许 Discord 响应渠道事件/命令写入配置（默认：true）。",
  "channels.whatsapp.configWrites": "允许 WhatsApp 响应渠道事件/命令写入配置（默认：true）。",
  "channels.signal.configWrites": "允许 Signal 响应渠道事件/命令写入配置（默认：true）。",
  "channels.imessage.configWrites": "允许 iMessage 响应渠道事件/命令写入配置（默认：true）。",
  "channels.msteams.configWrites": "允许 Microsoft Teams 响应渠道事件/命令写入配置（默认：true）。",
  "channels.discord.commands.native": '覆盖 Discord 的本机命令（布尔值或 "auto"）。',
  "channels.discord.commands.nativeSkills": '覆盖 Discord 的本机技能命令（布尔值或 "auto"）。',
  "channels.telegram.commands.native": '覆盖 Telegram 的本机命令（布尔值或 "auto"）。',
  "channels.telegram.commands.nativeSkills": '覆盖 Telegram 的本机技能命令（布尔值或 "auto"）。',
  "channels.slack.commands.native": '覆盖 Slack 的本机命令（布尔值或 "auto"）。',
  "channels.slack.commands.nativeSkills": '覆盖 Slack 的本机技能命令（布尔值或 "auto"）。',
  "session.agentToAgent.maxPingPongTurns": "请求者和目标之间的最大回复回合数（0–5）。",
  "channels.telegram.customCommands": "额外的 Telegram 机器人菜单命令（与本机合并；忽略冲突）。",
  "messages.ackReaction": "用于确认入站消息的表情符号反应（空禁用）。",
  "messages.ackReactionScope":
    '何时发送确认反应（"group-mentions"、"group-all"、"direct"、"all"）。',
  "messages.inbound.debounceMs":
    "用于批处理来自同一发送者的快速入站消息的防抖窗口（毫秒）（0 禁用）。",
  "channels.telegram.dmPolicy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.telegram.allowFrom=["*"]。',
  "channels.telegram.streamMode":
    "Telegram 回复的草稿流模式（off | partial | block）。与块流分开；需要私有主题 + sendMessageDraft。",
  "channels.telegram.draftChunk.minChars":
    '当 channels.telegram.streamMode="block" 时，发出 Telegram 草稿更新前的最小字符数（默认：200）。',
  "channels.telegram.draftChunk.maxChars":
    '当 channels.telegram.streamMode="block" 时，Telegram 草稿更新块的目标最大大小（默认：800；限制为 channels.telegram.textChunkLimit）。',
  "channels.telegram.draftChunk.breakPreference":
    "Telegram 草稿块的首选断点（paragraph | newline | sentence）。默认：paragraph。",
  "channels.telegram.retry.attempts": "出站 Telegram API 调用的最大重试次数（默认：3）。",
  "channels.telegram.retry.minDelayMs": "Telegram 出站调用的最小重试延迟（毫秒）。",
  "channels.telegram.retry.maxDelayMs": "Telegram 出站调用的最大重试延迟上限（毫秒）。",
  "channels.telegram.retry.jitter": "应用于 Telegram 重试延迟的抖动因子（0-1）。",
  "channels.telegram.network.autoSelectFamily":
    "覆盖 Telegram 的 Node autoSelectFamily（true=启用，false=禁用）。",
  "channels.telegram.timeoutSeconds":
    "Telegram API 请求中止前的最大秒数（默认：500，根据 grammY）。",
  "channels.whatsapp.dmPolicy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.whatsapp.allowFrom=["*"]。',
  "channels.whatsapp.selfChatMode": "同手机设置（机器人使用您的个人 WhatsApp 号码）。",
  "channels.whatsapp.debounceMs":
    "用于批处理来自同一发送者的快速连续消息的防抖窗口（毫秒）（0 禁用）。",
  "channels.signal.dmPolicy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.signal.allowFrom=["*"]。',
  "channels.imessage.dmPolicy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.imessage.allowFrom=["*"]。',
  "channels.bluebubbles.dmPolicy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.bluebubbles.allowFrom=["*"]。',
  "channels.discord.dm.policy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.discord.dm.allowFrom=["*"]。',
  "channels.discord.retry.attempts": "出站 Discord API 调用的最大重试次数（默认：3）。",
  "channels.discord.retry.minDelayMs": "Discord 出站调用的最小重试延迟（毫秒）。",
  "channels.discord.retry.maxDelayMs": "Discord 出站调用的最大重试延迟上限（毫秒）。",
  "channels.discord.retry.jitter": "应用于 Discord 重试延迟的抖动因子（0-1）。",
  "channels.discord.maxLinesPerMessage": "每条 Discord 消息的软最大行数（默认：17）。",
  "channels.discord.intents.presence":
    "启用 Guild Presences 特权意图。还必须在 Discord 开发者门户中启用。允许跟踪用户活动（例如 Spotify）。默认：false。",
  "channels.discord.intents.guildMembers":
    "启用 Guild Members 特权意图。还必须在 Discord 开发者门户中启用。默认：false。",
  "channels.slack.dm.policy":
    '直接消息访问控制（推荐 "pairing"）。"open" 需要 channels.slack.dm.allowFrom=["*"]。',
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  "gateway.remote.url": "ws://host:18789",
  "gateway.remote.tlsFingerprint": "sha256:ab12cd34…",
  "gateway.remote.sshTarget": "user@host",
  "gateway.controlUi.basePath": "/moltbot",
  "channels.mattermost.baseUrl": "https://chat.example.com",
  "agents.list[].identity.avatar": "avatars/clawd.png",
};

const SENSITIVE_PATTERNS = [/token/i, /password/i, /secret/i, /api.?key/i];

function isSensitivePath(path: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(path));
}

type JsonSchemaObject = JsonSchemaNode & {
  type?: string | string[];
  properties?: Record<string, JsonSchemaObject>;
  required?: string[];
  additionalProperties?: JsonSchemaObject | boolean;
};

function cloneSchema<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function asSchemaObject(value: unknown): JsonSchemaObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonSchemaObject;
}

function isObjectSchema(schema: JsonSchemaObject): boolean {
  const type = schema.type;
  if (type === "object") return true;
  if (Array.isArray(type) && type.includes("object")) return true;
  return Boolean(schema.properties || schema.additionalProperties);
}

function mergeObjectSchema(base: JsonSchemaObject, extension: JsonSchemaObject): JsonSchemaObject {
  const mergedRequired = new Set<string>([...(base.required ?? []), ...(extension.required ?? [])]);
  const merged: JsonSchemaObject = {
    ...base,
    ...extension,
    properties: {
      ...base.properties,
      ...extension.properties,
    },
  };
  if (mergedRequired.size > 0) {
    merged.required = Array.from(mergedRequired);
  }
  const additional = extension.additionalProperties ?? base.additionalProperties;
  if (additional !== undefined) merged.additionalProperties = additional;
  return merged;
}

function buildBaseHints(): ConfigUiHints {
  const hints: ConfigUiHints = {};
  for (const [group, label] of Object.entries(GROUP_LABELS)) {
    hints[group] = {
      label,
      group: label,
      order: GROUP_ORDER[group],
    };
  }
  for (const [path, label] of Object.entries(FIELD_LABELS)) {
    const current = hints[path];
    hints[path] = current ? { ...current, label } : { label };
  }
  for (const [path, help] of Object.entries(FIELD_HELP)) {
    const current = hints[path];
    hints[path] = current ? { ...current, help } : { help };
  }
  for (const [path, placeholder] of Object.entries(FIELD_PLACEHOLDERS)) {
    const current = hints[path];
    hints[path] = current ? { ...current, placeholder } : { placeholder };
  }
  return hints;
}

function applySensitiveHints(hints: ConfigUiHints): ConfigUiHints {
  const next = { ...hints };
  for (const key of Object.keys(next)) {
    if (isSensitivePath(key)) {
      next[key] = { ...next[key], sensitive: true };
    }
  }
  return next;
}

function applyPluginHints(hints: ConfigUiHints, plugins: PluginUiMetadata[]): ConfigUiHints {
  const next: ConfigUiHints = { ...hints };
  for (const plugin of plugins) {
    const id = plugin.id.trim();
    if (!id) continue;
    const name = (plugin.name ?? id).trim() || id;
    const basePath = `plugins.entries.${id}`;

    next[basePath] = {
      ...next[basePath],
      label: name,
      help: plugin.description
        ? `${plugin.description} (plugin: ${id})`
        : `Plugin entry for ${id}.`,
    };
    next[`${basePath}.enabled`] = {
      ...next[`${basePath}.enabled`],
      label: `Enable ${name}`,
    };
    next[`${basePath}.config`] = {
      ...next[`${basePath}.config`],
      label: `${name} Config`,
      help: `Plugin-defined config payload for ${id}.`,
    };

    const uiHints = plugin.configUiHints ?? {};
    for (const [relPathRaw, hint] of Object.entries(uiHints)) {
      const relPath = relPathRaw.trim().replace(/^\./, "");
      if (!relPath) continue;
      const key = `${basePath}.config.${relPath}`;
      next[key] = {
        ...next[key],
        ...hint,
      };
    }
  }
  return next;
}

function applyChannelHints(hints: ConfigUiHints, channels: ChannelUiMetadata[]): ConfigUiHints {
  const next: ConfigUiHints = { ...hints };
  for (const channel of channels) {
    const id = channel.id.trim();
    if (!id) continue;
    const basePath = `channels.${id}`;
    const current = next[basePath] ?? {};
    const label = channel.label?.trim();
    const help = channel.description?.trim();
    next[basePath] = {
      ...current,
      ...(label ? { label } : {}),
      ...(help ? { help } : {}),
    };

    const uiHints = channel.configUiHints ?? {};
    for (const [relPathRaw, hint] of Object.entries(uiHints)) {
      const relPath = relPathRaw.trim().replace(/^\./, "");
      if (!relPath) continue;
      const key = `${basePath}.${relPath}`;
      next[key] = {
        ...next[key],
        ...hint,
      };
    }
  }
  return next;
}

function listHeartbeatTargetChannels(channels: ChannelUiMetadata[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const id of CHANNEL_IDS) {
    const normalized = id.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    ordered.push(normalized);
  }
  for (const channel of channels) {
    const normalized = channel.id.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    ordered.push(normalized);
  }
  return ordered;
}

function applyHeartbeatTargetHints(
  hints: ConfigUiHints,
  channels: ChannelUiMetadata[],
): ConfigUiHints {
  const next: ConfigUiHints = { ...hints };
  const channelList = listHeartbeatTargetChannels(channels);
  const channelHelp = channelList.length ? ` Known channels: ${channelList.join(", ")}.` : "";
  const help = `Delivery target ("last", "none", or a channel id).${channelHelp}`;
  const paths = ["agents.defaults.heartbeat.target", "agents.list.*.heartbeat.target"];
  for (const path of paths) {
    const current = next[path] ?? {};
    next[path] = {
      ...current,
      help: current.help ?? help,
      placeholder: current.placeholder ?? "last",
    };
  }
  return next;
}

function applyPluginSchemas(schema: ConfigSchema, plugins: PluginUiMetadata[]): ConfigSchema {
  const next = cloneSchema(schema);
  const root = asSchemaObject(next);
  const pluginsNode = asSchemaObject(root?.properties?.plugins);
  const entriesNode = asSchemaObject(pluginsNode?.properties?.entries);
  if (!entriesNode) return next;

  const entryBase = asSchemaObject(entriesNode.additionalProperties);
  const entryProperties = entriesNode.properties ?? {};
  entriesNode.properties = entryProperties;

  for (const plugin of plugins) {
    if (!plugin.configSchema) continue;
    const entrySchema = entryBase
      ? cloneSchema(entryBase)
      : ({ type: "object" } as JsonSchemaObject);
    const entryObject = asSchemaObject(entrySchema) ?? ({ type: "object" } as JsonSchemaObject);
    const baseConfigSchema = asSchemaObject(entryObject.properties?.config);
    const pluginSchema = asSchemaObject(plugin.configSchema);
    const nextConfigSchema =
      baseConfigSchema &&
      pluginSchema &&
      isObjectSchema(baseConfigSchema) &&
      isObjectSchema(pluginSchema)
        ? mergeObjectSchema(baseConfigSchema, pluginSchema)
        : cloneSchema(plugin.configSchema);

    entryObject.properties = {
      ...entryObject.properties,
      config: nextConfigSchema,
    };
    entryProperties[plugin.id] = entryObject;
  }

  return next;
}

function applyChannelSchemas(schema: ConfigSchema, channels: ChannelUiMetadata[]): ConfigSchema {
  const next = cloneSchema(schema);
  const root = asSchemaObject(next);
  const channelsNode = asSchemaObject(root?.properties?.channels);
  if (!channelsNode) return next;
  const channelProps = channelsNode.properties ?? {};
  channelsNode.properties = channelProps;

  for (const channel of channels) {
    if (!channel.configSchema) continue;
    const existing = asSchemaObject(channelProps[channel.id]);
    const incoming = asSchemaObject(channel.configSchema);
    if (existing && incoming && isObjectSchema(existing) && isObjectSchema(incoming)) {
      channelProps[channel.id] = mergeObjectSchema(existing, incoming);
    } else {
      channelProps[channel.id] = cloneSchema(channel.configSchema);
    }
  }

  return next;
}

let cachedBase: ConfigSchemaResponse | null = null;

function stripChannelSchema(schema: ConfigSchema): ConfigSchema {
  const next = cloneSchema(schema);
  const root = asSchemaObject(next);
  if (!root || !root.properties) return next;
  const channelsNode = asSchemaObject(root.properties.channels);
  if (channelsNode) {
    channelsNode.properties = {};
    channelsNode.required = [];
    channelsNode.additionalProperties = true;
  }
  return next;
}

function buildBaseConfigSchema(): ConfigSchemaResponse {
  if (cachedBase) return cachedBase;
  const schema = MoltbotSchema.toJSONSchema({
    target: "draft-07",
    unrepresentable: "any",
  });
  schema.title = "MoltbotConfig";
  const hints = applySensitiveHints(buildBaseHints());
  const next = {
    schema: stripChannelSchema(schema),
    uiHints: hints,
    version: VERSION,
    generatedAt: new Date().toISOString(),
  };
  cachedBase = next;
  return next;
}

export function buildConfigSchema(params?: {
  plugins?: PluginUiMetadata[];
  channels?: ChannelUiMetadata[];
}): ConfigSchemaResponse {
  const base = buildBaseConfigSchema();
  const plugins = params?.plugins ?? [];
  const channels = params?.channels ?? [];
  if (plugins.length === 0 && channels.length === 0) return base;
  const mergedHints = applySensitiveHints(
    applyHeartbeatTargetHints(
      applyChannelHints(applyPluginHints(base.uiHints, plugins), channels),
      channels,
    ),
  );
  const mergedSchema = applyChannelSchemas(applyPluginSchemas(base.schema, plugins), channels);
  return {
    ...base,
    schema: mergedSchema,
    uiHints: mergedHints,
  };
}
