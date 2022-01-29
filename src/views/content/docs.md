# Documentation

### Handling incoming requests:

In the node a function must be exported in ored for the runtime enviroment to pick it up. The function receives two paramerers, the ```context``` object and the  respond ```callback```.

# ```context (Object)```

The incoming request data

### ```query (Object)```
 - An object containing query parameters passed to the node.
### ```method (string)```
 - The method used to make the request. (GET,POST,PUT,PATCH,DELETE)
### ```headers (Object)```
- An object containing headers of the http request.
### ```body (Buffer)```
- A buffer containing the raw body received by the server.
### ```path (string)```
- The complete path of the request.


# ```respond (callback)```

A callback to respond to the http request. ```respond``` takes only one argument, an object containing only these fields:

### ```headers (Object) [Required]```
- An object containing the headers to send back to the client.
### ```statusCode (number) [Required]```
- The http status code to send back to the client
### ```content (Buffer|string|Object) [Required]```
- The body of the http response
