import path from "path";
import { NodeVM } from "vm2";
import { WebRequestContext, NodeResponse } from "./types";

export const runInSandBox = async (code: string, dependencies: string[], context: WebRequestContext, tempDir: string): Promise<NodeResponse> => {
    const vm = new NodeVM({
        require: {
            external: dependencies,
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
    //"module.exports = function(who, callback) { callback(who); }");
    let sandBoxedFunction = vm.run(code, tempDir);
    return await new Promise((resolve) => {
        sandBoxedFunction(context, resolve);
    });
};