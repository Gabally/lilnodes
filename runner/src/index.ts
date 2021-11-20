import { default as readline } from "readline";
import { readObject, writeObject } from "./io";

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const code = await readObject(reader);
    writeObject(code);
    reader.close();
})();
