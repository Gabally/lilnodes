import express from "express";
import { checkForKey, decryptCode, encryptCode } from "./encryption";
import { NpmCachingProxy } from "./npm-cache/proxy";
import { ArrayType, DATA_TYPES, validateObject } from "./objectValidator";
import { addDependency } from "./packageUpdater";
import { CreateNodeRequest } from "./types";
import { isDocker } from "./isInDocker";
import { runSandBoxed } from "./runner";
import { prebuildRunnerImage } from "./runner/builder";
import path from "path";
import { readFileSync } from "fs";
import { getRequestRawBody } from "./utils";
import { minify, MinifyOutput } from "terser";
import { readFile } from "fs/promises";

const app = express();
const port = 8000;

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "2mb" }));

app.set("view engine", "pug");

app.post("/npminstall", async (req, res) => {
    try {
        let { packageName, packageFile } = req.body;
        let newPackage = await addDependency(packageName, packageFile);
        res.status(200).json({ success: true, packageFile: newPackage });
    } catch(err) {
        res.status(500).json({ success: false, error: err });
    }
});

app.post("/createnode", async (req, res) => {
    let data = <CreateNodeRequest>req.body;
    try {
        let validationError = validateObject({
            code: DATA_TYPES.STRING,
            package: DATA_TYPES.VALID_JSON
        }, data); 
        if (validationError) {
            res.status(400).json({ success: false, error: validationError });
        } else {
            let compressed: MinifyOutput;
            try {
                compressed = await minify(data.code);
            } catch(e) {
                res.status(400).json({ success: false, error: "An error occurred while creating the node (check your code for syntax errors)" });
                return;
            }
            let payload = {
                c: compressed.code,
                p: JSON.parse(data.package)["dependencies"] || []
            };
            let encrypted = await encryptCode(JSON.stringify(payload));
            res.status(200).json({ success: true, url: encrypted });
        }
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, error: "An internal error occurred while creating the node" });
    }
});

app.all("/run/:code", async (req, res) => {
    try {
        let decrypted = await decryptCode(req.params.code);
        let contents = JSON.parse(decrypted);
        let validationError = validateObject({
            c: DATA_TYPES.STRING,
            p: new ArrayType(DATA_TYPES.STRING)
        }, contents); 
        if (validationError) {
            res.status(400).json({ error: `The submitted code has an invalid format: ${validationError}` });
        } else {
            let packageFile = await readFile(path.join(__dirname, "public", "examples", "package.json"), "utf-8");
            let packageJSON = JSON.parse(packageFile);
            packageJSON["dependencies"] = contents.p;
            let result = await runSandBoxed({
                query: <Record<string,string>>req.query,
                method: req.method,
                headers: <Record<string,string>>req.headers,
                body: await getRequestRawBody(req),
                path: req.path
            }, contents.c, JSON.stringify(packageJSON));
            if (result.hasError) {
                res.status(500).json({
                    error: result.error
                });
            } else {
                for (const h in result.headers) {
                    res.setHeader(h, result.headers[h]);
                }
                res.status(result.statusCode || 200).send(result.content);
            }
        }
    } catch(e) {
        res.status(500).json({ success: false, error: e });
    } 
});

app.get("/", (req, res) => {
    res.render("index");
});

app.all("/test", async (req, res) => {
    let [code, pkg] =  JSON.parse(<string>req.query.node);
    let result = await runSandBoxed({
        query: <Record<string,string>>req.query,
        method: req.method,
        headers: <Record<string,string>>req.headers,
        body: await getRequestRawBody(req),
        path: req.path
    }, code, pkg);
    if (result.hasError) {
        res.status(500).json({
            error: result.error
        });
    } else {
        for (const h in result.headers) {
            res.setHeader(h, result.headers[h]);
        }
        res.status(result.statusCode || 200).send(result.content);
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/documentation", (req, res) => {
    res.render("docs");
});

//docker run --privileged -d --name dind-test docker:dind
//docker run --add-host=host.docker.internal:host-gateway -it alpine
(async () => {
    if (!isDocker()) {
    console.log(`
    \x1b[31m
    ******************
    ***** WARNING ****
    ******************
    The app is not running under docker, unsafe code will be executed using only the VM2 module
    \x1b[0m`);
    } else {
        await prebuildRunnerImage();
    }
    checkForKey();
    let proxo = new NpmCachingProxy({ host: "127.0.0.1", port: 16978 });
    proxo.start();
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
})();