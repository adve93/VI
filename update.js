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
    updateBubbleChart();
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
    if (!type && !gender) {
        data = globalData;
    }
    else {
        data = globalData.filter(function (d) {
            return d.type1 === type || d.type2 === type;
        });
    }

    const svg = d3.select("#barChart")
        .select("svg").select("g");

    // Group the non-filtered data by generation and count legendary Pokémon
    const generationData = d3.group(globalData, d => d.generation);
    const generationCounts = Array.from(generationData, ([generation, group]) => ({
        generation: generation,
        legendaryCount: d3.sum(group, d => d.is_legendary),
    }));

    // Group the filtered data by generation and count legendary Pokémon
    const generationDataUpdated = d3.group(data, d => d.generation);
    const generationCountsUpdated = Array.from(generationDataUpdated, ([generation, group]) => ({
        generation: generation,
        legendaryCount: d3.sum(group, d => d.is_legendary),
    }));

    // Update the yScale domain with the new data
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(generationCounts, d => d.legendaryCount)])
        .nice()
        .range([height, 0]);

    // update xScale
    const xScale = d3.scaleBand()
        .domain(generationCounts.map(d => d.generation))
        .range([0, width])
        .padding(0.1);

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

function updateBubbleChart() {

    //Define variables
    var data;
    const width = 750 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    //Filter data
    if (!generation) {
        data = globalData;   
    }
    else {
        data = globalData.filter(function (d) {
            return d.generation === generation;
        });
        console.log("entrou");
    }

    const svg = d3.select("#bubbleChart")
        .select("svg").select("g");

    //Calculate average values for height_m and base_egg_steps by type
    const averageData = d3.rollup(data, group => ({
            averageHeight: d3.mean(group, d => d.height_m),
            averageBaseEggSteps: Math.round(d3.mean(group, d => d.base_egg_steps)),
            type: group[0].type1,
            averageWeight: d3.mean(group, d => d.weight_kg)
        }), 
        d => d.type1
    );

    //Calculate the Pearson correlation coefficient (r) for your data
    const correlationCoefficient = calculatePearsonCorrelation(averageData);


    //Update the yScale domain with the new data
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageHeight)])
        .range([height - margin.bottom, margin.top]);

    //Update xScale
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageBaseEggSteps)])
        .range([margin.left, width - margin.right]);
    
    //Update the radius
    const rScale = d3.scaleLinear()
        .domain([d3.min(averageData.values(), d => d.averageWeight), d3.max(averageData.values(), d => d.averageWeight)])
        .range([10, 20]);
   
    //Re-render the x-axis
    svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));

    // re-render the y-axis
    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));
        
    // Update the data for the bars
    const circles = svg.selectAll(".circle_type")
        .data(averageData);

    // Update the bars' positions and heights
    circles.transition()
        .duration(1000)
        .attr("cx", d => xScale(d[1].averageBaseEggSteps))
        .attr("cy", d => yScale(d[1].averageHeight))
        .attr("r", d => rScale(d[1].averageWeight))
        .attr("type", d => d[1].type)
        .attr("fill", d => typeColors[d[1].type])
        .select("title")
        .text( d =>
            `Type: ${d[1].type}\nAverage Steps:${d[1].averageBaseEggSteps}\nAverage Height:${Math.round(d[1].averageHeight * 10) / 10}\nAverage Weight:${Math.round(d[1].averageWeight * 10) / 10}`
        );

}