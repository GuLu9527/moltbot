import type { Command } from "commander";
import { zhCN } from "../../i18n/zh-CN.js";
import { formatDocsLink } from "../../terminal/links.js";
import { isRich, theme } from "../../terminal/theme.js";
import { formatCliBannerLine, hasEmittedCliBanner } from "../banner.js";
import { replaceCliName, resolveCliName } from "../cli-name.js";
import type { ProgramContext } from "./context.js";

const CLI_NAME = resolveCliName();

const EXAMPLES = [
  ["moltbot channels login --verbose", zhCN.help.exampleChannelsLogin],
  [
    'moltbot message send --target +15555550123 --message "Hi" --json',
    zhCN.help.exampleMessageSend,
  ],
  ["moltbot gateway --port 18789", zhCN.help.exampleGatewayPort],
  ["moltbot --dev gateway", zhCN.help.exampleDevGateway],
  ["moltbot gateway --force", zhCN.help.exampleGatewayForce],
  ["moltbot gateway ...", zhCN.help.exampleGatewayControl],
  [
    'moltbot agent --to +15555550123 --message "Run summary" --deliver',
    zhCN.help.exampleAgentDeliver,
  ],
  [
    'moltbot message send --channel telegram --target @mychat --message "Hi"',
    zhCN.help.exampleTelegramSend,
  ],
] as const;

export function configureProgramHelp(program: Command, ctx: ProgramContext) {
  program
    .name(CLI_NAME)
    .description("")
    .version(ctx.programVersion)
    .option("--dev", zhCN.options.dev)
    .option("--profile <name>", zhCN.options.profile)
    .option("--no-color", zhCN.options.noColor, false)
    .option("-h, --help", zhCN.options.help);

  // 中文帮助输出配置
  const configureHelpOutput = (cmd: Command) => {
    cmd.configureOutput({
      writeOut: (str) => {
        const colored = str
          .replace(/^Usage:/gm, theme.heading(`${zhCN.help.usage}:`))
          .replace(/^Options:/gm, theme.heading(`${zhCN.help.options}:`))
          .replace(/^Commands:/gm, theme.heading(`${zhCN.help.commands}:`))
          .replace(/^Examples:/gm, theme.heading(`${zhCN.help.examples}:`))
          .replace(/^  -h, --help.*$/gm, `  -h, --help  ${zhCN.options.help}`)
          .replace(/^  --help.*$/gm, `  --help  ${zhCN.options.help}`);
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
  program.helpOption("-h, --help", zhCN.options.help);

  // 自定义 help 子命令描述
  program.addHelpCommand("help [command]", zhCN.options.help);

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
    return `\n${theme.heading(`${zhCN.help.examples}:`)}\n${fmtExamples}\n\n${theme.muted(`${zhCN.help.docs}:`)} ${docs}\n`;
  });
}
