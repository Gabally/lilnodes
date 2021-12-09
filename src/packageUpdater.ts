import axios from "axios";
import { version } from "os";
import { Package } from "./types";

export const addDependency = async (packageName: string, packageFile: string): Promise<string> => {  
    const { name, version } = parsePackageName(packageName);
    let packageJson = JSON.parse(packageFile);
    if (!packageJson["dependencies"]) {
        packageJson["dependencies"] = {};
    }
    try {
        let response = await axios.get(`https://registry.npmjs.com/${name}`);
        if (response.status === 200) {
            if (version) {
                if (version in Object.keys(response.data["versions"])) {
                    packageJson["dependencies"][name] = `^${version}`;
                } else {
                    throw "Package version does not exist";
                }
            } else {
                packageJson["dependencies"][name] = `^${response.data["dist-tags"]["latest"]}`;
            }
            return JSON.stringify(packageJson, null, 4);
        } else {
            throw "Error";
        }
    } catch(err) {
        throw "An error occurred while installing the package";
    }
};

const parsePackageName = (packageName: string): Package => {
    const includesVersion = packageName.startsWith("@") ? packageName.substring(1).includes("@") : packageName.includes("@");
    if (includesVersion){
        if (packageName.startsWith("@")) {
            return {
                name: packageName.split("@").slice(0, -1).join("@"),
                version: packageName.split("@").pop()
            }; 
        } else {
            return {
                name: packageName.split("@")[0],
                version: packageName.split("@")[1]
            };
        }
    } else {
        return {
            name: packageName,
            version: undefined
        }
    }
};

export const removeDependency = (packageFile: string, packageName: string): string => {
    let packageJson = JSON.parse(packageFile);
    if (packageJson["dependencies"]) {
        delete packageJson["dependencies"][packageName];
    }
    return JSON.stringify(packageJson);
}