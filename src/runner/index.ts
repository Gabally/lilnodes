import path from "path";
import { isDocker } from "../isInDocker";
import { NodeResponse, WebRequestContext } from "../types";
import { tmpdir } from "os";
import { makeid } from "../utils";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { installPackages } from "./npm-install";
import { NodeVM } from "vm2";

export const runSandBoxed = async (context: WebRequestContext, code: string, pkg: string): Promise<NodeResponse>  => {
    if (isDocker()) {
        return {
            statusCode: 500,
            hasError: true,
            error: "Docker still not implemented"
        };
    } else {
        try {
            let tempDir = path.join(tmpdir(), makeid(10));
            console.log(tempDir);
            mkdirSync(tempDir);
            writeFileSync(path.join(tempDir, "package.json"), pkg);
            await installPackages(tempDir);
            const vm = new NodeVM({
                require: {
                    external: Object.keys(JSON.parse(pkg)["dependencies"]),
                    resolve: (moduleName: string) => {
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
            try {rmSync(tempDir, { recursive: true });}catch(e){console.error(e)};
            return <NodeResponse>result;
        } catch (err) {
            return {
                hasError: true,
                error: <string>err || "Unknown error"
            }
        }
    }
};