import { ReadStream, createReadStream, createWriteStream, readdirSync, existsSync, mkdirSync, WriteStream, lstatSync, Stats } from "fs";
import path from "path";

export class fsCache {
    cacheDir: string;
    cacheMap: Record<string,boolean>;

    constructor() {
        this.cacheDir = path.join(__dirname, "cache-files");
        this.cacheMap = {};
        this.checkDir();
        let files = readdirSync(this.cacheDir);
        files.forEach(file => {
            this.cacheMap[file] = true;
        });
    }

    checkDir() {
        if (!existsSync(this.cacheDir)) {
            mkdirSync(this.cacheDir);
        }
    }

    toBase64(str: string) {
        let buf = Buffer.from(str);
        return buf.toString("base64");
    }

    fromBase64(b64: string) {
        let buf = Buffer.from(b64, "ascii");
        return buf.toString("utf-8");
    }

    get(key: string, ws: any) {
        let rawKey = this.toBase64(key);
        let fullpath = path.join(this.cacheDir, rawKey);
        if (this.cacheMap[rawKey] && existsSync(fullpath)) {
            createReadStream(fullpath).pipe(ws);
        } else {
            delete this.cacheMap[rawKey];
        }
    }

    set(key: string, rs: ReadStream): Promise<void> {
        return new Promise((resolve) => {
            this.checkDir();
            let rawKey = this.toBase64(key);
            this.cacheMap[rawKey] = true;
            rs.pipe(createWriteStream(path.join(this.cacheDir, rawKey)));
            rs.on("end", () => resolve());
        });
    }

    meta(key: string) {
        let rawKey = this.toBase64(key);
        let fullpath = path.join(this.cacheDir, rawKey);
        if (this.cacheMap[rawKey] && existsSync(fullpath)) {
            return { ...lstatSync(fullpath), type: "application/octet-stream" };
        } else {
            delete this.cacheMap[rawKey];
            return null;
        }
    }
}