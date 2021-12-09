export interface CreateNodeRequest {
    code: string,
    dependencies: string[]
}

export interface Package {
    name: string,
    version: undefined | string
};