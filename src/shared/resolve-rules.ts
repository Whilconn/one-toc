import resolveRuleJson from './resolve-rules.json';

export const RESOLVE_RULES_VERSION: string = resolveRuleJson.version;
export const RESOLVE_RULES: ResolveRule[] = resolveRuleJson.rules;

export type ResolveRule = {
  // 网页匹配规则
  pages: string[];
  // 正文DOM选择器
  article: string;
  // 段落标题DOM选择器
  headings: string[];
};
