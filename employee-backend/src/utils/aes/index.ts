import crypto from "crypto";
import { env } from "../../env";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // 1-16

/* ================================
   Helpers
================================ */

const deriveKey = (): Buffer => {
  // Always 32 bytes (AES-256)
  const secret = env.AES_KEY;
  return crypto.createHash("sha256").update(secret).digest();
};

const toStringSafe = (data: unknown): string =>
  typeof data === "string" ? data : JSON.stringify(data);

/* ================================
   AES Utility
================================ */

export const AES = {
  /* ========= Encrypt ========= */
  encrypt(data: unknown): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const secretKey = deriveKey();

    const cipher = crypto.createCipheriv(ALGO, secretKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(toStringSafe(data), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // iv:tag:ciphertext
    return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString(
      "base64",
    )}`;
  },

  /* ========= Decrypt ========= */
  decrypt<T = string>(payload: string): T {
    const [ivB64, tagB64, cipherB64] = payload.split(":");

    if (!ivB64 || !tagB64 || !cipherB64) {
      throw new Error("Invalid encrypted payload");
    }

    const secretKey = deriveKey();

    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const ciphertext = Buffer.from(cipherB64, "base64");

    const decipher = crypto.createDecipheriv(ALGO, secretKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");

    // auto JSON parse
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted as T;
    }
  },
};
