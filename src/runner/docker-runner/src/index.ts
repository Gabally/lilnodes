import { default as readline } from "readline";
import { readObject, writeObject } from "./io";
import { runInSandBox } from "./sandbox";
import { installPackages } from "./npm-zombie";

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    try {
        const { code, pkg, context } = await readObject(reader);
        let packageJson = JSON.parse(pkg);
        await installPackages(pkg);
        let result = await runInSandBox(code,  Object.keys(packageJson["dependencies"]), context);
        writeObject({ type: "success", content: result });
        reader.close();
    } catch(e: any) {
        writeObject({ type: "error", content: e.message });
        reader.close();
    }
})();
