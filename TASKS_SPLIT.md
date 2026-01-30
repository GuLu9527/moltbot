# Moltbot 中文汉化 - 多窗口任务分解

## 概览

本项目 CLI 汉化分为四个窗口执行，窗口 E（中控）负责最终验证和合并。

| 窗口 | 负责人 | 职责范围 | 文件数 | 并行性 |
|------|--------|----------|--------|--------|
| **窗口 A** | Claude 1 | CLI 向导 + doctor + 健康检查 | ~8 个 | ✅ 可并行 |
| **窗口 B** | Claude 2 | 前端 UI - 聊天界面 | ~5 个 | ✅ 可并行 |
| **窗口 C** | Claude 3 | 前端 UI - 设置界面 | ~5 个 | ✅ 可并行 |
| **窗口 D** | Claude 4 | 网关错误消息 + 日志 | ~10 个 | ✅ 可并行 |
| **窗口 E** | 中控 | 协调 + 最终验证 + 合并 | - | - |

---

## 并行执行规则

### ✅ 可并行的操作（各窗口自己执行）

| 操作 | 命令 | 安全性 |
|------|------|--------|
| 拉取代码 | `git pull origin main` | ✅ 安全 |
| 编译验证 | `npx tsc -p tsconfig.json` | ✅ 安全 |
| 帮助验证 | `pnpm moltbot <cmd> --help` | ✅ 安全 |
| 代码审查 | 人工检查翻译正确性 | ✅ 安全 |

### ❌ 不可并行的操作（报告给窗口 E）

| 操作 | 命令 | 原因 |
|------|------|------|
| UI 构建 | `pnpm ui:build` | 可能冲突 |
| UI 运行测试 | `pnpm moltbot dashboard` | 端口 18789 冲突 |
| 网关服务 | `pnpm moltbot gateway` | 端口冲突 |
| 端到端测试 | 实际发送消息测试 | 状态依赖 |

---

## 工作流程

### 阶段 1：启动（各窗口并行）

```powershell
cd "D:\360MoveData\Users\12776\Desktop\moltbot"
git pull origin main
```

### 阶段 2：执行（各窗口并行）

各窗口按照提示词执行汉化，完成后执行：

```powershell
# 1. 编译验证
npx tsc -p tsconfig.json

# 2. 帮助验证（选择你的模块测试）
pnpm moltbot doctor --help
pnpm moltbot onboard --help
# ... 其他相关命令

# 3. 提交（不要推送）
git add src/i18n/zh-CN.ts src/xxx/
git commit -m "feat: 汉化 xxx 模块（窗口 X）"
```

### 阶段 3：报告（各窗口→窗口 E）

完成汉化后，向窗口 E 报告：

```
窗口 X 完成报告
==============
完成文件: xxx.ts, yyy.ts
新增翻译键: output.xxx, ui.xxx, errors.xxx
验证结果:
- 编译: 通过
- 帮助: 通过
待验证项: UI 界面显示（需窗口 E 验证）
```

### 阶段 4：最终验证（窗口 E 串行）

窗口 E 统一验证：

```powershell
# 1. 拉取所有更改
git pull --all

# 2. UI 界面验证（串行，一个一个测）
pnpm moltbot dashboard
# → 检查聊天界面中文
# → 检查设置界面中文

# 3. 最终编译
npx tsc -p tsconfig.json

# 4. 推送
git push origin main
```

---

## 窗口 A - CLI 向导 + doctor + 健康检查

### 负责文件

```
src/commands/onboard.ts          # 向导主逻辑
src/commands/onboard-helpers.ts  # 向导辅助函数
src/commands/doctor.ts           # 健康检查
src/commands/doctor-gateway-daemon-flow.ts  # 网关服务检查
src/commands/setup.ts            # 设置命令
src/commands/health.ts           # 健康状态
src/cli/gateway-cli/register.ts  # 网关发现
src/cli/daemon-cli/register.ts   # daemon 命令
```

### 提示词模板

```
请汉化窗口 A 负责的文件，任务清单如下：

## 任务文件
1. src/commands/onboard.ts
2. src/commands/onboard-helpers.ts
3. src/commands/doctor.ts
4. src/commands/doctor-gateway-daemon-flow.ts
5. src/commands/setup.ts
6. src/commands/health.ts
7. src/cli/gateway-cli/register.ts
8. src/cli/daemon-cli/register.ts

## 汉化规则
1. 读取每个文件，找出所有英文文本（console.log、defaultRuntime.log、提示消息）
2. 在 src/i18n/zh-CN.ts 中添加翻译键（参考 output 分类）
3. 将英文文本替换为 zhCN.output.XXX 引用
4. 排除：注释、URL、文档链接、变量名

## 示例
原文: "Setup cancelled."
翻译: zhCN.output.setupCancelled
语言包: output: { setupCancelled: "设置已取消" }

## 自验证（并行执行）
1. npx tsc -p tsconfig.json
2. pnpm moltbot doctor --help
3. pnpm moltbot onboard --help
4. git add + commit

## 报告模板（完成后发送给窗口 E）
窗口 A 完成报告
==============
完成文件: [列表]
新增翻译: [列表]
验证: 编译通过 / 帮助通过
待验证: CLI 向导运行时文本
```

### 需要汉化的典型文本

| 原文 | 键名示例 |
|------|---------|
| "Setup cancelled." | output.setupCancelled |
| "No key settings detected." | output.noKeySettings |
| "Gateway not running." | output.gatewayNotRunning |
| "Doctor complete." | output.doctorComplete |
| "Windows detected. WSL2 is strongly recommended..." | output.windowsWarning |
| "Scanning for gateways..." | output.scanningGateways |
| "Found ... gateway(s)" | output.foundGateways |

---

## 窗口 B - 前端 UI - 聊天界面

### 负责文件

```
ui/src/ui/views/chat.ts              # 聊天主界面
ui/src/ui/controllers/chat.ts        # 聊天控制器
ui/src/ui/presenter.ts               # 展示器
ui/src/ui/views/chat-input.ts        # 输入组件
ui/src/ui/theme.ts                   # 主题文本
```

### 提示词模板

```
请汉化窗口 B 负责的文件，任务清单如下：

## 任务文件
1. ui/src/ui/views/chat.ts
2. ui/src/ui/controllers/chat.ts
3. ui/src/ui/presenter.ts
4. ui/src/ui/views/chat-input.ts
5. ui/src/ui/theme.ts

## 汉化规则
1. 读取每个文件，找出所有硬编码英文文本
2. 在 src/i18n/zh-CN.ts 中添加翻译键（ui.chat 分类）
3. 将英文文本替换为引用
4. 排除：CSS 类名、变量名、URL

## 语言包格式
ui: {
  chat: {
    placeholder: "输入消息...",
    send: "发送",
    loading: "加载中...",
    stop: "停止",
    newSession: "新会话",
    // ...
  }
}

## 自验证（并行执行）
1. npx tsc -p tsconfig.json
2. git add + commit

## 报告模板
窗口 B 完成报告
==============
完成文件: [列表]
新增翻译: ui.chat.xxx
验证: 编译通过
待验证: UI 界面实际显示（请窗口 E 验证）
```

### 需要汉化的典型文本

| 原文 | 键名示例 |
|------|---------|
| "Compacting context..." | ui.chat.compacting |
| "Add a message..." | ui.chat.placeholder |
| "Connect to the gateway..." | ui.chat.connectGateway |
| "Loading chat..." | ui.chat.loading |
| "Stop" | ui.chat.stop |
| "New session" | ui.chat.newSession |
| "Send" | ui.chat.send |

---

## 窗口 C - 前端 UI - 设置界面

### 负责文件

```
ui/src/ui/views/config.ts            # 设置主界面
ui/src/ui/views/config-form.ts       # 表单配置
ui/src/ui/views/config-form.node.ts  # 节点配置表单
ui/src/ui/controllers/config.ts      # 设置控制器
ui/src/ui/app-settings.ts            # 应用设置
```

### 提示词模板

```
请汉化窗口 C 负责的文件，任务清单如下：

## 任务文件
1. ui/src/ui/views/config.ts
2. ui/src/ui/views/config-form.ts
3. ui/src/ui/views/config-form.node.ts
4. ui/src/ui/controllers/config.ts
5. ui/src/ui/app-settings.ts

## 汉化规则
1. 读取每个文件，找出所有硬编码英文文本
2. 在 src/i18n/zh-CN.ts 中添加翻译键（ui.settings 分类）
3. 区分设置界面特有的文本

## 语言包格式
ui: {
  settings: {
    title: "设置",
    searchPlaceholder: "搜索设置...",
    save: "保存",
    apply: "应用",
    unsavedChanges: "未保存的更改",
    form: "表单",
    raw: "原始",
    all: "全部",
  }
}

## 自验证（并行执行）
1. npx tsc -p tsconfig.json
2. git add + commit

## 报告模板
窗口 C 完成报告
==============
完成文件: [列表]
新增翻译: ui.settings.xxx
验证: 编译通过
待验证: 设置界面实际显示（请窗口 E 验证）
```

### 需要汉化的典型文本

| 原文 | 键名示例 |
|------|---------|
| "Settings" | ui.settings.title |
| "Search settings..." | ui.settings.searchPlaceholder |
| "Unsaved changes" | ui.settings.unsavedChanges |
| "Save" | ui.settings.save |
| "Apply" | ui.settings.apply |
| "Form" | ui.settings.form |
| "Raw" | ui.settings.raw |

---

## 窗口 D - 网关错误消息 + 日志

### 负责文件

```
src/gateway/server-methods/chat.ts       # 聊天相关错误
src/gateway/server-methods/channels.ts   # 渠道相关错误
src/gateway/boot.ts                      # 启动检查
src/gateway/call.ts                      # 网关调用错误
src/gateway/daemon.ts                    # 服务错误
src/commands/channels/capabilities.ts    # 渠道能力检查
src/commands/channels/login.ts           # 登录相关
```

### 提示词模板

```
请汉化窗口 D 负责的文件，任务清单如下：

## 任务文件
1. src/gateway/server-methods/chat.ts
2. src/gateway/server-methods/channels.ts
3. src/gateway/boot.ts
4. src/gateway/call.ts
5. src/gateway/daemon.ts
6. src/commands/channels/capabilities.ts
7. src/commands/channels/login.ts

## 汉化规则
1. 读取每个文件，找出所有错误消息和日志文本
2. 在 src/i18n/zh-CN.ts 中添加翻译键（errors 分类）
3. 错误消息要简洁明确

## 语言包格式
errors: {
  invalidParams: "参数无效",
  notFound: "未找到",
  permissionDenied: "权限被拒绝",
  connectionFailed: "连接失败",
  gatewayNotRunning: "网关未运行",
  sessionNotFound: "会话未找到",
  sendBlocked: "发送被阻止",
}

## 自验证（并行执行）
1. npx tsc -p tsconfig.json
2. git add + commit

## 报告模板
窗口 D 完成报告
==============
完成文件: [列表]
新增翻译: errors.xxx
验证: 编译通过
待验证: 错误消息实际显示（请窗口 E 验证）
```

### 需要汉化的典型文本

| 原文 | 键名示例 |
|------|---------|
| "invalid params" | errors.invalidParams |
| "session not found" | errors.sessionNotFound |
| "transcript file not found" | errors.transcriptNotFound |
| "send blocked by session policy" | errors.sendBlocked |
| "gateway not running" | errors.gatewayNotRunning |

---

## 通用汉化注意事项

### 1. 不要翻译的内容

- 变量名、函数名、类名
- 文件路径、URL
- 文档链接（docs.molt.bot）
- 配置键名（JSON keys）
- 命令行参数名（--option）
- CSS 类名
- 正则表达式
- 数字、日期格式
- 调试日志（[debug]前缀）

### 2. 翻译原则

- **简洁**: 错误消息要简短明确
- **一致**: 相同词汇使用相同翻译
- **专业**: 使用技术术语的标准中文翻译

### 3. 常见词汇对照

| 英文 | 中文 |
|------|------|
| gateway | 网关 |
| channel | 渠道 |
| session | 会话 |
| agent | 代理 |
| node | 节点 |
| config/configuration | 配置 |
| credentials | 凭据 |
| auth | 认证 |
| token | 令牌 |
| webhook | Webhook |
| plugin | 插件 |
| skill | 技能 |
| cron | 计划任务 |
| daemon | 服务 |
| sandbox | 沙箱 |

---

## 窗口 E 职责（最终验证）

### 1. 收集报告

```
收到窗口 A 完成报告
收到窗口 B 完成报告
收到窗口 C 完成报告
收到窗口 D 完成报告
```

### 2. 拉取并合并

```powershell
git pull --all
# 解决可能的冲突
```

### 3. 最终验证（串行）

```powershell
# 验证编译
npx tsc -p tsconfig.json

# 验证 UI - 聊天界面
pnpm moltbot dashboard
# → 进入聊天界面，检查中文显示

# 验证 UI - 设置界面
# → 进入设置界面，检查中文显示

# 验证 CLI 向导
pnpm moltbot doctor
# → 检查运行时中文提示
```

### 4. 推送

```powershell
git push origin main
```

---

## 启动命令

### 窗口 A
> "读取 `TASKS_SPLIT.md`，按照窗口 A 的提示词执行，完成后报告给窗口 E"

### 窗口 B
> "读取 `TASKS_SPLIT.md`，按照窗口 B 的提示词执行，完成后报告给窗口 E"

### 窗口 C
> "读取 `TASKS_SPLIT.md`，按照窗口 C 的提示词执行，完成后报告给窗口 E"

### 窗口 D
> "读取 `TASKS_SPLIT.md`，按照窗口 D 的提示词执行，完成后报告给窗口 E"

### 窗口 E
> "读取 `TASKS_SPLIT.md`，等待各窗口报告，然后执行最终验证和合并"
