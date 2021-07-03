const express = require('express')
const helmet = require('helmet')

const app = express()
app.set('view engine', 'ejs');
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.listen(5500);

app.get('/', (req, res) => {
    res.write("Hello Let's Start")
    res.end()
})