import { existsSync, fstat, mkdirSync, readFileSync, writeFileSync } from "fs";
import { default as readline } from "readline";
import { readObject, writeObject } from "./io";
import { installPackage } from "./npm-zombie";
import { tmpdir } from "os";
import path from "path";

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    try {
        const { packageFile, packageName } = await readObject(reader);
        let temp = path.join(tmpdir(), "pkgUpdater");
        if (!existsSync(temp)) {
            mkdirSync(temp);
        }
        writeFileSync(path.join(temp, "package.json"), packageFile);
        await installPackage(packageName, temp);
        writeObject({ type: "success", content: readFileSync(path.join(temp, "package.json"), "utf-8") });
        reader.close();
    } catch(e: any) {
        writeObject({ type: "error", content: e.message });
        reader.close();
    }
})();
