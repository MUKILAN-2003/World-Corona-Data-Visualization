let world_data;
let world;

var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);


var country_id = document.getElementById('country_id')
var country_confirmed = document.getElementById('country_confirmed')
var country_confirm_new = document.getElementById('country_confirm_new')
var country_recovered = document.getElementById('country_recovered')
var country_active = document.getElementById('country_active')
var country_critical = document.getElementById('country_critical')
var country_death = document.getElementById('country_death')
var country_death_new = document.getElementById('country_death_new')

let xscale = d3.scaleLinear()
    .domain([0, 10])
    .range([1, 10])

let linearScale = d3.scaleLinear()
    .domain([0, 10])
    .range(['white', 'red']);

function main() {
    function scaling() {
        projection.scale(500);
    }

    let svg = d3.select('#world-map')
    svg.attr('width', 968)
    svg.attr('height', 480)
    svg.call(scaling)

    svg.selectAll('path')
        .data(world)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', 'black')
        .style('fill', (item) => {
            if (item.properties.name == 'United States of America') { item.properties.name = 'USA'; };
            if (item.properties.name == 'United Kingdom') { item.properties.name = 'UK'; };
            if (item.properties.name == 'Democratic Republic of the Congo') { item.properties.name = 'DRC'; };
            if (item.properties.name == 'United Arab Emirates') { item.properties.name = 'UAE'; };
            if (item.properties.name == 'United Republic of Tanzania') { item.properties.name = 'Tanzania'; };
            if (item.properties.name == 'North Korea' || item.properties.name == 'South Korea') { item.properties.name = 'S. Korea'; };

            for (var i = 0; i < world_data.countries_stat.length; i++) {
                if (world_data.countries_stat[i].country_name == item.properties.name) {
                    return linearScale(xscale(parseInt(world_data.countries_stat[i].cases)))
                }

            }

            if (item.properties.name == 'Turkmenistan') { return '#fff' };
        })
        .on('mouseover', (item) => {
            for (var i = 0; i < world_data.countries_stat.length; i++) {
                if (world_data.countries_stat[i].country_name == item.properties.name) {
                    country_id.innerText = world_data.countries_stat[i].country_name
                    country_confirmed.innerHTML = 'Confirmed : &nbsp;' + world_data.countries_stat[i].cases + "<sup id='country_confirm_new'>" + ' +' + world_data.countries_stat[i].new_cases + "</sup>"
                    country_recovered.innerHTML = 'Recovered : ' + world_data.countries_stat[i].total_recovered
                    country_active.innerHTML = 'Active : ' + world_data.countries_stat[i].active_cases
                    country_critical.innerHTML = 'Critical : ' + world_data.countries_stat[i].serious_critical
                    country_death.innerHTML = 'Death : ' + world_data.countries_stat[i].deaths + "<sup id='country_death_new'>" + ' +' + world_data.countries_stat[i].new_deaths + "</sup>"
                }
            }
        })
        .on('mouseout', (item) => {
            country_id.innerText = 'World'
            country_confirmed.innerHTML = 'Confirmed : ' + world_data.world_total.total_cases + "<sup id='country_confirm_new'>" + ' +' + world_data.world_total.new_cases + "</sup>"
            country_recovered.innerHTML = 'Recovered : ' + world_data.world_total.total_recovered
            country_active.innerHTML = 'Active : ' + world_data.world_total.active_cases
            country_critical.innerHTML = 'Critical : ' + world_data.world_total.serious_critical
            country_death.innerHTML = 'Death : ' + world_data.world_total.total_deaths + "<sup id='country_death_new'>" + ' +' + world_data.world_total.new_deaths + "</sup>"
        });
    country_id.innerText = 'World'
    country_confirmed.innerHTML = 'Confirmed : ' + world_data.world_total.total_cases + "<sup id='country_confirm_new'>" + ' +' + world_data.world_total.new_cases + "</sup>"
    country_recovered.innerHTML = 'Recovered : ' + world_data.world_total.total_recovered
    country_active.innerHTML = 'Active : &nbsp;' + world_data.world_total.active_cases
    country_critical.innerHTML = 'Critical : ' + world_data.world_total.serious_critical
    country_death.innerHTML = 'Death : ' + world_data.world_total.total_deaths + "<sup id='country_death_new'>" + ' +' + world_data.world_total.new_deaths + "</sup>"
}

fetch("/map_file/world.geo.json").then(response => response.json()).then((data) => {

    world = data.features;
    fetch('/data/data_world.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            world_data = data
            main()
        });
});