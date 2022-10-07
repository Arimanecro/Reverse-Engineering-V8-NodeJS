import net from "net";
import https from "https";

//net.createServer(stream => stream.pipe(stream)).listen(5000);

net
  .createServer((stream) => {
    console.log("ECHO-server:client connected");
    stream.on("data", (chunk) => {
      https
        .get(
          {
            host: `www.${chunk.toString("utf8").trim()}`,
            headers: {
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
            },
          },
          (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => stream.write(body));
          }
        )
        .on("error", (e) => console.log("Got error: " + e.message));
    });
  })
  .listen(5000, () => {
    console.log("ECHO-server started");
  });
