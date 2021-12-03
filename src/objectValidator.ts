export const DATA_TYPES = {
    STRING: "string",
    NUMBER: "number",
    BOOLEAN: "boolean",
};

export class ArrayType {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

export const validateObject = (model: any, data: any): boolean => {
    let keys = Object.keys(model);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (model[k] instanceof ArrayType && data[k]) {
            try {
                for (let i = 0; i < data[k].length; i++) {
                    if (typeof(data[k][i]) !== model[k].type) {
                        return false;
                    }
                }
            } catch(err) {
                return false;
            }
        } else if (!(data[k] && typeof(data[k]) === model[k])) {
            return false;
        }
    }
    return true;
};