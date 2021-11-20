const editor = new CodeFlask("#editor", { language: "js" });
function createNode() {
    console.log(editor.getCode());
}

function $(selector) {
    return document.querySelector(selector);
}

window.onload = function() {
    $("#create-node").addEventListener("click", function() {
        createNode();
    });
}