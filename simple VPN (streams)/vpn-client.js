import net from "net";
import {encrypt, decrypt} from "./cypher.js";

const stream = net.connect(5001, "localhost");
console.log("client")
process.stdin.pipe(encrypt).pipe(stream).pipe(decrypt).pipe(process.stdout);