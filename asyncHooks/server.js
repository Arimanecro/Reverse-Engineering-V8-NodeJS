import http from "http";
import { asyncLocalStorage } from "./async-storage.js";
import { request } from "./request.js";

http
  .createServer((req, res) => {
    asyncLocalStorage.run({ url: req.url }, () => {
      request();
    });
  })
  .listen(8080);

http.get("http://localhost:8080");
http.get("http://localhost:8080/test");
