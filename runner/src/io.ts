import { default as readline } from "readline";

export const readObject = (reader: readline.Interface): any => {
    return new Promise((resolve, reject) => {
        reader.question("", (data: string) => {
            try {
                let obj = JSON.parse(data);
                resolve(obj);
            } catch(err) {
                reject(err);
            }
        });
    });
};

export const writeObject = (obj: any): void => {
    try {
        let str = JSON.stringify(obj);
        process.stdout.write(str);
    } catch(err) {
        throw new Error("An error occurred while serializing the object");
    }
};

