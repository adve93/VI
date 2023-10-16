

function updatePieChart(item, data){

    /*
    const width2 = 350 - margin.left - margin.right;
    const height2 = 300 - margin.top - margin.bottom;

    var filteredData = data.filter(function (d) {
        return d.type === item;
    });
    
    const male_average = d3.mean(filteredData, d => d.percentage_male);
    const female_average = 100 - male_average;


    const pie = d3.pie()
        .value(function (d) { return d[1] })

    var data_ready = pie(Object.entries({ Male: male_average, Female: female_average }));
    var svg = d3.select("#pieChart"); 

    var slices = svg.selectAll("path")
        .data(data_ready);
    
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width2, height2) / 2 - 40);

    const color = d3.scaleOrdinal()
        .range(["#5888B4", "#D3469D"])

    // Remove old paths
    slices.exit().remove();


    slices.enter()
        .append("path")
        .merge(slices)
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));

    // Labels
    slices
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) { return d.data[0] })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 17)
    */

}