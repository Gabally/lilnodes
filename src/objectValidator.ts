export const DATA_TYPES = {
    STRING: "string",
    NUMBER: "number",
    BOOLEAN: "boolean",
    VALID_JSON: "json"
};

export class ArrayType {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

export const validateObject = (model: any, data: any): string | undefined => {
    let keys = Object.keys(model);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (model[k] instanceof ArrayType && data[k]) {
            try {
                for (let i = 0; i < data[k].length; i++) {
                    if (typeof(data[k][i]) !== model[k].type) {
                        return `${k} is not a valid array of ${model[k].type}`;
                    }
                }
            } catch(err) {
                return `${k} is not a valid array of ${model[k].type}`;
            }
        } else if (model[k] === DATA_TYPES.VALID_JSON) {
            try {
                JSON.parse(data[k]);
            } catch(e) {
                return `${k} is not a valid JSON string`;
            }
        } else if (!(data[k] && typeof(data[k]) === model[k])) {
            return `${k} is not a valid ${model[k]}`;
        }
    }
    return undefined;
};