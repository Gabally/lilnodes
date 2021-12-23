import { spawn } from "child_process";

export const installPackages = async (installPath) => {
    return new Promise((resolve, reject) => {
        const child = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["--proxy", "http://localhost:16978", "--https-proxy", "http://localhost:16978", "--strict-ssl", "false", "install"], {
            cwd: installPath
        });
        child.on("close", (code) => {
            if (code !== 0) {
                reject(new Error("An error occurred while installing the packages"));
            } else {
                resolve();
            }
        });
        child.on("error", (err) => {
            reject(err);
        });
    });
};