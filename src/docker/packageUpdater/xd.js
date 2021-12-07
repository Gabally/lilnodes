const fs = require("fs");

let pkg = fs.readFileSync("package.json", "utf-8");

let pkgName = "epxress";

fs.writeFileSync("test.json", JSON.stringify({
    packageFile: pkg,
    packageName: pkgName
}));