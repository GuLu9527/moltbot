# Moltbot → Openclaw 同步记录

## 同步时间
2026-01-30

## 上游变更摘要

- 项目重命名为 **Openclaw**
- 命令名 `moltbot` → `openclaw`
- 配置路径 `~/.clawdbot` → `~/.openclaw`
- 文档链接 `docs.molt.bot` → `docs.openclaw.ai`
- 版本更新至 2026.1.29

## 汉化状态

### 已完成的汉化 ✅
- CLI 命令描述（主命令 + 子命令）
- UI 界面文本（导航、设置、聊天）
- 错误消息（gateway、chat、channels）
- 向导提示文本（doctor、onboard、setup）
- 帮助信息（Usage/Options/Commands）

### 本地修改（未提交）
- UI 界面路径修复（@moltbot/i18n 别名）
- navigation.ts 汉化
- config-form.render.ts 汉化
- 翻译键结构：zhCN.commands.ui.chat.xxx

## 冲突文件清单

需要手动解决冲突的文件：

```
src/cli/banner.ts                    # Banner 文本
src/cli/browser-cli.ts               # 命令名
src/cli/dns-cli.ts                   # 选项描述
src/cli/docs-cli.ts                  # 选项描述
src/cli/gateway-cli/register.ts      # 命令描述
src/cli/nodes-cli/register.ts        # 命令描述
src/cli/plugins-cli.ts               # 命令描述
src/cli/program/help.ts              # 大量冲突（示例、选项）
src/cli/program/register.setup.ts    # 选项描述
src/cli/webhooks-cli.ts              # 命令描述
```

## 翻译键结构

当前语言包结构：
```typescript
zhCN = {
  commands: {
    // CLI 命令描述
    message: "发送消息和渠道操作",
    // ...

    // UI 文本
    ui: {
      chat: { /* 聊天界面 */ },
      settings: { /* 设置界面 */ },
    },
    navigation: { /* 导航 */ },
    configSections: { /* 配置分类 */ },
  },
  output: { /* 输出消息 */ },
  errors: { /* 错误消息 */ },
}
```

## 后续步骤

1. [ ] 解决所有冲突文件
2. [ ] 验证 TypeScript 编译
3. [ ] 验证 UI 构建
4. [ ] 测试关键命令帮助
5. [ ] 推送更新
