import { threadId, parentPort, workerData } from "worker_threads";
import vm from "vm";

const { port1 } = workerData;

parentPort.on("message", ({ from, to, msg }) => {
  console.log(`Message from worker ${from} to worker ${to}`);
  const func = new TextDecoder().decode(msg);
  const script = new vm.Script(func);
  port1.postMessage({
    from: threadId,
    to: from,
    msg: script.runInThisContext(),
  });
});
