export const asyncEvery = async (array: any[], cb: (el: any) => Promise<boolean>) => {
    for (let i = 0; i < array.length; i++) {
        if (!await cb(array[i])) {
            return false;
        }
    }
    return true;
};