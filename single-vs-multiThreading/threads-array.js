import { Worker, isMainThread } from "worker_threads";

const numCPUs = 4;
let complete = 0;
let arr = [40, 41, 42, 43];

const fibonacci = (num) => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

// SINGLE THREAD

const start = Date.now();

arr.map((v, k) => {
  ++k;
  fibonacci(v);
  console.log(`Iteration #${k} time : ${Date.now() - start}`);
});

console.log(`SINGLE THREAD time: ', ${Date.now() - start}`);
console.log("=====================");

// MULTITHREADING

if (isMainThread) {
  for (let i = 0; numCPUs > i; i++) {
    const worker = new Worker("./worker.js");

    worker.postMessage({ arr: arr[i] });

    worker.once("message", ({ threadId, time }) => {
      ++complete;
      console.log(`Thread #${threadId} completed the task for ${time}`);
      if (complete === numCPUs) {
        console.log(`MULTITHREADING time: ${time}`);
        process.exit(0);
      }
    });
  }
}
