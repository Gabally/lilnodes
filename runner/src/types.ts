export interface WebRequestContext {
    query: Record<string, string>,
    method: string,
    headers: Record<string, string>,
    body: String | Buffer,
    path: string
}

export interface HttpResponse {
    statusCode: number,
    headers: Record<string,string>,
    body: string | Buffer
}