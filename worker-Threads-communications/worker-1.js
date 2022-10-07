import { threadId, parentPort, workerData } from "worker_threads";
const { port1 } = workerData;

const syncBlockingCode = () => {
  const sab = new SharedArrayBuffer(4);
  const int32 = new Int32Array(sab);
  Atomics.wait(int32, 0, 0, 1000);
  return "me second";
};

const stringify = (f) => `const f = ${f}; f();`;
const sendSyncFunc = new TextEncoder().encode(stringify(syncBlockingCode));
console.log("me first");
port1.postMessage({ from: threadId, to: 2, msg: sendSyncFunc });
console.log("me third");
parentPort.on("message", ({ from, to, msg }) => {
  console.log(`Message from worker ${from} to worker ${to}: ${msg}`);
});
