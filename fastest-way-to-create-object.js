import { performance, PerformanceObserver } from "perf_hooks";

let verV8 = [...process.versions.v8].slice(0, 5).join("");
console.dir(verV8); // '9.5.1'

let name = "Jane Doe";

const bracket = () => ({});
const objectWithKey = () => ({[`${name}`]:null});
const curlyBrace = () => {return {}};
const objectCreate = () => Object.create({});
const objectWithoutProto = () => Object.create(null);
const object = () => new Object;
const objectWithConstructor = () => new Object();
const jsonParse = () => JSON.parse("{}");

const listOfFunc = [
  bracket,
  objectWithKey,
  curlyBrace,
  objectCreate,
  objectWithoutProto,
  object,
  objectWithConstructor,
  jsonParse,
];

const performanceCheck = (func) => {
  const obs = new PerformanceObserver((list) => {
    console.log(`${list.getEntries()[0].name}: ${list.getEntries()[0].duration.toFixed(3)}`);
    obs.disconnect();
  });
  obs.observe({ entryTypes: ["function"] });
  performance.timerify(func)();
};

listOfFunc.map(f => {
  for(let i=0; i !== 1e6; i++) f();
  performanceCheck(f);
});

// bracket: 0.077
// objectWithKey: 0.008
// curlyBrace: 0.008
// objectCreate: 0.062
// objectWithoutProto: 0.008
// object: 0.008
// objectWithConstructor: 0.009
// jsonParse: 0.015