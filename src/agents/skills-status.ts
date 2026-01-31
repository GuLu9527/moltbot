import path from "node:path";

import type { MoltbotConfig } from "../config/config.js";
import { CONFIG_DIR } from "../utils.js";
import {
  hasBinary,
  isBundledSkillAllowed,
  isConfigPathTruthy,
  loadWorkspaceSkillEntries,
  resolveBundledAllowlist,
  resolveConfigPath,
  resolveSkillConfig,
  resolveSkillsInstallPreferences,
  type SkillEntry,
  type SkillEligibilityContext,
  type SkillInstallSpec,
  type SkillsInstallPreferences,
} from "./skills.js";

// 技能描述翻译映射
const SKILL_DESCRIPTION_ZH: Record<string, string> = {
  "1password":
    "设置和使用 1Password CLI (op)。用于安装 CLI、启用桌面应用集成、登录（单账户或多账户）",
  "apple-notes":
    "通过 macOS 上的 `memo` CLI 管理 Apple Notes（创建、查看、编辑、删除、搜索、移动和导出笔记）",
  "apple-reminders":
    "通过 macOS 上的 `remindctl` CLI 管理 Apple Reminders（列出、添加、编辑、完成、删除）。支持列表、日期过滤和 JSON/纯文本输出",
  "bear-notes": "通过 grizzly CLI 创建、搜索和管理 Bear 笔记",
  bird: "X/Twitter CLI，用于通过 cookies 阅读、搜索、发布和互动",
  blogwatcher: "使用 blogwatcher CLI 监控博客和 RSS/Atom 订阅源的更新",
  blucli: "BluOS CLI (blu) 用于发现、播放、分组和音量控制",
  bluebubbles:
    "为 Moltbot 构建或更新 BlueBubbles 外部渠道插件（扩展包、REST 发送/探测、webhook 入站）",
  camsnap: "从 RTSP/ONVIF 摄像头捕获帧或片段",
  canvas: "在已连接的 Moltbot 节点（Mac 应用、iOS、Android）上显示 HTML 内容",
  clawdhub: "使用 ClawdHub CLI 从 clawdhub.com 搜索、安装、更新和发布代理技能",
  "coding-agent":
    "通过后台进程运行 Codex CLI、Claude Code、OpenCode 或 Pi Coding Agent 进行程序化控制",
  discord:
    "通过 discord 工具控制 Discord：发送消息、添加反应、发布或上传贴纸、上传表情、运行投票、管理话题/置顶/搜索、创建/编辑/删除频道和分类",
  eightctl: "控制 Eight Sleep 床垫（状态、温度、闹钟、计划）",
  "food-order": "食品订购助手",
  gemini: "Gemini CLI 用于一次性问答、摘要和生成",
  gifgrep: "使用 CLI/TUI 搜索 GIF 提供商，下载结果并提取静态图/图集",
  github:
    "使用 `gh` CLI 与 GitHub 交互。使用 `gh issue`、`gh pr`、`gh run` 和 `gh api` 处理问题、PR、CI 运行和高级查询",
  gog: "Google Workspace CLI，用于 Gmail、Calendar、Drive、Contacts、Sheets 和 Docs",
  goplaces: "通过 goplaces CLI 查询 Google Places API（新版），用于文本搜索、地点详情、解析和评论",
  himalaya:
    "通过 IMAP/SMTP 管理电子邮件的 CLI。使用 `himalaya` 从终端列出、阅读、撰写、回复、转发、搜索和组织电子邮件",
  imsg: "iMessage/SMS CLI，用于列出聊天、历史记录、监视和发送",
  "local-places": "通过 localhost 上的 Google Places API 代理搜索地点（餐厅、咖啡馆等）",
  mcporter: "使用 mcporter CLI 直接列出、配置、认证和调用 MCP 服务器/工具（HTTP 或 stdio）",
  "model-usage": "使用 CodexBar CLI 本地成本使用情况汇总 Codex 或 Claude 的每个模型使用情况",
  "nano-banana-pro": "通过 Gemini 3 Pro Image（Nano Banana Pro）生成或编辑图像",
  "nano-pdf": "使用 nano-pdf CLI 通过自然语言指令编辑 PDF",
  notion: "Notion API，用于创建和管理页面、数据库和块",
  obsidian: "使用 Obsidian 保险库（纯 Markdown 笔记）并通过 obsidian-cli 自动化",
  "openai-image-gen": "通过 OpenAI Images API 批量生成图像。随机提示采样器 + `index.html` 画廊",
  "openai-whisper": "使用 Whisper CLI 进行本地语音转文本（无需 API 密钥）",
  "openai-whisper-api": "通过 OpenAI Audio Transcriptions API（Whisper）转录音频",
  openhue: "通过 OpenHue CLI 控制 Philips Hue 灯光/场景",
  oracle: "使用 oracle CLI 的最佳实践（提示 + 文件捆绑、引擎、会话和文件附件模式）",
  ordercli: "仅限 Foodora 的 CLI，用于检查过去的订单和活动订单状态（Deliveroo 开发中）",
  peekaboo: "使用 Peekaboo CLI 捕获和自动化 macOS UI",
  sag: "ElevenLabs 文本转语音，具有 mac 风格的 say UX",
  "session-logs": "使用 jq 搜索和分析您自己的会话日志（旧的/父对话）",
  "sherpa-onnx-tts": "通过 sherpa-onnx 进行本地文本转语音（离线，无云）",
  "skill-creator": "创建或更新 AgentSkills。用于设计、构建或打包带有脚本、引用和资源的技能",
  slack: "通过 slack 工具控制 Slack：在 Slack 频道中对消息做出反应或固定/取消固定项目",
  songsee: "使用 songsee CLI 从音频生成频谱图和特征面板可视化",
  sonoscli: "控制 Sonos 扬声器（发现/状态/播放/音量/分组）",
  "spotify-player": "通过 spogo（首选）或 spotify_player 进行终端 Spotify 播放/搜索",
  summarize: "从 URL、播客和本地文件中总结或提取文本/转录（适合「转录此 YouTube/视频」的后备方案）",
  "things-mac":
    "通过 macOS 上的 `things` CLI 管理 Things 3（通过 URL scheme 添加/更新项目+待办事项；从本地 Things 数据库读取/搜索/列出）",
  tmux: "通过发送按键和抓取窗格输出来远程控制 tmux 会话以进行交互式 CLI",
  trello: "通过 Trello REST API 管理 Trello 看板、列表和卡片",
  "video-frames": "使用 ffmpeg 从视频中提取帧或短片段",
  "voice-call": "通过 Moltbot voice-call 插件启动语音通话",
  wacli:
    "通过 wacli CLI 向其他人发送 WhatsApp 消息或搜索/同步 WhatsApp 历史记录（不适用于普通用户聊天）",
  weather: "获取当前天气和预报（无需 API 密钥）",
};

function translateSkillDescription(name: string, originalDesc: string): string {
  const translated = SKILL_DESCRIPTION_ZH[name];
  return translated || originalDesc;
}

export type SkillStatusConfigCheck = {
  path: string;
  value: unknown;
  satisfied: boolean;
};

export type SkillInstallOption = {
  id: string;
  kind: SkillInstallSpec["kind"];
  label: string;
  bins: string[];
};

export type SkillStatusEntry = {
  name: string;
  description: string;
  source: string;
  filePath: string;
  baseDir: string;
  skillKey: string;
  primaryEnv?: string;
  emoji?: string;
  homepage?: string;
  always: boolean;
  disabled: boolean;
  blockedByAllowlist: boolean;
  eligible: boolean;
  requirements: {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  missing: {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  configChecks: SkillStatusConfigCheck[];
  install: SkillInstallOption[];
};

export type SkillStatusReport = {
  workspaceDir: string;
  managedSkillsDir: string;
  skills: SkillStatusEntry[];
};

function resolveSkillKey(entry: SkillEntry): string {
  return entry.metadata?.skillKey ?? entry.skill.name;
}

function selectPreferredInstallSpec(
  install: SkillInstallSpec[],
  prefs: SkillsInstallPreferences,
): { spec: SkillInstallSpec; index: number } | undefined {
  if (install.length === 0) return undefined;
  const indexed = install.map((spec, index) => ({ spec, index }));
  const findKind = (kind: SkillInstallSpec["kind"]) =>
    indexed.find((item) => item.spec.kind === kind);

  const brewSpec = findKind("brew");
  const nodeSpec = findKind("node");
  const goSpec = findKind("go");
  const uvSpec = findKind("uv");

  if (prefs.preferBrew && hasBinary("brew") && brewSpec) return brewSpec;
  if (uvSpec) return uvSpec;
  if (nodeSpec) return nodeSpec;
  if (brewSpec) return brewSpec;
  if (goSpec) return goSpec;
  return indexed[0];
}

function normalizeInstallOptions(
  entry: SkillEntry,
  prefs: SkillsInstallPreferences,
): SkillInstallOption[] {
  const install = entry.metadata?.install ?? [];
  if (install.length === 0) return [];

  const platform = process.platform;
  const filtered = install.filter((spec) => {
    const osList = spec.os ?? [];
    return osList.length === 0 || osList.includes(platform);
  });
  if (filtered.length === 0) return [];

  const toOption = (spec: SkillInstallSpec, index: number): SkillInstallOption => {
    const id = (spec.id ?? `${spec.kind}-${index}`).trim();
    const bins = spec.bins ?? [];
    let label = (spec.label ?? "").trim();

    // 翻译自定义标签中的英文
    if (label) {
      label = label
        .replace(/^Install\s+/i, "安装 ")
        .replace(/\s+via\s+/i, " 通过 ")
        .replace(/\(brew\)/i, "(brew)")
        .replace(/\(npm\)/i, "(npm)")
        .replace(/\(go\)/i, "(go)")
        .replace(/\(uv\)/i, "(uv)")
        .replace(/Homebrew/i, "Homebrew");
    }

    if (spec.kind === "node" && spec.package) {
      label = `安装 ${spec.package} (${prefs.nodeManager})`;
    }
    if (!label) {
      if (spec.kind === "brew" && spec.formula) {
        label = `安装 ${spec.formula} (brew)`;
      } else if (spec.kind === "node" && spec.package) {
        label = `安装 ${spec.package} (${prefs.nodeManager})`;
      } else if (spec.kind === "go" && spec.module) {
        label = `安装 ${spec.module} (go)`;
      } else if (spec.kind === "uv" && spec.package) {
        label = `安装 ${spec.package} (uv)`;
      } else if (spec.kind === "download" && spec.url) {
        const url = spec.url.trim();
        const last = url.split("/").pop();
        label = `下载 ${last && last.length > 0 ? last : url}`;
      } else {
        label = "运行安装程序";
      }
    }
    return { id, kind: spec.kind, label, bins };
  };

  const allDownloads = filtered.every((spec) => spec.kind === "download");
  if (allDownloads) {
    return filtered.map((spec, index) => toOption(spec, index));
  }

  const preferred = selectPreferredInstallSpec(filtered, prefs);
  if (!preferred) return [];
  return [toOption(preferred.spec, preferred.index)];
}

function buildSkillStatus(
  entry: SkillEntry,
  config?: MoltbotConfig,
  prefs?: SkillsInstallPreferences,
  eligibility?: SkillEligibilityContext,
): SkillStatusEntry {
  const skillKey = resolveSkillKey(entry);
  const skillConfig = resolveSkillConfig(config, skillKey);
  const disabled = skillConfig?.enabled === false;
  const allowBundled = resolveBundledAllowlist(config);
  const blockedByAllowlist = !isBundledSkillAllowed(entry, allowBundled);
  const always = entry.metadata?.always === true;
  const emoji = entry.metadata?.emoji ?? entry.frontmatter.emoji;
  const homepageRaw =
    entry.metadata?.homepage ??
    entry.frontmatter.homepage ??
    entry.frontmatter.website ??
    entry.frontmatter.url;
  const homepage = homepageRaw?.trim() ? homepageRaw.trim() : undefined;

  const requiredBins = entry.metadata?.requires?.bins ?? [];
  const requiredAnyBins = entry.metadata?.requires?.anyBins ?? [];
  const requiredEnv = entry.metadata?.requires?.env ?? [];
  const requiredConfig = entry.metadata?.requires?.config ?? [];
  const requiredOs = entry.metadata?.os ?? [];

  const missingBins = requiredBins.filter((bin) => {
    if (hasBinary(bin)) return false;
    if (eligibility?.remote?.hasBin?.(bin)) return false;
    return true;
  });
  const missingAnyBins =
    requiredAnyBins.length > 0 &&
    !(
      requiredAnyBins.some((bin) => hasBinary(bin)) ||
      eligibility?.remote?.hasAnyBin?.(requiredAnyBins)
    )
      ? requiredAnyBins
      : [];
  const missingOs =
    requiredOs.length > 0 &&
    !requiredOs.includes(process.platform) &&
    !eligibility?.remote?.platforms?.some((platform) => requiredOs.includes(platform))
      ? requiredOs
      : [];

  const missingEnv: string[] = [];
  for (const envName of requiredEnv) {
    if (process.env[envName]) continue;
    if (skillConfig?.env?.[envName]) continue;
    if (skillConfig?.apiKey && entry.metadata?.primaryEnv === envName) {
      continue;
    }
    missingEnv.push(envName);
  }

  const configChecks: SkillStatusConfigCheck[] = requiredConfig.map((pathStr) => {
    const value = resolveConfigPath(config, pathStr);
    const satisfied = isConfigPathTruthy(config, pathStr);
    return { path: pathStr, value, satisfied };
  });
  const missingConfig = configChecks.filter((check) => !check.satisfied).map((check) => check.path);

  const missing = always
    ? { bins: [], anyBins: [], env: [], config: [], os: [] }
    : {
        bins: missingBins,
        anyBins: missingAnyBins,
        env: missingEnv,
        config: missingConfig,
        os: missingOs,
      };
  const eligible =
    !disabled &&
    !blockedByAllowlist &&
    (always ||
      (missing.bins.length === 0 &&
        missing.anyBins.length === 0 &&
        missing.env.length === 0 &&
        missing.config.length === 0 &&
        missing.os.length === 0));

  return {
    name: entry.skill.name,
    description: translateSkillDescription(entry.skill.name, entry.skill.description),
    source: entry.skill.source,
    filePath: entry.skill.filePath,
    baseDir: entry.skill.baseDir,
    skillKey,
    primaryEnv: entry.metadata?.primaryEnv,
    emoji,
    homepage,
    always,
    disabled,
    blockedByAllowlist,
    eligible,
    requirements: {
      bins: requiredBins,
      anyBins: requiredAnyBins,
      env: requiredEnv,
      config: requiredConfig,
      os: requiredOs,
    },
    missing,
    configChecks,
    install: normalizeInstallOptions(entry, prefs ?? resolveSkillsInstallPreferences(config)),
  };
}

export function buildWorkspaceSkillStatus(
  workspaceDir: string,
  opts?: {
    config?: MoltbotConfig;
    managedSkillsDir?: string;
    entries?: SkillEntry[];
    eligibility?: SkillEligibilityContext;
  },
): SkillStatusReport {
  const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
  const skillEntries = opts?.entries ?? loadWorkspaceSkillEntries(workspaceDir, opts);
  const prefs = resolveSkillsInstallPreferences(opts?.config);
  return {
    workspaceDir,
    managedSkillsDir,
    skills: skillEntries.map((entry) =>
      buildSkillStatus(entry, opts?.config, prefs, opts?.eligibility),
    ),
  };
}
