# OpenClaw 中文汉化 - 多窗口任务分解

## 概览

本项目 CLI 汉化分为两个窗口并行执行，窗口 C（中控）负责语言包管理和最终验证合并。

| 窗口 | 负责人 | 职责范围 | 文件数 | 文件重叠 |
|------|--------|----------|--------|----------|
| **窗口 A** | Claude 1 | 命令描述汉化 | ~25 个 | ❌ 无 |
| **窗口 B** | Claude 2 | 向导文本汉化 | ~5 个 | ❌ 无 |
| **窗口 C** | 中控 | 语言包管理 + 验证 + 合并 | - | - |

---

## 重要：文件不重叠，可以安全并行！

| 文件 | 窗口 A | 窗口 B |
|------|--------|--------|
| src/cli/program/register.maintenance.ts | ✅ | ❌ |
| src/cli/program/register.setup.ts | ✅ | ❌ |
| src/cli/program/register.onboard.ts | ✅ | ❌ |
| src/commands/configure.ts | ❌ | ✅ |
| src/commands/doctor.ts | ❌ | ✅ |
| src/commands/onboard.ts | ❌ | ✅ |
| src/wizard/onboarding.ts | ❌ | ✅ |

**唯一共享文件**：`src/i18n/zh-CN.ts`（语言包）→ 由窗口 C 管理

---

## 语言包管理流程（重要！）

### 窗口 A/B 需要新翻译时：
1. 报告给窗口 C："需要添加翻译：xxx = "中文""
2. 窗口 C 添加到 `zh-CN.ts`
3. 窗口 C 喊"语言包已更新"
4. 窗口 A/B 执行 `git pull origin main`
5. 继续汉化

---

## 准备工作（所有窗口执行）

```powershell
cd "D:\360MoveData\Users\12776\Desktop\moltbot"
git pull origin main
```

---

## 窗口 A - 命令描述汉化

### 负责文件（无重叠）

```
src/cli/program/register.maintenance.ts    # doctor/dashboard/reset/uninstall
src/cli/program/register.setup.ts          # setup
src/cli/program/register.onboard.ts        # onboard
src/cli/acp-cli.ts                         # acp
src/cli/gateway-cli/register.ts            # gateway
src/cli/daemon-cli/register.ts             # daemon
src/cli/logs-cli.ts                        # logs
src/cli/system-cli.ts                      # system
src/cli/models-cli.ts                      # models
src/cli/devices-cli.ts                     # devices
src/cli/node-cli/register.ts               # node
src/cli/sandbox-cli.ts                     # sandbox
src/cli/tui-cli.ts                         # tui
src/cli/cron-cli/register.ts               # cron
src/cli/dns-cli.ts                         # dns
src/cli/docs-cli.ts                        # docs
src/cli/hooks-cli.ts                       # hooks
src/cli/webhooks-cli.ts                    # webhooks
src/cli/pairing-cli.ts                     # pairing
src/cli/plugins-cli.ts                     # plugins
src/cli/channels-cli.ts                    # channels
src/cli/directory-cli.ts                   # directory
src/cli/security-cli.ts                    # security
src/cli/skills-cli.ts                      # skills
src/cli/update-cli.ts                      # update
```

### 提示词模板（复制给 Claude 1）

```
请汉化窗口 A 负责的文件，任务清单如下：

## 任务文件（25个，无文件重叠，可安全并行）
1. src/cli/program/register.maintenance.ts
2. src/cli/program/register.setup.ts
3. src/cli/program/register.onboard.ts
4. src/cli/acp-cli.ts
5. src/cli/gateway-cli/register.ts
6. src/cli/daemon-cli/register.ts
7. src/cli/logs-cli.ts
8. src/cli/system-cli.ts
9. src/cli/models-cli.ts
10. src/cli/devices-cli.ts
11. src/cli/node-cli/register.ts
12. src/cli/sandbox-cli.ts
13. src/cli/tui-cli.ts
14. src/cli/cron-cli/register.ts
15. src/cli/dns-cli.ts
16. src/cli/docs-cli.ts
17. src/cli/hooks-cli.ts
18. src/cli/webhooks-cli.ts
19. src/cli/pairing-cli.ts
20. src/cli/plugins-cli.ts
21. src/cli/channels-cli.ts
22. src/cli/directory-cli.ts
23. src/cli/security-cli.ts
24. src/cli/skills-cli.ts
25. src/cli/update-cli.ts

## 汉化规则
1. 读取每个文件，找出所有 `.description("...")` 调用
2. 将英文描述替换为中文
3. 如果需要新翻译，报告给窗口 C

## 需要汉化的命令描述（参考）

| 当前英文 | 应改为 |
|----------|--------|
| "Health checks + quick fixes for the gateway and channels" | "网关和渠道健康检查 + 快速修复" |
| "Open the Control UI with your current token" | "使用当前令牌打开控制面板" |
| "Reset local config/state (keeps the CLI installed)" | "重置本地配置/状态（保留 CLI）" |
| "Uninstall the gateway service + local data (CLI remains)" | "卸载网关服务 + 本地数据（保留 CLI）" |
| "Initialize ~/.openclaw/openclaw.json and the agent workspace" | "初始化 ~/.openclaw/openclaw.json 和代理工作区" |
| "Interactive wizard to set up the gateway, workspace, and skills" | "交互式向导：设置网关、工作区和技能" |
| "Agent Control Protocol tools" | "ACP 协议工具" |
| "Gateway control" | "网关控制" |
| "Gateway service (legacy alias)" | "网关服务（旧版别名）" |
| "Gateway logs" | "网关日志" |
| "System events, heartbeat, and presence" | "系统事件、心跳和在线状态" |
| "Model configuration" | "模型配置" |
| "Exec approvals" | "执行审批" |
| "Node commands" | "节点命令" |
| "Device pairing + token management" | "设备配对 + 令牌管理" |
| "Node control" | "节点控制" |
| "Sandbox tools" | "沙箱工具" |
| "Terminal UI" | "终端 UI" |
| "Cron scheduler" | "计划任务调度器" |
| "DNS helpers" | "DNS 助手" |
| "Docs helpers" | "文档助手" |
| "Hooks tooling" | "Hooks 工具" |
| "Webhook helpers" | "Webhook 助手" |
| "Pairing helpers" | "配对助手" |
| "Plugin management" | "插件管理" |
| "Channel management" | "渠道管理" |
| "Directory commands" | "目录命令" |
| "Security helpers" | "安全助手" |
| "Skills management" | "技能管理" |
| "CLI update helpers" | "CLI 更新助手" |

## 自验证
1. npx tsc -p tsconfig.json
2. openclaw --help  # 检查命令描述是否中文
3. git add src/cli/  # 只提交 CLI 文件

## 完成后报告给窗口 C
窗口 A 完成报告
==============
完成文件: [列表]
需要添加的翻译: [列表]  # 如果有
验证: 编译通过 / 命令帮助通过
```

---

## 窗口 B - 向导文本汉化

### 负责文件（无重叠）

```
src/commands/configure.ts                 # configure 向导
src/commands/doctor.ts                    # doctor 输出
src/commands/onboard.ts                   # onboard 向导
src/commands/onboard-helpers.ts           # onboard 辅助函数
src/wizard/onboarding.ts                  # onboarding 向导
```

### 提示词模板（复制给 Claude 2）

```
请汉化窗口 B 负责的文件，任务清单如下：

## 任务文件（5个，无文件重叠，可安全并行）
1. src/commands/configure.ts
2. src/commands/doctor.ts
3. src/commands/onboard.ts
4. src/commands/onboard-helpers.ts
5. src/wizard/onboarding.ts

## 汉化规则
1. 读取每个文件，找出所有英文提示文本
2. 将英文文本替换为中文
3. 如果需要新翻译，报告给窗口 C

## 需要汉化的典型文本

### configure.ts
- "Existing config detected" → "检测到现有配置"
- "Where will the Gateway run?" → "网关在哪里运行？"
- 配置选项提示

### doctor.ts
- 各种健康检查输出消息

### onboard.ts / onboarding.ts
- 除了已汉化的安全提示外，其他交互提示

## 自验证
1. npx tsc -p tsconfig.json
2. openclaw configure --help  # 检查
3. openclaw doctor --help     # 检查
4. git add src/commands/ src/wizard/  # 只提交这些目录

## 完成后报告给窗口 C
窗口 B 完成报告
==============
完成文件: [列表]
需要添加的翻译: [列表]  # 如果有
验证: 编译通过
```

---

## 窗口 C 职责（语言包管理 + 验证 + 合并）

### 1. 收集翻译需求

当窗口 A/B 报告需要新翻译时，添加到 `src/i18n/zh-CN.ts`：

```typescript
export const zhCN = {
  commands: {
    // 窗口 A 的翻译
    doctor: "网关和渠道健康检查 + 快速修复",
    dashboard: "使用当前令牌打开控制面板",
    // ...
  },
  output: {
    // 窗口 B 的翻译
    existingConfigDetected: "检测到现有配置",
    whereWillGatewayRun: "网关在哪里运行？",
    // ...
  },
} as const;
```

添加后喊"语言包已更新"。

### 2. 最终验证

```powershell
# 编译验证
npx tsc -p tsconfig.json

# 命令帮助验证
openclaw --help
openclaw message --help
openclaw nodes --help
openclaw cron --help

# 向导测试
openclaw configure
openclaw doctor
```

### 3. 推送

```powershell
git add -A
git commit -m "feat: 完善 Openclaw 中文汉化（窗口 A + 窗口 B）"
git push origin main
```

---

## 工作流程图

```
┌─────────────────────────────────────────────────────────────┐
│  启动阶段                                                    │
│  ────────────                                                │
│  所有窗口: git pull origin main                              │
├─────────────────────────────────────────────────────────────┤
│  执行阶段（并行）                                             │
│  ─────────────────────                                      │
│  窗口 A: 汉化 CLI 文件 ─────┐                               │
│  窗口 B: 汉化向导文件 ──────┼──→ 需要新翻译？ ─→ 报告给 C   │
│                                         │                  │
│                                         ↓                  │
│  窗口 C: 添加翻译到 zh-CN.ts ─→ 喊"语言包已更新"            │
│                                         │                  │
│                                         ↓                  │
│  窗口 A/B: git pull ─→ 继续汉化                             │
├─────────────────────────────────────────────────────────────┤
│  合并阶段                                                     │
│  ────────────                                                 │
│  窗口 C: 验证 → 提交 → 推送                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 启动命令

### 窗口 A
> "读取 `TASKS_OPENCLAW.md`，按照窗口 A 的提示词执行命令描述汉化，完成后报告给窗口 C"

### 窗口 B
> "读取 `TASKS_OPENCLAW.md`，按照窗口 B 的提示词执行向导文本汉化，完成后报告给窗口 C"

### 窗口 C
> "读取 `TASKS_OPENCLAW.md`，管理语言包，等待窗口 A 和窗口 B 的完成报告，然后执行最终验证和合并"

---

## 验证命令

### 窗口 A
```powershell
npx tsc -p tsconfig.json
openclaw --help
```

### 窗口 B
```powershell
npx tsc -p tsconfig.json
openclaw configure --help
openclaw doctor --help
```

### 窗口 C
```powershell
npx tsc -p tsconfig.json
openclaw dashboard  # UI 测试
```

---

## 窗口 A 翻译需求报告（窗口 C 请添加到 zh-CN.ts）

窗口 A 分析完 25 个文件后，发现以下命令描述需要添加到语言包：

### 维护命令（register.maintenance.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| doctor | "Health checks + quick fixes for the gateway and channels" | "网关和渠道健康检查 + 快速修复" |
| dashboard | "Open the Control UI with your current token" | "使用当前令牌打开控制面板" |
| reset | "Reset local config/state (keeps the CLI installed)" | "重置本地配置/状态（保留 CLI）" |
| uninstall | "Uninstall the gateway service + local data (CLI remains)" | "卸载网关服务 + 本地数据（保留 CLI）" |

### 设置命令（register.setup.ts / register.onboard.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| setup | "Initialize ~/.openclaw/openclaw.json and the agent workspace" | "初始化 ~/.openclaw/openclaw.json 和代理工作区" |
| onboard | "Interactive wizard to set up the gateway, workspace, and skills" | "交互式向导：设置网关、工作区和技能" |

### 网关命令（gateway-cli/register.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| gateway | "Run the WebSocket Gateway" | "运行 WebSocket 网关" |
| gatewayRun | "Run the WebSocket Gateway (foreground)" | "运行 WebSocket 网关（前台）" |
| gatewayStatus | "Show gateway service status + probe the Gateway" | "显示网关服务状态 + 检测网关" |
| gatewayInstall | "Install the Gateway service (launchd/systemd/schtasks)" | "安装网关服务（launchd/systemd/schtasks）" |
| gatewayUninstall | "Uninstall the Gateway service (launchd/systemd/schtasks)" | "卸载网关服务（launchd/systemd/schtasks）" |
| gatewayStart | "Start the Gateway service (launchd/systemd/schtasks)" | "启动网关服务（launchd/systemd/schtasks）" |
| gatewayStop | "Stop the Gateway service (launchd/systemd/schtasks)" | "停止网关服务（launchd/systemd/schtasks）" |
| gatewayRestart | "Restart the Gateway service (launchd/systemd/schtasks)" | "重启网关服务（launchd/systemd/schtasks）" |
| gatewayCall | "Call a Gateway method" | "调用网关方法" |
| gatewayUsageCost | "Fetch usage cost summary from session logs" | "从会话日志获取使用成本摘要" |
| gatewayHealth | "Fetch Gateway health" | "获取网关健康状态" |
| gatewayProbe | "Show gateway reachability + discovery + health + status summary (local + remote)" | "显示网关可达性 + 发现 + 健康 + 状态摘要（本地 + 远程）" |
| gatewayDiscover | "Discover gateways via Bonjour (local + wide-area if configured)" | "通过 Bonjour 发现网关（本地组播 + 广域）" |

### DNS 命令（dns-cli.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| dns | "DNS helpers for wide-area discovery (Tailscale + CoreDNS)" | "DNS 助手（广域发现 - Tailscale + CoreDNS）" |
| dnsSetup | "Set up CoreDNS to serve your discovery domain for unicast DNS-SD (Wide-Area Bonjour)" | "设置 CoreDNS 以提供您的发现域用于单播 DNS-SD（广域 Bonjour）" |

### Hooks 命令（hooks-cli.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| hooks | "Manage internal agent hooks" | "管理内部代理 Hooks" |
| hooksList | "List all hooks" | "列出所有 Hooks" |
| hooksInfo | "Show detailed information about a hook" | "显示 Hook 的详细信息" |
| hooksCheck | "Check hooks eligibility status" | "检查 Hooks 资格状态" |
| hooksEnable | "Enable a hook" | "启用 Hook" |
| hooksDisable | "Disable a hook" | "禁用 Hook" |
| hooksInstall | "Install a hook pack (path, archive, or npm spec)" | "安装 Hook 包（路径、存档或 npm 包）" |
| hooksUpdate | "Update installed hooks (npm installs only)" | "更新已安装的 Hooks（仅限 npm 安装）" |

### Plugins 命令（plugins-cli.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| plugins | "Manage OpenClaw plugins/extensions" | "管理 OpenClaw 插件/扩展" |
| pluginsList | "List discovered plugins" | "列出发现的插件" |
| pluginsInfo | "Show plugin details" | "显示插件详情" |
| pluginsEnable | "Enable a plugin in config" | "在配置中启用插件" |
| pluginsDisable | "Disable a plugin in config" | "在配置中禁用插件" |
| pluginsInstall | "Install a plugin (path, archive, or npm spec)" | "安装插件（路径、存档或 npm 包）" |
| pluginsUpdate | "Update installed plugins (npm installs only)" | "更新已安装的插件（仅限 npm 安装）" |
| pluginsDoctor | "Report plugin load issues" | "报告插件加载问题" |

### Directory 命令（directory-cli.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| directory | "Directory lookups (self, peers, groups) for channels that support it" | "目录查询（自身、群组）用于支持此功能的渠道" |
| directorySelf | "Show the current account user" | "显示当前账户用户" |
| directoryPeers | "Peer directory (contacts/users)" | "对等方目录（联系人/用户）" |
| directoryPeersList | "List peers" | "列出对等方" |
| directoryGroups | "Group directory" | "群组目录" |
| directoryGroupsList | "List groups" | "列出群组" |
| directoryGroupsMembers | "List group members" | "列出群组成员" |

### Update 命令（update-cli.ts）
| 键名 | 英文原文 | 中文翻译 |
|------|----------|----------|
| update | "Update OpenClaw to the latest version" | "更新 OpenClaw 到最新版本" |
| updateWizard | "Interactive update wizard" | "交互式更新向导" |
| updateStatus | "Show update channel and version status" | "显示更新渠道和版本状态" |

### 窗口 C 操作步骤

1. 读取 `src/i18n/zh-CN.ts`
2. 将上述翻译添加到 `commands` 对象中
3. 保存文件
4. 喊"语言包已更新"
5. 窗口 A/B 执行 `git pull origin main` 后继续汉化文件
