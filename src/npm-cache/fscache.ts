import { ReadStream, createReadStream, createWriteStream, readdirSync, existsSync, mkdirSync, WriteStream, lstatSync, Stats } from "fs";
import mime from "mime";
import path from "path";

export class fsCache {
    cacheDir: string;
    cache: Record<string,number>;

    constructor() {
        this.cacheDir = path.join(__dirname, 'cache-files');
        this.cache = {};
        this.checkDir();
        let files = readdirSync(this.cacheDir);
        files.forEach(file => {
            this.cache[file] = 0;
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
        let buf = Buffer.from(b64, 'base64');
        return buf.toString("utf-8");
    }

    get(key: string) {
        let rawKey = this.toBase64(key);
        let fullpath = path.join(this.cacheDir, rawKey);
        if (this.cache[rawKey] && existsSync(fullpath)) {
            return createReadStream(fullpath);
        }
    }

    set(key: string) {
        this.checkDir();
        let rawKey = this.toBase64(key);
        this.cache[rawKey] = 0;
        return createWriteStream(path.join(this.cacheDir, rawKey));
    }

    meta(key: string) {
        let rawKey = this.toBase64(key);
        let fullpath = path.join(this.cacheDir, rawKey);
        if (this.cache[rawKey] && existsSync(fullpath)) {
            return lstatSync(fullpath);
        }
    }
}