import { spawn } from "child_process";

const installPackage = async (pkg: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = spawn("npm", ["--proxy", "http://host.docker.internal:16978", "--https-proxy", "http://host.docker.internal:16978", "--strict-ssl", "false", "install", pkg]);
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

export const installPackages = async (packages: string[]): Promise<void> => {
    try {
        for (let i = 0; i < packages.length; i++) {
            await installPackage(packages[i]);
        }
    } catch (err) {
        throw err
    }
};