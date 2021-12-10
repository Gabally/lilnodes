import express from "express";
import { checkForKey, encryptCode } from "./encryption";
import { NpmCachingProxy } from "./npm-cache/proxy";
import { ArrayType, DATA_TYPES, validateObject } from "./objectValidator";
import { addDependency } from "./packageUpdater";
import { CreateNodeRequest } from "./types";

const app = express();
const port = 8000;

app.use(express.json({ limit: "2mb" }));

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
        dependencies: new ArrayType(DATA_TYPES.STRING)
    }, data)) {
        res.status(200).json({ success: true, url: encryptCode(JSON.stringify(data.code))});
    } else {
        res.status(400).json({ success: false, error: "Invalid data" });
    }
});

app.get("/", (req, res) => {
    res.render("index");
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
checkForKey();
let proxo = new NpmCachingProxy({ host: "127.0.0.1", port: 16978 });
proxo.start();
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});