import childProcess from "node:child_process";

let scripts = ["echo-server.js", "vpn-server.js", "vpn-client.js"];
scripts.forEach((script) => childProcess.fork(script));

// type in the console, e.g. foxnews.com (without https://www)
