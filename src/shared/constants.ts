export const CID = 'onetoc-1652755589611';

export const HEADER_HEIGHT = 100;

const nodeNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'strong', 'a'];
export const NODE_NAME = Object.fromEntries(nodeNames.map((k) => [k, k]));

export const HEADING_SELECTORS = [NODE_NAME.h1, NODE_NAME.h2, NODE_NAME.h3, NODE_NAME.h4, NODE_NAME.h5, NODE_NAME.h6];

export const BOLD_SELECTORS = [NODE_NAME.b, NODE_NAME.strong];

export const SYMBOL = { HASH: '#', COMMA: ',' };

export const FIXED_POSITIONS = ['sticky', 'fixed', 'absolute'];

export const MSG_NAMES = { TOGGLE_TOC: 'toggle-toc' };

export const TOC_LEVEL = 'onetoc-level';
