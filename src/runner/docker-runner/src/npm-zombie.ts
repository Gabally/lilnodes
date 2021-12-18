import { spawn } from "child_process";
import { writeFileSync } from "fs";

export const installPackages = async (pkg: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        writeFileSync("package.json", pkg);
        const child = spawn("npm", ["--proxy", "http://host.docker.internal:16978", "--https-proxy", "http://host.docker.internal:16978", "--strict-ssl", "false", "install"]);
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