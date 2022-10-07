import { Worker, isMainThread } from "worker_threads";
const numCPUs = 2;
const listOfWorkers = ["./worker-1.js", "./worker-2.js"];
const threads = new Map();

if (isMainThread) {
  for (let i = 0; numCPUs > i; i++) {
    const { port1, port2 } = new MessageChannel();
    const worker = new Worker(listOfWorkers[i], {
      workerData: { port1 },
      transferList: [port1],
    });
    threads.set(worker.threadId, worker);
    port2.on("message", ({ from, to, msg }) => {
      threads.get(to).postMessage({ from, to, msg });
      //if (from === 2) process.exit(0);
    });
    worker.on("error", (e) => console.error(e));
    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  }

  setTimeout(() => {
    process.exit(0);
  }, 2000);
}
