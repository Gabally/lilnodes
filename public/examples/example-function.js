module.exports = function(context, respond) {
    respond({
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        content: "<h1>Hello From Lil Nodes</h1>"
    });
};