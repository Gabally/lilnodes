import { spawn } from "child_process";

export const installPackage = async (pkg: string, workDir: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = spawn("npm", ["install", pkg],
        {
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