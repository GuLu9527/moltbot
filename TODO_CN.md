# OpenClaw 中文汉化 - 待修复清单

## 检查日期: 2026-01-30

---

## 1. 主命令帮助示例 (高优先级)

**文件**: `src/cli/program/help.ts`

**问题**: EXAMPLES 数组中的命令还是 `moltbot` 而不是 `openclaw`

**当前内容**:
```typescript
const EXAMPLES = [
  ["moltbot channels login --verbose", "链接个人 WhatsApp Web 并显示二维码 + 连接日志"],
  ["moltbot message send --target +15555550123 --message "Hi" --json", "通过网页会话发送并打印 JSON 结果"],
  ...
]
```

**需要改为**: `openclaw`

---

## 2. Onboard 向导 (高优先级)

**文件**: `src/commands/onboard.ts`

**问题**: 向导中的安全提示和交互文本是英文

**需要汉化的文本**:
- "Security warning — please read."
- "OpenClaw is a hobby project and still in beta. Expect sharp edges."
- "This bot can read files and run actions if tools are enabled."
- "A bad prompt can trick it into doing unsafe things."
- "If you're not comfortable with basic security and access control, don't run OpenClaw."
- "Ask someone experienced to help before enabling tools or exposing it to the internet."
- "Recommended baseline:"
- "- Pairing/allowlists + mention gating."
- "- Sandbox + least-privilege tools."
- "- Keep secrets out of the agent's reachable filesystem."
- "- Use the strongest available model for any bot with tools or untrusted inboxes."
- "Run regularly:"
- "openclaw security audit --deep"
- "openclaw security audit --fix"
- "Must read: https://docs.openclaw.ai/gateway/security"
- "I understand this is powerful and inherently risky. Continue?"

---

## 3. Configure 向导 (高优先级)

**文件**: `src/commands/configure.ts`

**问题**: 向导中的提示文本是英文

**需要汉化的文本**:
- "Existing config detected"
- "Where will the Gateway run?"
- 各种配置选项的提示

---

## 4. Doctor 向导 (中优先级)

**文件**: `src/commands/doctor.ts`

**问题**: 健康检查的输出消息部分是英文

---

## 5. UI 界面 (中优先级)

**文件**: `ui/src/ui/...`

**状态**: 未测试

需要测试:
- 聊天界面
- 设置界面
- 导航菜单

---

## 6. 错误消息 (低优先级)

**文件**: `src/gateway/server-methods/*.ts`

**状态**: 可能已汉化，需要验证

---

## 修复优先级

### 高优先级 (P0)
1. [ ] 修复 help.ts 中的示例命令 (moltbot → openclaw)
2. [ ] 汉化 onboard 向导文本
3. [ ] 汉化 configure 向导文本

### 中优先级 (P1)
4. [ ] 汉化 doctor 向导输出
5. [ ] 测试 UI 界面中文显示

### 低优先级 (P2)
6. [ ] 检查并汉化错误消息
7. [ ] 检查其他遗漏的英文文本

---

## 验证命令

```powershell
# 主命令
openclaw --help

# 子命令
openclaw message --help
openclaw nodes --help
openclaw cron --help

# 向导
openclaw onboard
openclaw configure
openclaw doctor

# UI
openclaw dashboard
```
