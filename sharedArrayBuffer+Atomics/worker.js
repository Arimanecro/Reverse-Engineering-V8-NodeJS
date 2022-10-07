import { threadId, workerData } from "worker_threads";

const { port1, number, array } = workerData;

const fibonacci = (num) => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

if(threadId === 3) {
  const n = fibonacci(number);
  Atomics.store(array, 0, n);
  Atomics.notify(array, 0, 2);
}
else if(threadId === 2) {
  const n = fibonacci(number);
  Atomics.wait(array, 0, 0);
  Atomics.store(array, 1, n);
  Atomics.notify(array, 1);
}
else {
  const n = fibonacci(number);
  Atomics.wait(array, 1, 0);
  Atomics.store(array, 2, n);
  port1.postMessage("done");
}