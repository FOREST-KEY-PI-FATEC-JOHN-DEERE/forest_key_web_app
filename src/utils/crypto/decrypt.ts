import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function decrypt(encrypted: string) {
  const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
  const encryptedBuffer = Buffer.from(encrypted, "base64");
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString("utf8");

}