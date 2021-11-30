import { default as readline } from "readline";
import { readObject, writeObject } from "./io";
import { runInSandBox } from "./sandbox";
import { installPackages } from "./npm-zombie";

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const { code, dependencies, context } = await readObject(reader);
    await installPackages(dependencies);
    let result = await runInSandBox(code, dependencies, context);
    writeObject(result);
    reader.close();
})();
