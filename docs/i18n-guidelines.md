# OpenClaw 汉化规范

本文档定义了 OpenClaw 项目的中文本地化规范。

---

## 核心原则

1. **可识别性优先**：用户能够将中文界面与英文文档/代码对应
2. **技术术语保留**：专业术语保留英文或采用混合格式
3. **自然阅读**：日常用语使用纯中文

---

## 格式规范

### 1. 混合格式（中文 English）

适用于**功能模块、配置分类、核心概念**：

| 英文 | 翻译格式 |
|------|---------|
| Skills | 技能 Skills |
| Hooks | 钩子 Hooks |
| Plugins | 插件 Plugins |
| Agents | 代理 Agents |
| Channels | 渠道 Channels |
| Gateway | 网关 Gateway |
| Nodes | 节点 Nodes |
| Sessions | 会话 Sessions |
| Tools | 工具 Tools |
| Models | 模型 Models |
| Memory | 记忆 Memory |
| Sandbox | 沙箱 Sandbox |
| Canvas | 画布 Canvas |
| Cron | 定时任务 Cron |
| Webhook | Webhook |
| OAuth | OAuth |

### 2. 配置项格式

配置项标签采用 `中文描述 (config.path)` 格式：

```
网关端口 (gateway.port)
认证令牌 (gateway.auth.token)
私信策略 (channels.telegram.dmPolicy)
```

### 3. 命令描述格式

CLI 命令采用 `中文描述` + 命令名保持英文：

```
skills     技能管理 Skills
channels   渠道管理 Channels  
gateway    网关控制 Gateway
```

### 4. 纯中文

适用于**动作、状态、提示信息**：

| 类型 | 示例 |
|------|------|
| 按钮/动作 | 确定、取消、保存、删除、编辑、刷新 |
| 状态 | 运行中、已停止、已配置、已连接、未知 |
| 提示 | 请输入...、操作成功、加载中... |
| 确认 | 是否继续？、确定要删除吗？ |

### 5. 保留英文

适用于**技术名词、品牌名、协议名**：

| 类型 | 示例 |
|------|------|
| 技术术语 | API、Token、CLI、SSH、URL、JSON、WebSocket |
| 品牌/平台 | Telegram、Discord、WhatsApp、Slack、Signal |
| 协议/标准 | OAuth、mDNS、TLS、HTTP、HTTPS |
| 工具名 | Docker、Homebrew、npm、pnpm |

---

## 文件位置

- 主语言文件：`src/i18n/zh-CN.ts`
- 配置元数据：`src/config/schema.ts`（GROUP_LABELS、FIELD_LABELS 等）
- 技能描述：`src/agents/skills-status.ts`（SKILL_DESCRIPTION_ZH）

---

## 示例对比

### ❌ 过度汉化

```
技能          # 无法与 "skills" 对应
钩子          # 看不出是 "hooks"
网关认证令牌   # 不知道对应哪个配置项
```

### ✅ 推荐格式

```
技能 Skills
钩子 Hooks
认证令牌 (gateway.auth.token)
```

---

## 更新日志

- 2026-02-01：初始版本
