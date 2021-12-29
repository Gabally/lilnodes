import express from "express";

export const asyncEvery = async (array: any[], cb: (el: any) => Promise<boolean>) => {
    for (let i = 0; i < array.length; i++) {
        if (!await cb(array[i])) {
            return false;
        }
    }
    return true;
};

export const makeid = (length: number): string => {
    let result           = "";
    let characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export const getRequestRawBody =  async (req: express.Request): Promise<Buffer> => {
    return new Promise((resolve) => {
        let chunks: Buffer[] =[];

        req.on("data", (chunk) => {
            chunks.push(chunk);
        });

        req.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
    });
};