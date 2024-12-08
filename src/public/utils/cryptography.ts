import * as crypto from "crypto";

export default class Security {
  encoding: BufferEncoding = "hex";

  // Allow environment variable or a fixed key for flexibility
  private readonly key: Buffer;

  constructor() {
    let key = process.env.CRYPTO_KEY ?? "";
    this.key = Buffer.from(key, "hex");
    if (this.key.length !== 32) {
      throw new Error("Invalid key length: Must be 32 bytes for AES-256");
    }
  }

  encrypt(plaintext: string): string {
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv("aes-256-cbc", this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf-8"),
      cipher.final(),
    ]);

    return Buffer.concat([encrypted]).toString(this.encoding); // Combine IV and encrypted data
  }

  decrypt(ciphertext: string): string {
    const data = Buffer.from(ciphertext, this.encoding);
    const iv = Buffer.alloc(16, 0);
    // const encryptedText = data.subarray(16); // Extract the actual encrypted data

    const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf-8");
  }

  hash(message: string): string {
    const hash = crypto
      .createHash("sha256")
      .update(message, "utf8")
      .digest("hex");
    return hash;
  }
}
