import { genIdClsSelector, getRect, isHidden, queryAll } from './dom-util';
import { SITES } from '../shared/site-config';
import { DISPLAY, NODE_NAME, NOISE_SELECTORS, NOISE_WORDS, POSITION, SYMBOL } from '../shared/constants';

export function resolveArticle(): HTMLElement {
  const bodyRect = getRect(document.body);
  const mainNode: HTMLElement = searchMainNode(bodyRect) || document.body;

  // 根据配置获取文章节点
  const siteConfig = SITES.find((s) => location.href.startsWith(s.url));
  let articleNode = siteConfig?.article ? queryAll(siteConfig?.article)[0] : null;

  // 根据算法获取文章节点
  if (!articleNode) {
    articleNode = searchArticle(mainNode, bodyRect);
    articleNode = fixArticleNode(mainNode, articleNode);
  }

  if (import.meta.env.DEV) {
    mainNode.style.boxShadow = 'inset blue 0 0 0 10px';
    articleNode.style.boxShadow = 'inset red 0 0 0 10px';
  }

  mainNode.toggleAttribute('onetoc-main', true);
  articleNode.toggleAttribute('onetoc-article', true);

  return articleNode;
}

const articleSelector = ['', '.', '#'].map((s) => s + NODE_NAME.article).join(SYMBOL.COMMA);
const negativeSelector = NOISE_SELECTORS.join(SYMBOL.COMMA);
const positiveSelector = genIdClsSelector(['content', 'blog', 'markdown', 'main']);
const noiseSelector = genIdClsSelector(NOISE_WORDS);

function searchArticle(parent: HTMLElement, bodyRect: DOMRect): HTMLElement {
  const pRect = getRect(parent);
  const pText = getVisibleText(parent);
  const pArea = pRect.width * pRect.height;

  const SCORE = 100;

  const children = ([...parent.children] as HTMLElement[])
    .map((child) => {
      const rect = getRect(child);
      const style = getComputedStyle(child);
      const text = getVisibleText(child);

      const topRate = rect.top / pRect.height || 0;
      const areaRate = (rect.width * rect.height) / pArea || 0;
      const textRate = text.length / pText.length || 0;

      const isTooFar = rect.top - pRect.top > 0.8 * window.outerHeight;
      const isTooSmall = Math.max(areaRate, textRate) < 0.5;
      const isFixedPos = [POSITION.fixed, POSITION.sticky].includes(style.position);
      const isInline = style.display.includes(DISPLAY.inline);

      if (isTooFar || isTooSmall || isFixedPos || isInline || isHidden(child, style, rect, bodyRect)) {
        return { child, score: -Infinity };
      }

      let score = SCORE * (textRate + areaRate - topRate);

      if (child.matches(articleSelector)) score += SCORE;
      if (child.matches(positiveSelector)) score += SCORE / 4;
      if (child.matches(negativeSelector)) score -= SCORE;
      if (child.matches(noiseSelector)) score -= SCORE / 2;

      return { child, score };
    })
    .filter((n) => n.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  return children[0] ? searchArticle(children[0].child, bodyRect) : parent;
}

// 用于修复特殊文章，如：https://mp.weixin.qq.com/s/7hMdPkNcFihKXypKY2DMHg
function fixArticleNode(mainNode: HTMLElement, articleNode: HTMLElement) {
  const rect = getRect(articleNode);
  const text = getVisibleText(articleNode);

  const pRect = getRect(mainNode);
  const pText = getVisibleText(mainNode);

  const RATE = 0.8;
  const textRate = text.length / pText.length || 0;
  const areaRate = (rect.width * rect.height) / (pRect.width * pRect.height) || 0;

  const needFix =
    rect.top === pRect.top &&
    rect.left === pRect.left &&
    rect.right === pRect.right &&
    textRate < RATE &&
    areaRate < RATE;

  return needFix ? mainNode : articleNode;
}

function searchMainNode(bodyRect: DOMRect) {
  const nodes = queryAll('body :not(:is(script,style,svg))');

  const bodyTextCount = getVisibleText(document.body).length;

  return nodes.findLast((node: HTMLElement) => {
    const textCount = getVisibleText(node).length;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);

    return rect.top - bodyRect.top <= 400 && textCount / bodyTextCount >= 0.8 && !isHidden(node, style, rect, bodyRect);
  });
}

function getVisibleText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s/g, '');
}
