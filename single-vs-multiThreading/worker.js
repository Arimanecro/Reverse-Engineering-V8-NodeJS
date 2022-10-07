import { parentPort, threadId } from "worker_threads";

const fibonacci = (num) => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

parentPort.on("message", ({ arr }) => {
  const start = Date.now();
  fibonacci(arr);
  const time = Date.now() - start;
  parentPort.postMessage({ threadId, time });
});
