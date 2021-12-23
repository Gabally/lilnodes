import { fork } from "child_process";
import path from "path";
import { isDocker } from "../isInDocker";
import { NodeResponse, WebRequestContext } from "../types";

export const runSandBoxed = async (context: WebRequestContext, code: string, pkg: string): Promise<NodeResponse>  => {
    if (isDocker()) {
        return {
            statusCode: 500,
            hasError: true,
            error: "Docker still not implemented"
        };
    } else {
        try {
            return await new Promise((resolve, reject) => {
                const child = fork(path.join(__dirname, "system-runner"));
                let timeout = setTimeout(() => {
                    child.kill("SIGKILL");
                    reject("Execution timed out, exceeded 10 seconds");
                }, 10000);
                child.on("message", (message: string): void => {
                    clearTimeout(timeout);
                    resolve(JSON.parse(message));
                });
                child.send(JSON.stringify({
                    type: "EXEC",
                    context: context,
                    code: code,
                    pkg: pkg
                }));
            });
        } catch (err) {
            return {
                hasError: true,
                error: <string>err || "Unknown error"
            }
        }
    }
};