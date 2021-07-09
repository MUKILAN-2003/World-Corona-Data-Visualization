let india_data;
let india;

var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);

var state_id = document.getElementById('state_id')
var state_confirmed = document.getElementById('state_confirmed')
var state_recovered = document.getElementById('state_recovered')
var state_active = document.getElementById('state_active')
var state_death = document.getElementById('state_death')
var delta_confirm = document.getElementById('delta_confirm')
var delta_death = document.getElementById('delta_death')


let xscale = d3.scaleLinear()
    .domain([0, 2500000])
    .range([1, 10])

let linearScale = d3.scaleLinear()
    .domain([0, 10])
    .range(['white', 'red']);

function main() {
    function scaling() {
        projection.scale(6700);
        projection.translate([-1140, 750]);
    }

    let svg = d3.select('#india-map')
    svg.attr('width', 800)
    svg.attr('height', 600)
    svg.call(scaling)

    svg.selectAll('path')
        .data(india)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', 'black')
        .style('fill', (item) => {
            if (item.properties.name == 'Orissa') { item.properties.name = 'Odisha'; };
            if (item.properties.name == 'Dadra and Nagar Haveli' || item.properties.name == 'Daman and Diu') { item.properties.name = 'Dadra and Nagar Haveli and Daman and Diu'; };
            if (item.properties.name == 'Andaman and Nicobar') { item.properties.name = 'Andaman and Nicobar Islands'; };
            if (item.properties.name == 'Uttaranchal') { item.properties.name = 'Uttarakhand'; };

            if (india_data.state_wise[item.properties.name].confirmed) {
                return linearScale(xscale(parseInt(india_data.state_wise[item.properties.name].confirmed)))
            } else {
                return 'White'
            }
        })
        .on('mouseover', (item) => {
            state_id.innerText = item.properties.name
            state_confirmed.innerHTML = 'Confirmed : ' + india_data.state_wise[item.properties.name].confirmed
            state_recovered.innerHTML = 'Recovered : ' + india_data.state_wise[item.properties.name].recovered
            state_death.innerHTML = 'Deaths : ' + india_data.state_wise[item.properties.name].deaths
            state_active.innerHTML = 'Active : ' + india_data.state_wise[item.properties.name].active
            delta_confirm.innerHTML = 'Delta Confirm: ' + india_data.state_wise[item.properties.name].deltaconfirmed
            delta_death.innerHTML = 'Delta Death : ' + india_data.state_wise[item.properties.name].deltadeaths
        })
        .on('mouseout', (item) => {
            state_id.innerText = 'India'
            state_confirmed.innerHTML = 'Confirmed : ' + india_data.total_values.confirmed
            state_recovered.innerHTML = 'Recovered : ' + india_data.total_values.recovered
            state_death.innerHTML = 'Deaths : ' + india_data.state_wise[item.properties.name].deaths
            state_active.innerHTML = 'Active : ' + india_data.total_values.active
            delta_confirm.innerHTML = 'Delta Confirm: ' + india_data.total_values.deltaconfirmed
            delta_death.innerHTML = 'Delta Death : ' + india_data.total_values.deltadeaths
        });
    state_id.innerText = 'India'
    state_confirmed.innerHTML = 'Confirmed : ' + india_data.total_values.confirmed
    state_recovered.innerHTML = 'Recovered : ' + india_data.total_values.recovered
    state_death.innerHTML = 'Deaths : ' + india_data.state_wise[item.properties.name].deaths
    state_active.innerHTML = 'Active : ' + india_data.total_values.active
    delta_confirm.innerHTML = 'Delta Confirm: ' + india_data.total_values.deltaconfirmed
    delta_death.innerHTML = 'Delta Death : ' + india_data.total_values.deltadeaths
}

fetch("/map_file/india.geo.json").then(response => response.json()).then((data) => {

    india = topojson.feature(data, data.objects.ne_10m_admin_1_India_Official).features;
    fetch('/data/data_india.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            india_data = data
            main()
        });
});
