import * as crypto from "crypto";

function splitEncryptedText(encryptedText: string) {
  return {
    ivString: encryptedText.slice(0, 32),
    encryptedDataString: encryptedText.slice(32),
  };
}

export default class Security {
  encoding: BufferEncoding = "hex";

  // process.env.CRYPTO_KEY should be a 32 BYTE key
  secret = process.env.CRYPTO_KEY;
  key = crypto
    .createHash("sha256")
    .update(String(this.secret))
    .digest("base64");

  encrypt(plaintext: string) {
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.key, "base64"),
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf-8"),
      cipher.final(),
    ]);

    return encrypted.toString(this.encoding);
  }

  decrypt(cipherText: string) {
    const { encryptedDataString, ivString } = splitEncryptedText(cipherText);

    const iv = Buffer.from(ivString, this.encoding);
    const encryptedText = Buffer.from(encryptedDataString, this.encoding);

    const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);

    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
  }
}
