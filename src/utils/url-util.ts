import { SYMBOL } from '../content/constants';
import { getText } from './dom-util';

// TODO: 用于拷贝锚点链接
export function genAnchorUrl(node: HTMLElement) {
  const id = encodeURIComponent(node.id || node.getAttribute('name') || '');
  const text = getText(node);
  if (!id && !text) return '';

  const textFragment = `:~:text=${encodeURIComponent(text)}`;

  const hash = SYMBOL.HASH + (id || textFragment);
  return location.hash ? location.href.replace(location.hash, hash) : `${location.href}${hash}`;
}
