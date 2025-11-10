import aes256 from "aes256";

const AES_SECRET =
  process.env.AES_SECRET || "another-string-secret-at-least-256-bits-long";

export const aesEncrypt = (plainObject: unknown): string =>
  aes256.encrypt(AES_SECRET, JSON.stringify(plainObject));

export const aesDecrypt = (encryptedString: string): unknown =>
  JSON.parse(aes256.decrypt(AES_SECRET, encryptedString));
