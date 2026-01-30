import {
  confirm as clackConfirm,
  intro as clackIntro,
  outro as clackOutro,
  select as clackSelect,
  text as clackText,
} from "@clack/prompts";

import { stylePromptHint, stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";
import { zhCN } from "../i18n/zh-CN.js";

export const CONFIGURE_WIZARD_SECTIONS = [
  "workspace",
  "model",
  "web",
  "gateway",
  "daemon",
  "channels",
  "skills",
  "health",
] as const;

export type WizardSection = (typeof CONFIGURE_WIZARD_SECTIONS)[number];

export type ChannelsWizardMode = "configure" | "remove";

export type ConfigureWizardParams = {
  command: "configure" | "update";
  sections?: WizardSection[];
};

export const CONFIGURE_SECTION_OPTIONS: Array<{
  value: WizardSection;
  label: string;
  hint: string;
}> = [
  { value: "workspace", label: zhCN.output.workspaceLabel, hint: zhCN.output.workspaceHint },
  { value: "model", label: zhCN.output.modelLabel, hint: zhCN.output.modelHint },
  { value: "web", label: zhCN.output.webToolsLabel, hint: zhCN.output.webToolsHint },
  { value: "gateway", label: zhCN.output.gatewayLabel, hint: zhCN.output.gatewayHint },
  {
    value: "daemon",
    label: zhCN.output.daemonLabel,
    hint: zhCN.output.daemonHint,
  },
  {
    value: "channels",
    label: zhCN.output.channelsLabel,
    hint: zhCN.output.channelsHint,
  },
  { value: "skills", label: zhCN.output.skillsLabel, hint: zhCN.output.skillsHint },
  {
    value: "health",
    label: zhCN.output.healthLabel,
    hint: zhCN.output.healthHint,
  },
];

export const intro = (message: string) => clackIntro(stylePromptTitle(message) ?? message);
export const outro = (message: string) => clackOutro(stylePromptTitle(message) ?? message);
export const text = (params: Parameters<typeof clackText>[0]) =>
  clackText({
    ...params,
    message: stylePromptMessage(params.message),
  });
export const confirm = (params: Parameters<typeof clackConfirm>[0]) =>
  clackConfirm({
    ...params,
    message: stylePromptMessage(params.message),
  });
export const select = <T>(params: Parameters<typeof clackSelect<T>>[0]) =>
  clackSelect({
    ...params,
    message: stylePromptMessage(params.message),
    options: params.options.map((opt) =>
      opt.hint === undefined ? opt : { ...opt, hint: stylePromptHint(opt.hint) },
    ),
  });
