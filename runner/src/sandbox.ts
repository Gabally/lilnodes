import { NodeVM } from "vm2";
import { HttpResponse, WebRequestContext } from "./types";

export const runInSandBox = async (code: string, dependencies: string[], context: WebRequestContext): Promise<HttpResponse> => {
    return new Promise((resolve, reject) => {
        try {
            const vm = new NodeVM({
                require: {
                    external: false
                },
                console: "off",
                wasm: false,
                eval: false
            });
            //"module.exports = function(who, callback) { callback(who); }");
            let sandBoxedFunction = vm.run(code);
            sandBoxedFunction(context, (response: HttpResponse) => {
                resolve(response);
            });
        } catch (err) {
            reject(err);
        }
    });
};