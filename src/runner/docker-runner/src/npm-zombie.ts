import { spawn } from "child_process";
import { writeFileSync } from "fs";
import path from "path";

export const installPackages = async (pkg: string, workDir: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        writeFileSync(path.join(workDir, "package.json"), pkg);
        const child = spawn("npm", ["--proxy", "http://host.docker.internal:16978", "--https-proxy", "http://host.docker.internal:16978", "--strict-ssl", "false", "install"], {
            cwd: workDir
        });
        child.on("close", (code) => {
            if (code !== 0) {
                reject(new Error("An error occurred while installing the packages"));
            } else {
                resolve();
            }
        });
        child.on("error", (err): void => {
            reject(err);
        });
    });
};