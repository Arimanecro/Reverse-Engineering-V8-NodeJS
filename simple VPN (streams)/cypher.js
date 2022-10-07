import crypto from "node:crypto";
import { Transform } from "node:stream";

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = Buffer.alloc(16, 0);
//var iv = crypto.randomBytes(16);

const enc = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text.toString()),
    cipher.final(),
  ]);
  return encrypted.toString("hex");
};

const dec = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv.toString("hex"), "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.toString("hex"), "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

const encrypt = new Transform({
  transform: (chunk, encoding, done) => {
    done(null, enc(chunk.toString()));
  },
});
const decrypt = new Transform({
  transform: (chunk, encoding, done) => {
    done(null, dec(chunk.toString()));
  },
});

export { encrypt, decrypt };
