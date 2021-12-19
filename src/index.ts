import express from "express";
import { checkForKey, encryptCode } from "./encryption";
import { NpmCachingProxy } from "./npm-cache/proxy";
import { DATA_TYPES, validateObject } from "./objectValidator";
import { addDependency } from "./packageUpdater";
import { CreateNodeRequest } from "./types";
import { isDocker } from "./isInDocker";
import { runSandBoxed } from "./runner";

const app = express();
const port = 8000;

app.use(express.json({ limit: "2mb" }));
app.use((req, res, next) => {
    // @ts-ignore
    req.rawBody = "";
    req.setEncoding("utf8");

    req.on("data", (chunk) => {
        // @ts-ignore
        req.rawBody += chunk;
    });

    req.on("end", next);
});

app.set("view engine", "pug");

app.get("/exec", (req, res) => {
    try {
        eval(req.query.code as string);   
    } catch (error) {
        res.writeHead(500);
        res.end(error);
    }
});

app.post("/addPackage", async (req, res) => {
    try {
        let { packageName, packageFile } = req.body;
        let newPackage = await addDependency(packageName, packageFile);
        res.status(200).json({ success: true, packageFile: newPackage });
    } catch(err) {
        res.status(500).json({ success: false, error: err });
    }
});

//await asyncEvery(data.dependencies, async(d) => await checkPackage(d))
app.post("/createnode", async (req, res) => {
    let data = <CreateNodeRequest>req.body;
    if (validateObject({
        code: DATA_TYPES.STRING,
        package: DATA_TYPES.STRING
    }, data)) {
        res.status(200).json({ success: true, url: encryptCode(JSON.stringify(data))});
    } else {
        res.status(400).json({ success: false, error: "Invalid data" });
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

app.all("/test", async (req, res) => {
    let [code, pkg] =  JSON.parse(<string>req.query.node);
    // @ts-ignore
    let result = await runSandBoxed({
        query: <Record<string,string>>req.query,
        method: req.method,
        headers: <Record<string,string>>req.headers,
        // @ts-ignore
        body: req.rawBody,
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

app.use(express.static("public"));

//docker run --privileged -d --name dind-test docker:dind
//docker run --add-host=host.docker.internal:host-gateway -it alpine
if (!isDocker()) {
console.log(`
\x1b[31m
******************
***** WARNING ****
******************
The app is not running under docker, unsafe code will be executed using only the VM2 module
\x1b[0m`);
}
checkForKey();
let proxo = new NpmCachingProxy({ host: "127.0.0.1", port: 16978 });
proxo.start();
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});