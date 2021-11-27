export interface proxyOptions {
    host: string;
    port: number;
}

export interface proxyResponseParams {
    headers: Record<string, any>;
    rejectUnauthorized: boolean;
    url: string;
    body?: string | Buffer;
    method?: string;
}