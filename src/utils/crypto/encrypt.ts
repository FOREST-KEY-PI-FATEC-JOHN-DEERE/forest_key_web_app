import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return encrypted.toString("base64");
}