export interface CreateNodeRequest {
    code: string,
    package: string
}

export interface Package {
    name: string,
    version: undefined | string
};