import v8 from "v8";
import { PerformanceObserver, performance } from "perf_hooks";

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries();
  entry.forEach((e) => console.log(`Time for ${e.name} : ${e.duration.toFixed(3)}`));
  performance.clearMarks();
});
obs.observe({ type: "measure" });

const syncBlockingCode = () => console.log("test");
const stringify = (f) => `const f = ${f}; f();`;

{
  performance.mark("v8.serialize start");
  const test = () => {
    const encode = v8.serialize(stringify(syncBlockingCode));
    const decode = v8.deserialize(encode);
  };
  for (let i = 0; i !== 1e6; i++) test();
  performance.mark("v8.serialize end");
  performance.measure("V8", "v8.serialize start", "v8.serialize end");
} 
// ~7496 ms (V8 ver.9.5)
// ~5965 ms (V8 ver.10.2)
{
  performance.mark("TextEncoder start");
  const test = () => {
    const encode = new TextEncoder().encode(stringify(syncBlockingCode));
    const decode = new TextDecoder().decode(encode);
  };
  for(let i=0; i !== 1e6; i++) test();
  performance.mark("TextEncoder end");
  performance.measure("TextEncoder", "TextEncoder start", "TextEncoder end");
} 
// ~5087 ms (V8 ver.9.5)
// ~5646 ms (V8 ver.10.2)
