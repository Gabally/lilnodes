# Lil Nodes
<p align="center">
    <img src="src/public/knot.png" width="60">
</p>

### Little pieces of code to help you tie things together

### Main features:

- Run server-side javascript code in a serverless enviroment
- Add your own dependencies with npm
- No code is stored on the server, everything is embedded in the url
- In-Browser code editor
- Test console to test your nodes
- The node has access to all the parameters passed in the http request.

### Limitations:

- The node will timeout after 10 seconds of execution
- No access to the default node modules
- The execute endpoint is limited to one execution every 3 seconds
