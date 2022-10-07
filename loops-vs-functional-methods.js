import { performance, PerformanceObserver } from "perf_hooks";

let verV8 = [...process.versions.v8].slice(0, 5).join("");
console.log(verV8);

const forOf_ObjectEntries = () => { 
    let arr =  [...Array(1_000_000).keys()];
    for (const [key,_] of Object.entries(arr)) key * 2 
};
const forOf_ObjectEntries_2 = () => { 
    let arr =  [...Array(1_000_000).keys()];
    let entries = Object.entries(arr);
    for (const [key,_] of entries) key * 2 
};
const ObjectKeysforEach = () => { 
  let arr =  [...Array(1_000_000).keys()];
  Object.keys(arr).forEach(v => v * 2);
};
const forIn = () => { 
  let arr =  [...Array(1_000_000).keys()];
  for (let prop in arr) prop * 2;
};
const reduce = () => {
  let arr =  [...Array(1_000_000).keys()];
  arr.reduce((_, currentValue) => currentValue * 2)
}
const map = () => {
  let arr =  [...Array(1_000_000).keys()];
  arr.map((_, currentValue) => currentValue * 2)
}
const flatMap = () => { 
  let arr =  [...Array(1_000_000).keys()];
  arr.flatMap(x => x * 2) 
};
const flat = () => { 
  let arr =  [...Array(1_000_000).keys()];
  arr.flat(x => x * 2) 
};
const filter = () => {
  let arr =  [...Array(1_000_000).keys()];
  arr.filter(value => value * 2)
}
const listOfLoops = [forOf_ObjectEntries, forOf_ObjectEntries_2, ObjectKeysforEach, forIn, reduce, map, flat, flatMap, filter]

const performanceCheck = (func) => {
  const obs = new PerformanceObserver((list) => {
    console.log(`${list.getEntries()[0].name}: ${list.getEntries()[0].duration.toFixed(3)}`);
    obs.disconnect();
  });
  obs.observe({ entryTypes: ["function"] });
  performance.timerify(func)();
};

listOfLoops.map(f => performanceCheck(f));

// V8 (10.2):
// forOf_ObjectEntries: 635.228
// forOf_ObjectEntries_2: 495.508
// flatMap: 277.944
// flat: 265.271
// forIn: 236.968
// ObjectKeysforEach: 210.241
// reduce: 108.306
// filter: 114.822
// map: 65.723
