import crypto from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

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

export const encryptCode = (data: string): string => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-ctr", retreiveKey(), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptCode = (data: string): string => {
    let textParts: string[] = data.split(":");
    let iv = Buffer.from(<any>textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv("aes-256-ctr", retreiveKey(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};