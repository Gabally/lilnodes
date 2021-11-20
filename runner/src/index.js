const {NodeVM} = require('vm2');
const vm = new NodeVM({
    require: {
        external: false
    },
    console: "off",
    wasm: false,
    require: false,
    eval: false
});


let functionWithCallbackInSandbox = vm.run("module.exports = function(who, callback) { callback(who); }");
functionWithCallbackInSandbox({ query: {a:32,b:"ret"}}, (greeting) => {
    console.log(greeting);
});