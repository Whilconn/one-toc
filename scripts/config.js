const path = require('path');

const [DEST, PUBLIC] = ['dist', 'public'];

const ROOT_ABS = path.resolve(__dirname, '..');
const DEST_ABS = path.resolve(ROOT_ABS, DEST);
const PUBLIC_ABS = path.resolve(ROOT_ABS, PUBLIC);

module.exports = { ROOT_ABS, DEST_ABS, PUBLIC_ABS };
