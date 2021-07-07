let world_data;
let world;

var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);

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

    console.log(world_data)
    console.log(world)

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
            if (item.properties.name == 'North Korea' || item.properties.name == 'South Korea') { item.properties.name = 'S. Korea'; };

            for (var i = 0; i < world_data.countries_stat.length; i++) {
                if (world_data.countries_stat[i].country_name == item.properties.name) {
                    return linearScale(xscale(parseInt(world_data.countries_stat[i].cases)))
                }

            }

            if (item.properties.name == 'Turkmenistan') { return '#fff' };
        })

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