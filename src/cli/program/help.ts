import type { Command } from "commander";
import { formatDocsLink } from "../../terminal/links.js";
import { isRich, theme } from "../../terminal/theme.js";
import { formatCliBannerLine, hasEmittedCliBanner } from "../banner.js";
import { replaceCliName, resolveCliName } from "../cli-name.js";
import type { ProgramContext } from "./context.js";

const CLI_NAME = resolveCliName();

const EXAMPLES = [
  ["moltbot channels login --verbose", "链接个人 WhatsApp Web 并显示二维码 + 连接日志"],
  ['moltbot message send --target +15555550123 --message "Hi" --json', "通过网页会话发送并打印 JSON 结果"],
  ["moltbot gateway --port 18789", "本地运行 WebSocket 网关"],
  ["moltbot --dev gateway", "运行开发网关（隔离状态/配置）"],
  ["moltbot gateway --force", "终止默认网关端口上的所有进程，然后启动"],
  ["moltbot gateway ...", "通过 WebSocket 控制网关"],
  ['moltbot agent --to +15555550123 --message "Run summary" --deliver', "直接与代理对话；可选发送 WhatsApp 回复"],
  ['moltbot message send --channel telegram --target @mychat --message "Hi"', "通过 Telegram 机器人发送"],
] as const;

export function configureProgramHelp(program: Command, ctx: ProgramContext) {
  program
    .name(CLI_NAME)
    .description("")
    .version(ctx.programVersion)
    .option("--dev", "开发模式：在 ~/.clawdbot-dev 下隔离状态，默认网关端口 19001，偏移派生端口（browser/canvas）")
    .option("--profile <name>", "使用命名配置文件（在 ~/.clawdbot-<name> 下隔离 CLAWDBOT_STATE_DIR/CLAWDBOT_CONFIG_PATH）")
    .option("--no-color", "禁用 ANSI 颜色", false)
    .option("-h, --help", "显示帮助信息");

  // 中文帮助输出配置
  const configureHelpOutput = (cmd: Command) => {
    cmd.configureOutput({
      writeOut: (str) => {
        const colored = str
          .replace(/^Usage:/gm, theme.heading("用法:"))
          .replace(/^Options:/gm, theme.heading("选项:"))
          .replace(/^Commands:/gm, theme.heading("命令:"))
          .replace(/^Examples:/gm, theme.heading("示例:"))
          .replace(/^  -h, --help.*$/gm, "  -h, --help  显示帮助信息")
          .replace(/^  --help.*$/gm, "  --help  显示帮助信息");
        process.stdout.write(colored);
      },
      writeErr: (str) => process.stderr.write(str),
      outputError: (str, write) => write(theme.error(str)),
    });
    cmd.configureHelp({
      optionTerm: (option) => theme.option(option.flags),
      subcommandTerm: (subCmd) => theme.command(subCmd.name()),
    });
  };

  configureHelpOutput(program);

  // 自定义 help 选项描述
  program.helpOption("-h, --help", "显示帮助信息");

  // 自定义 help 子命令描述
  program.addHelpCommand("help [command]", "显示帮助信息");

  if (
    process.argv.includes("-V") ||
    process.argv.includes("--version") ||
    process.argv.includes("-v")
  ) {
    console.log(ctx.programVersion);
    process.exit(0);
  }

  program.addHelpText("beforeAll", () => {
    if (hasEmittedCliBanner()) return "";
    const rich = isRich();
    const line = formatCliBannerLine(ctx.programVersion, { richTty: rich });
    return `\n${line}\n`;
  });

  const fmtExamples = EXAMPLES.map(
    ([cmd, desc]) => `  ${theme.command(replaceCliName(cmd, CLI_NAME))}\n    ${theme.muted(desc)}`,
  ).join("\n");

  program.addHelpText("afterAll", ({ command }) => {
    if (command !== program) return "";
    const docs = formatDocsLink("/cli", "docs.molt.bot/cli");
    return `\n${theme.heading("示例:")}\n${fmtExamples}\n\n${theme.muted("文档:")} ${docs}\n`;
  });
}
