export const asyncEvery = async (array: any[], cb: (el: any) => Promise<boolean>) => {
    for (let i = 0; i < array.length; i++) {
        if (!await cb(array[i])) {
            return false;
        }
    }
    return true;
};

export const makeid = (length: number): string => {
    var result           = "";
    var characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}