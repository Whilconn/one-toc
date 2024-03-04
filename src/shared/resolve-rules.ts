import * as micromatch from 'micromatch';
import resolveRuleJson from './resolve-rules.json';
import { loadSettings, saveSettings, Settings } from '../extension-utils/settings';

export const RESOLVE_RULES_VERSION = resolveRuleJson.version as string;
export const RESOLVE_RULES: ResolveRule[] = resolveRuleJson.rules;

export function matchResolveRule(rules: ResolveRule[]) {
  const pathInUrl = location.host + location.pathname;
  if (!rules?.length) rules = RESOLVE_RULES;

  return rules.find((c) => micromatch.some([location.href, pathInUrl], c.pages));
}

/** 更新解析规则 **/
export async function updateResolveRules() {
  const settings: Settings = await loadSettings();

  const resolveConfigUrl = import.meta.env.VITE_RESOLVE_URL as string;
  const resolveConfigJson = (await fetch(resolveConfigUrl).then((r) => {
    return r.ok ? r.json() : new Error(`${r.status} ${r.statusText}`);
  })) as { version: string; rules: ResolveRule[] };

  if (!resolveConfigJson?.version) return Promise.reject(resolveConfigJson);

  if (!settings?.resolveRulesVersion || resolveConfigJson.version > settings.resolveRulesVersion) {
    return saveSettings({
      resolveRules: resolveConfigJson.rules,
      resolveRulesVersion: resolveConfigJson.version,
    });
  }

  return Promise.reject(new Error('更新失败'));
}

export type ResolveRule = {
  // 网页匹配规则
  pages: string[];
  // 正文DOM选择器
  article: string;
  // 段落标题DOM选择器
  headings: string[];
};
