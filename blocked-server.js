import http from "node:http";

http
  .createServer((req, res) => {
    nonBlockFunc3();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
  })
  .listen(8000);

http.get('http://localhost:8000/', res => console.log(res.statusCode));

// Blocking recursion
var blockFunc = () => Promise.resolve().then(blockFunc);
var blockFunc2 = () => process.nextTick(blockFunc2);
var blockFunc3 = () => queueMicrotask(blockFunc3)
// Non-blocking recursion 
var nonBlockFunc = () => setImmediate(nonBlockFunc);
var nonBlockFunc2 = () => setTimeout(nonBlockFunc2);
var nonBlockFunc3 = () => setInterval(nonBlockFunc3, 100);