let india_data;
let india;

var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);

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
    console.log(india_data)
    console.log(india)

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