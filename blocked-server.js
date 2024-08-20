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

// another example
{
setInterval(() => console.log(7777), 100);
process.nextTick(() => console.log("FIRST NEXT-TICK"));

function unBlockFunc() {
  for (let index = 0; index < 100; index++) {
    setImmediate(() => {
      if (index === 25 || index === 50 || index === 90) {
        process.nextTick(() => console.log(`NEXT TICK: ${index}`));
      }
      console.log(index);
    });
  }
}
function blockFunc() {
  for (let index = 0; index < 100; index++) {
    if (index === 25 || index === 50 || index === 90) {
      process.nextTick(() => console.log(`NEXT TICK: ${index}`));
    }
    Promise.resolve(index).then(i => console.log(i));
  }
}

/*
All promises: 0...100
FIRST NEXT-TICK
NEXT TICK: 25
NEXT TICK: 50
NEXT TICK: 90
7777...
*/
blockFunc();

/*
FIRST NEXT-TICK
setImmediate 1...25
NEXT TICK: 25
setImmediate 26...50
NEXT TICK: 50
setImmediate 50...90
NEXT TICK: 90
setImmediate 50...99
7777...
*/
unBlockFunc()

}
