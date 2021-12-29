import path from "path";
import { tmpdir } from "os";
import { makeid } from "../utils";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { NodeVM } from "vm2";
import { NodeResponse, WebRequestContext } from "../types";
import { spawn } from "child_process";

export const RunInSystemSandBox = async (context: WebRequestContext, code: string, pkg: string): Promise<NodeResponse> => {
    let tempDir = path.join(tmpdir(), makeid(10));
    mkdirSync(tempDir);
    writeFileSync(path.join(tempDir, "package.json"), pkg);
    await installPackages(tempDir);
    const vm = new NodeVM({
        require: {
            external: Object.keys(JSON.parse(pkg)["dependencies"] || {}),
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
    let result: NodeResponse = await new Promise((resolve) => {
        sandBoxedFunction(context, resolve);
    });
    try { rmSync(tempDir, { recursive: true }); }catch (e){};
    return result;
};

export const installPackages = async (installPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["--proxy", "http://localhost:16978", "--https-proxy", "http://localhost:16978", "--strict-ssl", "false", "install"], {
            cwd: installPath
        });
        child.on("close", (code) => {
            if (code !== 0) {
                reject("An error occurred while installing the packages");
            } else {
                resolve();
            }
        });
        child.on("error", (err) => {
            reject(err);
        });
    });
};

process.on("message", async (message: string): Promise<void> => {
    let command = JSON.parse(message);
    if (command.type == "EXEC" && process.send) {
      command.context.body = Buffer.from(command.context.body, "base64");
      process.send(JSON.stringify(await RunInSystemSandBox(command.context, command.code, command.pkg)));
    }
});