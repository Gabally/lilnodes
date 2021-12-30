var editor = new CodeFlask("#editor", { language: "js" });
var package, code = "";
var Httpconsole = new HttpTestConsole("/test", code, package);
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
        code: code,
        package: package
    });
    if (success) {
        let mainContainer = crafteElement("div", {
            style:`
            border: 2px solid black;
            background: rgba(105, 230, 105, 0.877);
            color: black;
            margin: 10px;
            font-weight: bold;
            `
        });
        let nodeURLTitle = crafteElement("div", {
            style:`
            padding: 8px;
            `,
            text: "URL:"
        });
        mainContainer.appendChild(nodeURLTitle);
        let nodeURLContainer = crafteElement("div", {
            style:`
            margin: 5px;
            padding: 3px;
            text-overflow: ellipsis; 
            max-width: 100%;
            background: grey;
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            `
        });
        let nodeURL = crafteElement("div", {
            style:`
            width: 97%;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: white;
            padding: 1px;
            `,
            text: `${window.location.origin}/run/${url}`
        });
        nodeURLContainer.appendChild(nodeURL);
        let copyBtn = crafteElement("button", {
            classes: ["nav-link"],
            style:`
            border: 2px solid black;
            border-radius: 3px;
            padding: 2px;
            `,
            text: "📋",
            listeners: {
                click: () => {
                    navigator.clipboard.writeText(`${window.location.origin}/run/${url}`);
                }
            }
        });
        nodeURLContainer.appendChild(copyBtn);
        mainContainer.appendChild(nodeURLContainer);
        $("#nodes").appendChild(mainContainer);
    }
};

const $ = (selector) => {
    return document.querySelector(selector);
};

const newElement = (name) => {
    return document.createElement(name);
};

const crafteElement = (element, options={}) => {
    let el = document.createElement(element);
    el.innerText = options.text || "";
    (options.classes || []).forEach(c => el.classList.add(c));
    el.setAttribute("style", options.style || "");
    for (const event in options.listeners || {}) {
        el.addEventListener(event, options.listeners[event]);
    }
    for (const attr in options.attributes || {}) {
        el.setAttribute(attr, options.attributes[attr]);
    }
    return el;
}

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
            let { success, packageFile, error } = await sendPOST("/npminstall", {
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
    package = await fetchAsText("/examples/package.json");
    code = await fetchAsText("/examples/example-function.js");
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
    package = localStorage.getItem("package") || await fetchAsText("/examples/package.json");
    code = localStorage.getItem("code") || await fetchAsText("/examples/example-function.js");
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
});

$("#create-node").addEventListener("click", () => {
    createNode();
});

$("#add-dep").addEventListener("click", addDependency);
$("#remove-dep").addEventListener("click", removeDependency);

$("#file-code").addEventListener("click", setCodeActive);
$("#file-package").addEventListener("click", setPackageActive);
$("#reset-editor").addEventListener("click", resetEditor);
$("#test-node").addEventListener("click", () => {
    Httpconsole.setData(code, package);
    Httpconsole.show();
});