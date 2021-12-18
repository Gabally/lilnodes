import { NodeVM } from "vm2";
import { WebRequestContext, NodeResponse } from "./types";

export const runInSandBox = async (code: string, dependencies: string[], context: WebRequestContext): Promise<NodeResponse> => {
    return new Promise((resolve, reject) => {
        try {
            const vm = new NodeVM({
                require: {
                    external: true
                },
                console: "off",
                wasm: false,
                eval: false
            });
            //"module.exports = function(who, callback) { callback(who); }");
            let sandBoxedFunction = vm.run(code);
            sandBoxedFunction(context, (response: NodeResponse) => {
                resolve(response);
            });
        } catch (err) {
            reject(err);
        }
    });
};