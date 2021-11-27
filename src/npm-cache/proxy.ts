import { fsCache } from "./fscache";
import { createServer, Server } from "https";
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";
import request from "request";
import { proxyOptions, proxyResponseParams } from "./types";
import { Stats } from "fs";

export class NpmCachingProxy {
  
  options: proxyOptions;
  cache: fsCache;
  mitm: Server;
  cycleCheckHeader: string;

  constructor(options: proxyOptions) {
    this.options = options;
    this.cache = new fsCache();
    this.mitm = createServer({}, this.httpHandler);
    this.cycleCheckHeader = `x-npm-proxy-cache-${Math.round(Math.random() * 10000)}`;
  }

  start() {
    const server = this.mitm.listen(this.options.port, this.options.host, () => {
      console.log(`Caching-Proxy listening on ${this.options.host}:${this.options.port}`);
    });
    server.addListener("connect", this.httpHandler);
  }

  private httpHandler(req: IncomingMessage, res: ServerResponse) {
    console.log("HTPP Handler");
    let path = new URL(req.url || "").pathname;
    let dest = `http://${req.headers["host"]}${path}`;

    if (req.headers[this.cycleCheckHeader]) {
      res.writeHead(502);
      res.end("Sending requests to myself. Stopping to prevent cycles.");
      return;
    }
    const params: proxyResponseParams = {
      headers: {},
      rejectUnauthorized: false,
      url: dest
    };

    params.headers[this.cycleCheckHeader] = 1;

    const carryHeaders = ["authorization", "version", "referer", "npm-session", "user-agent"];
    carryHeaders.forEach((name) => {
      params.headers[name] = req.headers[name];
    });

    if (req.method !== "GET" || req.headers["accept"] === "application/json") {
      return this.httpBypass(req, res, params);
    }

    
    let meta = this.cache.meta(dest);

    if (meta) {
      return this.respondWithCache(dest, meta, res);
    } else {
      const r = request(params);
      const onResponse = (err: Error, response: request.Response) => {
        // don't save responses with codes other than 200
        if (!err && response.statusCode === 200) {
          r.pipe(this.cache.set(dest));
          let meta = this.cache.meta(dest);
          if (meta) {
            return this.respondWithCache(dest, meta, res);
          } else {
            return this.httpBypass(req, res, params);
          }
        } else {  
          res.end(err ? err.toString() : 'Status ' + response.statusCode + ' returned');
        }
      };
      r.on("response", onResponse);
      r.on("error", onResponse.bind(null));
    }
  }

  httpBypass(req: IncomingMessage, res: ServerResponse, params: proxyResponseParams) {
    const length = parseInt(req.headers["content-length"] || "NO");

    const onEnd = (params: proxyResponseParams, res: ServerResponse) => {
      return request(params)
        .on("error", (err: Error) => {
          console.error(err);
        })
        .pipe(res, { end: false });
    };
  
    if (!isFinite(length)) {
      onEnd(params, res);
      return;
    }
  
    const raw = Buffer.alloc(length);
    let pointer = 0;
  
    req.on("data", (chunk) => {
      chunk.copy(raw, pointer);
      pointer += chunk.length;
    });
  
    req.on("end", () => {
      params.method = req.method;
      if (raw.length > 0) {
        params.body = raw;
      }
      params.headers = {
        "Content-Type": req.headers["content-type"]
      };
      onEnd(params, res);
    });
  }

  private respondWithCache(dest: string, meta: Stats, res: ServerResponse) {
    res.setHeader("Content-Length", meta.size);
    //res.setHeader("Content-Type", meta.type);
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Cache-Hit", "true");
    let rs = this.cache.get(dest);
    if (rs) {
      rs.pipe(res);
    }
  }
}
//npm --without-ssl --insecure --proxy http://127.0.0.1:8080 install express