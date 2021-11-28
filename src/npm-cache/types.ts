import { Stats } from "fs";

export interface proxyOptions {
    host: string;
    port: number;
}

export interface proxyResponseParams {
    headers: Record<string, any>;
    url: string;
    body?: string | Buffer;
    method?: string;
}

export interface fileMetaData extends Stats {
    type: string
}