import express from 'express';
const app = express();
const port = 8000;
import { NpmCachingProxy } from './npm-cache/proxy';

app.set('view engine', 'pug');

app.get('/exec', (req, res) => {
    try {
        eval(req.query.code as string);   
    } catch (error) {
        res.writeHead(500);
        res.end(error);
    }
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/documentation', (req, res) => {
    res.render('docs')
});

app.use(express.static('public'));

//docker run --privileged -d --name dind-test docker:dind
//docker run --add-host=host.docker.internal:host-gateway -it alpine

let proxo = new NpmCachingProxy({ host: "0.0.0.0", port: 7000 });
proxo.start();
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});