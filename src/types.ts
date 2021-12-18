export interface CreateNodeRequest {
    code: string,
    package: string
}

export interface Package {
    name: string,
    version: undefined | string
};

export interface NodeResponse {
    statusCode?: number,
    headers?: Record<string,string>,
    content?: string | Buffer,
    hasError: boolean,
    error?: string
}

export interface WebRequestContext {
    query: Record<string, string>,
    method: string,
    headers: Record<string, string>,
    body: String | Buffer,
    path: string
}