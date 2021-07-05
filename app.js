const express = require('express');
const helmet = require('helmet');

const app = express();
app.set('view engine', 'ejs');
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


//Collecting Data From API 
var unirest = require("unirest");
var fetch_data = unirest("GET", "https://corona-virus-world-and-india-data.p.rapidapi.com/api");
fetch_data.headers({
    "x-rapidapi-key": "7de4557e88mshf2dcd246f68ff52p1d7934jsnaf2f11062ec2",
    "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
    "useQueryString": true
});
console.log('Started Collecting Data')
fetch_data.end(function(res) {
    if (res.error) {
        console.log(res.error)
    } else {
        console.log('Data Collected')
        app.listen(5500);
        covid_data = res.body;
        //console.log(covid_data)
        console.log('Server Listening............ok')
    }
});


//Routing The Responce
app.get('/', (req, res) => {
    res.render('index')
    res.end()
});

app.use((req, res) => {
    res.render('404')
    res.end()
});