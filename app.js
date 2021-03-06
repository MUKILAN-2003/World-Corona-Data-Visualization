const express = require('express');
const helmet = require('helmet');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
//app.use(helmet())    // Secured so, cant import from https script
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



//Collecting Data From API 
var unirest = require("unirest");
var fetch_world_data = unirest("GET", "https://corona-virus-world-and-india-data.p.rapidapi.com/api");
var fetch_india_data = unirest("GET", "https://corona-virus-world-and-india-data.p.rapidapi.com/api_india");

//Header Required To fetch data


async function collect_world_data() {
    await delay(3000);
    await fetch_world_data.end(function(res) {
        if (res.error) {
            console.log(res.error)
        } else {
            covid_wdata = res.body;
            //console.log(covid_wdata)
            console.log('World Data Collected');
            //Saving Data to The Directory
            w_data = JSON.stringify(covid_wdata)
            fs.writeFile("public/data/data_world.json", w_data, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            });
        }
    });
}

async function collect_india_data() {
    await delay(1000);
    await fetch_india_data.end(function(res) {
        if (res.error) {
            console.log(res.error)
        } else {
            console.log('India Data Collected')
            covid_idata = res.body;
            //console.log(covid_idata)

            //Saving Data to The Directory
            i_data = JSON.stringify(covid_idata)
            fs.writeFile("public/data/data_india.json", i_data, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("Data has been saved.");
            });
        }

    });
}

function delay(delayInms) { return new Promise(resolve => { setTimeout(() => { resolve(2); }, delayInms); }); }

function fetch_data() {
    console.log('Started Collecting Data');
    collect_world_data();
    collect_india_data();
}

app.listen(process.env.PORT || 3000)
console.log('Server Listening............ok')

fetch_data();            // To Run in Heroku (1hr active) 
//setInterval(fetch_data, 21600000);       # To Run on 24/7 Server


//Routing The Responce
app.get('/', (req, res) => {
    res.render('index')
    res.end()
});



app.get('/world', (req, res) => {
    res.render('world')
    res.end()
});
app.get('/india', (req, res) => {
    res.render('india')
    res.end()
});

app.use((req, res) => {
    res.render('404')
    res.end()
});
