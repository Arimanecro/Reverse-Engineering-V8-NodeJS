import net from "net";
import { pipeline } from "stream";
import { encrypt, decrypt } from "./cypher.js";

const server = net.connect(5000, "localhost");
net
  .createServer((stream) => {
    console.log('VPN-server: client connected');
    pipeline(
      stream,
      decrypt,
      server,
      encrypt,
      stream,
      (err) => err && console.error(err)
    );
  })
  .listen(5001, () => {
    console.log('VPN-server started');
  });
