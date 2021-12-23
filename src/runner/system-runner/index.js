import path from "path";
import { tmpdir } from "os";
import { makeid } from "../../utils";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { NodeVM } from "vm2";
import { installPackages } from "./npm-install";

export const RunInSystemSandBox = async () => {
    let [context, code, pkg] = process.argv.splice(2);
    let tempDir = path.join(tmpdir(), makeid(10));
    console.log(tempDir);
    mkdirSync(tempDir);
    writeFileSync(path.join(tempDir, "package.json"), pkg);
    await installPackages(tempDir);
    const vm = new NodeVM({
        require: {
            external: Object.keys(JSON.parse(pkg)["dependencies"]),
            resolve: (moduleName) => {
                let modPath = path.resolve(tempDir, "node_modules", moduleName);
                if (modPath.startsWith(tempDir)) {
                    return modPath;
                } else {
                    return "";
                }
            }
        },
        console: "off",
        wasm: false,
        eval: false
    });
    let sandBoxedFunction = vm.run(code, tempDir);
    let result = await new Promise((resolve) => {
        sandBoxedFunction(context, resolve);
    });
    try { rmSync(tempDir, { recursive: true }); } catch (e) { console.error(e) };
    console.log(result);
};