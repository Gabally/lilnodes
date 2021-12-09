module.exports = function(context) {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        content: "<h1>Hello From Lil Nodes</h1>"
    }
};