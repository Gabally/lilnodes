import { join } from "path";
import { isDocker } from "../isInDocker";
import { NodeResponse, WebRequestContext } from "../types";
import { tmpdir } from "os";
import { makeid } from "../utils";
import { mkdirSync, writeFileSync } from "fs";
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
        let oldNodePath = process.env.NODE_PATH;
        try {
            let tempDir = join(tmpdir(), makeid(10));
            console.log(tempDir);
            mkdirSync(tempDir);
            writeFileSync(join(tempDir, "package.json"), pkg);
            await installPackages(tempDir);
            process.env.NODE_PATH = tempDir;
            const vm = new NodeVM({
                require: {
                    external: true
                },
                console: "off",
                wasm: false,
                eval: false
            });
            let sandBoxedFunction = vm.run(code);
            process.env.NODE_PATH = oldNodePath;
            return sandBoxedFunction(context);   
        } catch (err) {
            process.env.NODE_PATH = oldNodePath;
            return {
                hasError: true,
                error: <string>err || "Unknown error"
            }
        }
    }
};