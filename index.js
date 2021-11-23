const express = require('express');
const app = express();
const port = 8080;

app.set('view engine', 'pug');

app.get('/exec', (req, res) => {
    try {
        String(eval(req.query.code));
    } catch (error) {
        res.writeHead(500);
        res.end(error.message);
    }
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.use(express.static('public'));


//docker run --privileged -d --name dind-test docker:dind
//docker run --add-host=host.docker.internal:host-gateway -it alpine
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});