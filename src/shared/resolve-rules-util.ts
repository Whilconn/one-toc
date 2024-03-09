import * as micromatch from 'micromatch';
import { RESOLVE_RULES, ResolveRule } from './resolve-rules';
import { saveSettings } from '../extension-utils/settings';

export function matchResolveRule(rules: ResolveRule[]) {
  const pathInUrl = location.host + location.pathname;
  if (!rules?.length) rules = RESOLVE_RULES;

  return rules.find((c) => micromatch.some([location.href, pathInUrl], c.pages));
}

/** 更新解析规则 **/
export async function updateResolveRules() {
  const resolveConfigUrl = import.meta.env.VITE_RESOLVE_URL as string;
  const resolveConfigJson = (await fetch(resolveConfigUrl).then((r) => {
    return r.ok ? r.json() : new Error(`${r.status} ${r.statusText}`);
  })) as { version: string; rules: ResolveRule[] };

  if (!resolveConfigJson?.version || !resolveConfigJson?.rules) return Promise.reject(resolveConfigJson);

  await saveSettings({
    resolveRules: resolveConfigJson.rules,
    resolveRulesVersion: resolveConfigJson.version,
  });

  return resolveConfigJson;
}
