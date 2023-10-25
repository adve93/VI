var selected;
var filterLabel;
var type;
var gender;
var generation;

function updateIdioms(filters) {

    type = filters.get("type");
    gender = filters.get("gender");
    generation = filters.get("generation");


    updatePieChart();
    updateBarChart();
}

// A function that create / update the plot for a given variable:
function updatePieChart() {

    const width2 = 350 - margin.left - margin.right;
    const height2 = 300 - margin.top - margin.bottom;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width2, height2) / 2 - 40;

    var data;

    if (!type) {
        data = globalData;
    }
    else {
        data = globalData.filter(function (d) {
            return d.type1 === type || d.type2 === type;
        });
    }

    const male_average = d3.mean(data, d => d.percentage_male);
    const female_average = 100 - male_average;

    const avg = { Male: male_average, Female: female_average };

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);


    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1]; })
        .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart

    const data_ready = pie(Object.entries(avg));

    // map to data
    const chart = d3.select("#pieChart").selectAll("path")
        .data(data_ready);

    // Build the pie chart
    chart.join('path')
        .attr('d', arcGenerator)
        .attr("class", "slice")
        .attr('fill', d => genderColors[d.data[0]])
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
        .append("title")
        .text(d => `${d.data[1].toFixed(2)}%`);

    // Labels
    chart.enter()
        .append('text')
        .text(function (d) { return d.data[0] })
        .attr("transform", function (d) {
            return "translate(" + arcGenerator.centroid(d) + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 17);

    if (filterLabel) filterLabel.remove();

    if (type) {
        // Add the "hi" text under the pie chart
        filterLabel = d3.select("#pieChart")
            .append("text")
            .text(type)
            .attr("x", (width2 / 2))
            .attr("y", 400)
            .style("text-anchor", "start")
            .style("font-size", 20);
    }

}

function updateBarChart() {

    //Define variables
    var data;
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    //Filter data
    if (!type) {
        data = globalData;
    }
    else {
        data = globalData.filter(function (d) {
            return d.type1 === type || d.type2 === type;
        });
    }

    const svg = d3.select("#barChart")
        .select("svg").select("g");

    // Group the filtered data by generation and count legendary Pokémon
    const generationDataUpdated = d3.group(data, d => d.generation);
    const generationCountsUpdated = Array.from(generationDataUpdated, ([generation, group]) => ({
        generation: generation,
        legendaryCount: d3.sum(group, d => d.is_legendary),
    }));

    // Update the yScale domain with the new data
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(generationCountsUpdated, d => d.legendaryCount)])
        .nice()
        .range([height, 0]);

    // update xScale
    const xScale = d3.scaleBand()
        .domain(generationCountsUpdated.map(d => d.generation))
        .range([0, width])
        .padding(0.1);
    
    // re-render the x-axis
    svg.select(".x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    // re-render the y-axis
    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));

    // Update the data for the bars
    const bars = svg.selectAll(".legendary_bar")
        .data(generationCountsUpdated);

    // Update the bars' positions and heights
    bars.transition()
        .duration(1000)
        .attr("x", d => xScale(d.generation))
        .attr("y", d => yScale(d.legendaryCount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.legendaryCount))
        .select("title")
        .text(d => {
            return `Generation: ${d.generation}\nNumero Legendaries: ${d.legendaryCount}`;
        });

}