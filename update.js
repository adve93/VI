var selected;
var filterLabel;
var type;
var gender;
var generation;

function updateIdioms(filters) {
    console.log(filters);

    type = filters.get("type");
    gender = filters.get("gender");
    generation = filters.get("generation");

    console.log("Applying filters {");;
    for (const [key, value] of selected) {
        if (value) {
            console.log(`  ${key}: ${value}`);
        }
    }
    console.log("}")

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
            return d.type1 === type;
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

    //Select the SVG element of the bar chart
    const svg = d3.select("#barChart").select("svg").select("g");

    //Filter data
    if (!type) {
        data = globalData;
    }
    else {
        data = globalData.filter(function (d) {
            return d.type1 === type;
        });
    }

    //Group the data by generation and count legendary Pokémon
    const generationData = d3.group(data, d => d.generation);
    const generationCounts = Array.from(generationData, ([generation, group]) => ({
        generation: generation,
        legendaryCount: d3.sum(group, d => d.is_legendary),
        type: group[0].type1,
    }));

    //Create the x and y scales
    const xScale = d3.scaleBand()
        .domain(generationCounts.map(d => d.generation))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(generationCounts, d => d.legendaryCount)])
        .nice()
        .range([height, 0]);

    //Select all existing bars and bind the data to them
    const bars = svg.selectAll(".bar")
        .data(data);

    //Update existing bars with transitions for position, width, height, and color
    bars
        .transition()
        .duration(1000)
        .attr("x", d => xScale(d.generation))
        .attr("y", d => yScale(d.legendaryCount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.legendaryCount))
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr('opacity', 1.1);
    /*
    // Add new bars for any new data points and transition them to their correct position and width
    bars.enter()
        .append("rect")
        .attr("class", "legendary_bar")
        .attr("x", d => xScale(d.generation))
        .attr("y", d => yScale(d.legendaryCount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.legendaryCount))
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr('opacity', 1.1)
        .transition()
        .duration(2000);

    //Remove any bars that are no longer in the updated data
    bars.exit().transition().duration(500).attr("width", 0).remove();
    */
    // Add tooltips to all bars with the movie title as the content
    svg.selectAll(".bars")
        .on("click", handleGenerationClick)
        .on("mouseover", handleMouseOverGeneration)
        .on("mouseout", handleMouseOutGeneration)
        .append("title")
        .text( d =>
            `Generation: ${d.generation}\nNum Legendaries:${d.legendaryCount}`
        );

    

    
}