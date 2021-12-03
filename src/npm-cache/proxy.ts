import { fsCache } from "./fscache";
import https from "https";
import { URL } from "url";
import { fileMetaData, proxyOptions, proxyResponseParams } from "./types";
import internal from "stream";
import http, { IncomingMessage } from "http";
import { Socket } from "net";
import { createWriteStream, readFileSync } from "fs";
import path from "path";
import axios from "axios";

export class NpmCachingProxy {

  options: proxyOptions;
  cache: fsCache;
  mitm: https.Server;
  cycleCheckHeader: string;
  mitmPort: number;

  constructor(options: proxyOptions) {
    this.options = options;
    this.cache = new fsCache();
    this.mitmPort = options.port + 1;
    this.mitm = https.createServer({
      key: readFileSync(path.join(__dirname, "/certs/dummy.key"), "utf8"),
      cert: readFileSync(path.join(__dirname, "/certs/dummy.crt"), "utf8")
    }, (req: http.IncomingMessage, res: http.ServerResponse) => { this.httpHandler(req,res,this.cache,true) });
    this.cycleCheckHeader = `x-npm-proxy-cache-${Math.round(Math.random() * 10000)}`;
  }

  start() {
    this.mitm.listen(this.mitmPort);
    const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => { this.httpHandler(req,res,this.cache) }).listen(this.options.port, this.options.host, () => {
      console.log(`Caching-Proxy listening on ${this.options.host}:${this.options.port}`);
    });
    server.addListener("connect", (req: http.IncomingMessage, s: internal.Duplex, b: Buffer) => { this.httpsHandler(req, s, b, this.mitmPort); });
  }

  async httpHandler(req: http.IncomingMessage, res: http.ServerResponse, cache: fsCache, isHttps: boolean = false) {
    let schema = isHttps ? "https" : "http";
    const { pathname } = new URL(req.url || "", `https://${req.headers["host"]}`);
    let destination =  `${schema}://${req.headers["host"]}${pathname}`;
    if (req.headers[this.cycleCheckHeader]) {
      res.writeHead(502);
      res.end("cycle");
    } else if (req.method !== "GET") {
      this.proxyBypass(req, res, destination);
    } else {
      let meta = cache.meta(destination);
      if (meta) {
        this.respondWithCache(res, meta, cache, destination);
      } else {
        let response = await axios({
          method: req.method,
          url: destination,
          responseType: "stream",
          headers: this.convertHeaders(req)
        });
        if (response.status === 200) {
          cache.set(destination, response.data);
        }
        res.writeHead(response.status, response.headers);
        response.data.pipe(res);
      }
    }
  }

  httpsHandler(req: http.IncomingMessage, socketReq: internal.Duplex, bodyHead: Buffer, mitmPort: number) {
    let httpVersion = req["httpVersion"];
    const proxySocket = new Socket();
    proxySocket.connect(mitmPort, "127.0.0.1", () => {
      proxySocket.write(bodyHead);
      socketReq.write(`HTTP/${httpVersion} 200 Connection established\r\n\r\n`);
    });

    proxySocket.on("data", (chunk) => {
      socketReq.write(chunk);
    });
  
    proxySocket.on("end", () => {
      socketReq.end();
    });

    socketReq.on("data", (chunk) => {
      proxySocket.write(chunk);
    });
  
    socketReq.on("end", () => {
      proxySocket.end();
    });

    proxySocket.on("error", (err) => {
      socketReq.write(`HTTP/${httpVersion} 500 Connection error\r\n\r\n`);
      socketReq.end();
    });
  
    socketReq.on("error", (err) => {
      proxySocket.end();
    });
  }

  async proxyBypass(req: http.IncomingMessage, res: http.ServerResponse, url: string) {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    let response = await axios({
      method: <any>req.method,
      url: url,
      responseType: "stream",
      headers: this.convertHeaders(req),
      data: Buffer.concat(buffers)
    });
    
    res.writeHead(response.status, response.headers);
    response.data.pipe(res);
  }

  respondWithCache(res: http.ServerResponse, meta: fileMetaData, cache: fsCache, url: string) {
    res.setHeader("Content-Length", meta.size);
    res.setHeader("Content-Type", meta.type);
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Cache-Hit", "true");
    cache.get(url, res);
  }

  convertHeaders(req: IncomingMessage) {
    let headers: Record<string, string>= {};
    Object.keys(req.headers).forEach(h => {
      if (h !== "if-none-match" && h !== "if-modified-since")
      headers[h] = <string>req.headers[h]
    });
    return headers;
  }
}
//npm --without-ssl --insecure --proxy http://127.0.0.1:8080 install express

//npm --proxy http://localhost:7000 --https-proxy http://localhost:7000 --strict-ssl false install express

//npm --proxy http://localhost:7000 --https-proxy http://localhost:7000 --strict-ssl false install cowsay