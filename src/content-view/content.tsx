import { renderToc } from './toc';
import { MSG_NAMES } from '../shared/constants';
import { addMessageListener, Message } from '../extension-utils/api';

// 监听后台消息，用于监听开启、关闭快捷键 Command+B
addMessageListener((msg: Message) => {
  if (msg.name === MSG_NAMES.TOGGLE_TOC) renderToc();
});

if (import.meta.env.DEV) setTimeout(renderToc, 1000);
