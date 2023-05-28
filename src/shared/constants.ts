export const CID = 'onetoc-1652755589611';

export const HEADER_HEIGHT = 100;

// 标签名 nodeName，tagName
const nodeNames = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'b',
  'strong',
  'a',
  'p',
  'article',
  'header',
  'aside',
  'footer',
  'nav',
] as const;
export const NODE_NAME = Object.fromEntries(nodeNames.map((k) => [k, k])) as Record<(typeof nodeNames)[number], string>;

// 定位 position
const positions = ['relative', 'static', 'sticky', 'fixed', 'absolute'] as const;
export const POSITION = Object.fromEntries(positions.map((p) => [p, p])) as Record<(typeof positions)[number], string>;
export const FIXED_POSITIONS = [POSITION.sticky, POSITION.fixed, POSITION.absolute];

// 布局 display
const displays = ['block', 'inline'] as const;
export const DISPLAY = Object.fromEntries(displays.map((p) => [p, p])) as Record<(typeof displays)[number], string>;

export const HEADING_SELECTORS = [NODE_NAME.h1, NODE_NAME.h2, NODE_NAME.h3, NODE_NAME.h4, NODE_NAME.h5, NODE_NAME.h6];

export const BOLD_SELECTORS = [NODE_NAME.b, NODE_NAME.strong];

export const NOISE_SELECTORS = [NODE_NAME.header, NODE_NAME.aside, NODE_NAME.footer, NODE_NAME.nav];

export const SYMBOL = { HASH: '#', COMMA: ',' };

export const MSG_NAMES = { TOGGLE_TOC: 'toggle-toc' };

export const TOC_LEVEL = 'onetoc-level';
