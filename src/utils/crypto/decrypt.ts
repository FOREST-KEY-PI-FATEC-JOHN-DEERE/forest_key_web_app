import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export function decrypt(encrypted: string, ivHex: string, tagHex: string) {
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
