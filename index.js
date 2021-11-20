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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});