import { runInSandBox } from "./sandbox";
import { installPackages } from "./npm-zombie";
import { tmpdir } from "os";

export const writeObject = (obj: any): void => {
    try {
        let str = JSON.stringify(obj);
        process.stdout.write(str);
    } catch(err) {
        throw new Error("An error occurred while serializing the object");
    }
};

(async () => {
    try {
        const [code, pkg, context] = process.argv.splice(2);
        let ctx = JSON.parse(context);
        ctx.body = Buffer.from(ctx.body, "base64");
        let packageJson = JSON.parse(pkg);
        let tempDir = tmpdir();
        try {await installPackages(pkg, tempDir); } catch(e) {}
        let result = await runInSandBox(code,  Object.keys(packageJson["dependencies"] || {}), ctx, tempDir);
        writeObject({ type: "success", content: result });
    } catch(e: any) {
        writeObject({ type: "error", content: e.message, stack: e.stack });
    }
})();
