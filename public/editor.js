var editor = new CodeFlask("#editor", { language: "js" });
var package, code = "";
var editorFiles = {
    Code: "C",
    Package: "P"
};
var selectedFile = editorFiles.Code;

var dependencies = [];

const sendPOST = async (url, data) => {
    let resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await resp.json();
};

const fetchAsText = async (url) => {
    let resp = await fetch(url);
    return await resp.text();
};

const  createNode = async () => {
    let { success, url } = await sendPOST("/createnode", {
        code: editor.getCode(),
        dependencies: dependencies
    });
    console.log(success, url); 
};

const $ = (selector) => {
    return document.querySelector(selector);
};

const newElement = (name) => {
    return document.createElement(name);
};

const setCodeActive = () => {
    $("#file-code").classList.add("selected-file");
    $("#file-package").classList.remove("selected-file");
    editor.updateCode(code);
    selectedFile = editorFiles.Code;
};

const setPackageActive = () => {
    $("#file-package").classList.add("selected-file");
    $("#file-code").classList.remove("selected-file");
    editor.updateCode(package);
    selectedFile = editorFiles.Package;
};

const addDependency = () => {
    let modal = new CommandModal("add Dependency", "npm install", {
        actionText: "📦 Install",
        action: async () => {
            modal.disableButtons();
            let { success, packageFile, error } = await sendPOST("/addPackage", {
                packageName: modal.getValue(),
                packageFile: package
            });
            if (success) {
                modal.showInfo(`${modal.getValue()} installed successfully!`);
                modal.clearModal();
                package = packageFile;
                if (selectedFile === editorFiles.Package) {
                    editor.updateCode(package);
                }
            } else {
                modal.showError(error);
            }
            modal.enableButtons();
        }
    });
    modal.show();
};

const resetEditor = async () => {
    package = await fetchAsText("/package.json");
    code = await fetchAsText("/example-function.js");
    setCodeActive();
}

const removeDependency = () => {
    let modal = new CommandModal("remove Dependency", "npm uninstall", {
        actionText: "🔥 Remove",
        action: () => {
            modal.disableButtons();
            try {
                let packageJson = JSON.parse(package);
                if (packageJson["dependencies"]) {
                    delete packageJson["dependencies"][modal.getValue()];
                }
                package = JSON.stringify(packageJson, null, 4);
                if (selectedFile === editorFiles.Package) {
                    editor.updateCode(package);
                }
                modal.showInfo("package removed");
                modal.clearModal();
            } catch (err) {
                console.error(err);
                modal.showError("An error occurred while removing the package");
            }
            modal.enableButtons();
        }
    });
    modal.show();
};

document.addEventListener("DOMContentLoaded", async () => {
    package = localStorage.getItem("package") || await fetchAsText("/package.json");
    code = localStorage.getItem("code") || await fetchAsText("/example-function.js");
    editor.updateCode(code);
    editor.onUpdate((newCode) => {
        if (selectedFile === editorFiles.Code) {
            code = newCode;
            localStorage.setItem("code", newCode);
        } else if (selectedFile === editorFiles.Package) {
            package = newCode;
            localStorage.setItem("package", newCode);
        }
    });
    new HttpTestConsole("http://localhost   ").show();
});

$("#create-node").addEventListener("click", () => {
    createNode();
});

$("#add-dep").addEventListener("click", addDependency);
$("#remove-dep").addEventListener("click", removeDependency);

$("#file-code").addEventListener("click", setCodeActive);
$("#file-package").addEventListener("click", setPackageActive);
$("#reset-editor").addEventListener("click", resetEditor);
//$("#test-node").addEventListener("click", testNode);