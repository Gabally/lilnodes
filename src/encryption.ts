import crypto from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
const lzma = require("lzma-native");

const IV_LENGTH = 16;

const getKeyPath = (): string => {
    return path.join(__dirname, "key");
};

export const checkForKey = () => {
    let keyPath = getKeyPath();
    if (!existsSync(keyPath)) {
        writeFileSync(keyPath, crypto.randomBytes(32));
    }
};

const retreiveKey = (): Buffer => {
    let keyPath = getKeyPath();
    if (existsSync(keyPath)) {
        return readFileSync(keyPath);
    } else {
        throw new Error("No encryption key found");
    }
};

export const encryptCode = async (data: string): Promise<string> => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-ctr", retreiveKey(), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    let compressed = await lzma.compress(`${iv.toString("hex")}:${encrypted.toString("hex")}`);
    return  compressed.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

export const decryptCode = async (data: string): Promise<string> => {
    let b64 = data.replace(/\-/g, "+").replace(/_/g, "/");
    let decompressed = await lzma.decompress(Buffer.from(b64, "base64"));
    let text = decompressed.toString();
    let textParts: string[] = text.split(":");
    let iv = Buffer.from(<any>textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv("aes-256-ctr", retreiveKey(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};