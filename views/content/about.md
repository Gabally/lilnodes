## About

Lil Nodes is a platform to run serverless functions embedded in a url.

This way no code is ever stored on the server, and there is no need to register an account.

## Limitations

The functions run in a container with limited resources:

- Limited amount of memory (100mb).
- Execution time capped to 5 seconds.
- maximum one request every three seconds. 
- You only have access to the dependencies you inclued.