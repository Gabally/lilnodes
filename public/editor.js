const editor = new CodeFlask("#editor", { language: "js" });
var dependencies = [];

async function createNode() {
    let resp = await fetch("/createnode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: editor.getCode(),
            dependencies: dependencies
        })
    });
    let { success, url } = await resp.json();
    console.log(success, url); 
}

function $(selector) {
    return document.querySelector(selector);
}

function newElement(name) {
    return document.createElement(name);
}

window.onload = function() {
    $("#create-node").addEventListener("click", function() {
        createNode();
    });
}

function addDependency() {
    let dep = $("#dep-input");
    if (dep.value) {
        dependencies.push(dep.value);
        dep.value = "";
        let container = $("#dep-list");
        container.innerHTML = "";
        dependencies.forEach(d => {
            let depDiv = newElement("div");
            depDiv.className = "dep";
            depDiv.textContent = d;
            container.appendChild(depDiv);
        });
    }
}

$("#add-dep").addEventListener("click", addDependency);