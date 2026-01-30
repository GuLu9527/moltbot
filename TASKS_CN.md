# Moltbot 中文汉化任务清单

## 概览

本项目 CLI 命令需要汉化。语言包位于 `src/i18n/zh-CN.ts`，使用 `zhCN.commands.xxx` 引用中文翻译。

---

## 窗口 A（协调 + 已完成）

- [x] 语言包更新（添加通用翻译）
- [x] message 子命令
- [x] nodes 子命令
- [ ] agents 子命令（补充）
- [ ] browser 子命令（补充）

---

## 窗口 B（cron + daemon + logs + system + status/health/sessions）

### 负责文件
```
src/cli/cron-cli/register.ts          # cron 主命令
src/cli/cron-cli/cron-*.ts            # cron 子命令全部
src/cli/daemon-cli/register.ts        # daemon 主命令
src/cli/daemon-cli/*.ts               # daemon 子命令全部
src/cli/logs-cli.ts                   # logs
src/cli/system-cli.ts                 # system
src/cli/program/register.status-health-sessions.ts  # status, health, sessions
```

### 汉化步骤
1. `git pull origin main`
2. 读取每个文件的 `.description(...)` 部分
3. 在 `zh-CN.ts` 中添加对应的翻译键（参考已有模式）
4. 将英文描述替换为 `zhCN.commands.xxx`
5. 测试：`pnpm moltbot <command> --help`
6. 完成后：`git add + commit`（不要推送）

---

## 窗口 C（models + devices + node + plugins + skills）

### 负责文件
```
src/cli/models-cli.ts                 # models
src/cli/devices-cli.ts                # devices
src/cli/node-cli/register.ts          # node 主命令
src/cli/node-cli/*.ts                 # node 子命令全部
src/cli/plugins-cli.ts                # plugins
src/cli/skills-cli.ts                 # skills
```

### 汉化步骤
同上

---

## 窗口 D（杂项模块）

### 负责文件
```
src/cli/security-cli.ts               # security
src/cli/pairing-cli.ts                # pairing
src/cli/webhooks-cli.ts               # webhooks
src/cli/hooks-cli.ts                  # hooks
src/cli/docs-cli.ts                   # docs
src/cli/dns-cli.ts                    # dns
src/cli/sandbox-cli.ts                # sandbox
src/cli/acp-cli.ts                    # acp
src/cli/tui-cli.ts                    # tui
src/cli/memory-cli.ts                 # memory（补充未汉化的子命令）
src/cli/config-cli.ts                 # config（补充未汉化的子命令）
```

### 汉化步骤
同上

---

## 语言包格式参考

在 `src/i18n/zh-CN.ts` 中添加翻译：

```typescript
export const zhCN = {
  commands: {
    // 主命令
    commandName: "命令描述",

    // 子命令
    commandSubcommand: "子命令描述",

    // 特定功能
    commandSpecificAction: "具体操作描述",
  },
} as const;
```

### 已有的翻译键（可参考）
- `zhCN.commands.message` - message 主命令
- `zhCN.commands.nodesManage` - nodes 主命令
- `zhCN.commands.nodesStatus` - nodes status
- `zhCN.commands.nodesList` - nodes list
- `zhCN.commands.nodesPending` - nodes pending
- `zhCN.commands.nodesApprove` - nodes approve
- `zhCN.commands.nodesReject` - nodes reject
- `zhCN.commands.nodesRename` - nodes rename
- `zhCN.commands.nodesInvoke` - nodes invoke
- `zhCN.commands.nodesRun` - nodes run
- `zhCN.commands.nodesNotify` - nodes notify
- `zhCN.commands.nodesCanvas*` - canvas 相关
- `zhCN.commands.nodesCamera*` - camera 相关
- `zhCN.commands.nodesScreen*` - screen 相关
- `zhCN.commands.nodesLocation*` - location 相关

---

## 测试方法

```powershell
pnpm moltbot <command> --help        # 查看命令帮助
pnpm moltbot message --help          # 示例：message 子命令
pnpm moltbot cron --help             # 示例：cron 子命令
pnpm moltbot nodes --help            # 示例：nodes 子命令
```

---

## 注意事项

1. **每个窗口开始前必须**：`git pull origin main`
2. **每个窗口完成后**：`git add + commit` 但**不要推送**
3. **遇到冲突时**：联系窗口 A 协调解决
4. **语言包由窗口 A 统一管理**，其他窗口只添加自己模块的翻译
5. 所有窗口完成后，窗口 A 执行：`git pull --all && git push origin main`
