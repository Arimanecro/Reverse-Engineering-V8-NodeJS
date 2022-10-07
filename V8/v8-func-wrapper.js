var debugFunc = (V8func) => (args) => new Function(`return %${V8func}(${args})`)();
var mapFunc = new Function(
  `return (obj1, obj2) => console.log(%HaveSameMap(obj1, obj2))`
)();
// *Note [mapFunc]: "Intrinsic calls do not support spread arguments". That's why impossible
// to insert [...arguments] into %HaveSameMap

globalThis.v8 = {
  dp: debugFunc("DebugPrint"),
  dpp: debugFunc("DebugPrintPtr"),
  hsm: mapFunc,
};
