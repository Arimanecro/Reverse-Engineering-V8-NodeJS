import { Worker, isMainThread } from "worker_threads";
const numCPUs = 3;

if (isMainThread) {
  const buffer = new SharedArrayBuffer(16);
  const array = new Int32Array(buffer);

  for (let i = 0; numCPUs > i; i++) {
    const { port1, port2 } = new MessageChannel();
    const worker = new Worker("./worker.js", {
      workerData: { port1, array, number: `3${i}` },
      transferList: [port1],
    });
    if (worker.threadId === 1) {
      port2.on("message", (msg) => {
        if (msg === "done") {
          console.log(array);
          process.exit(0);
        }
      });
    }
    worker.on("error", (e) => console.error(e));
    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  }
}
