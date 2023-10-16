

function updatePieChart(item, data){

    var filteredData = data.filter(function (d) {
        return d.type === item;
    });
    
    const male_average = d3.mean(filteredData, d => d.percentage_male);
    const female_average = 100 - male_average;

    var newData = [male_average, female_average];

    var pie = d3.pie()(newData);

    var piePath = d3.select("#pieChart")
        .selectAll("path")
        .data(pie);
    
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(100);
    const color = d3.scaleOrdinal()
        .range(["#5888B4", "#D3469D"])

    piePath.exit().remove(); // Remove old paths

    piePath.enter()
        .append("path")
        .merge(piePath)
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));
}