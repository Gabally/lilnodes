import { fork } from "child_process";
import path from "path";
import { isDocker } from "../isInDocker";
import { NodeResponse, WebRequestContext } from "../types";
import Docker from "dockerode";
import { RUNNER_IMAGE_NAME } from "./constants";
import streams from "memory-streams";

export const runSandBoxed = async (context: WebRequestContext, code: string, pkg: string): Promise<NodeResponse>  => {
    context.body = context.body.toString("base64");
    if (isDocker()) {
        let docker = new Docker();
        const stdout = new streams.WritableStream();
        const stderr = new streams.WritableStream();
        let [res, container] = await docker.run(RUNNER_IMAGE_NAME, ["node", "build/index.js", code, pkg, JSON.stringify(context)], [stdout, stderr], { Tty: false, HostConfig: { AutoRemove: true, Runtime: "runsc" }});
        let response = JSON.parse(stdout.toString());
        if (response.type == "success") {
            return response.content;
        } else {
            return {
                statusCode: 500,
                hasError: true,
                error: response.content
            };
        }
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
        } catch (err: any) {
            console.log("Err (non docker)");
            console.log(err);
            return {
                hasError: true,
                error: <string>err || "Unknown error"
            }
        }
    }
};