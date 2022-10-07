import { performance, PerformanceObserver } from "perf_hooks";

const performanceCheck = (func) => {
  const obs = new PerformanceObserver((list) => {
    console.log(
      `${list.getEntries()[0].name}: ${list
        .getEntries()[0]
        .duration.toFixed(3)}`
    );
    obs.disconnect();
  });
  obs.observe({ entryTypes: ["function"] });
  performance.timerify(func)();
};

const performanceCheck2 = new PerformanceObserver((list) => {
  console.log(
    `${list.getEntries()[0].name}: ${list.getEntries()[0].duration.toFixed(3)}`
  );
  performanceCheck2.disconnect();
  performance.clearMarks();
});
performanceCheck2.observe({ entryTypes: ["measure"] });

// PERFORMANCE TESTING

let func = (i) => i * i;
var func2 = (i) => i * i;

let constLoop = () => {
  for (let i = 1; i < 1e8; i++) {
    func(i);
  }
};

var varLoop = () => {
  for (var i = 1; i < 1e8; i++) {
    func2(i);
  }
};

var argsLoop = (f) => {
  performance.mark("A");
  for (var i = 1; i < 1e8; i++) {
    f(i);
  }
  performance.mark("B");
  performance.measure("A to B", "A", "B");
};

%NeverOptimizeFunction(func);
%NeverOptimizeFunction(func2);

performanceCheck(constLoop); // ~1437 ms
performanceCheck(varLoop); // ~1345 ms
// 92 ms difference

argsLoop(func); // 1373 ms

// node --allow-natives-syntax var-vs-let"&"const-2.js