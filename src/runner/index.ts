import { spawn } from "child_process";
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
            const child = spawn("node", ["index.js", ], {
                cwd: path.join(__dirname, "system-runner")
            });
            child.on("close", (code: number) => {
                if (code !== 0) {
                    
                } else {
                    
                }
            });
            child.on("error", (err: any) => {
                
            });
            return {
                statusCode: 500,
                hasError: true,
                error: "Docker still not implemented"
            };
        } catch (err) {
            return {
                hasError: true,
                error: <string>err || "Unknown error"
            }
        }
    }
};