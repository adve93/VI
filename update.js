var selected;
var filterLabel;
var type;
var gender;
var generation;


function select(selected) {

    type = selected.get("type");
    gender = selected.get("gender");
    generation = selected.get("generation");

}

// A function that create / update the plot for a given variable:
function updatePieChart(selected) {

    select(selected);

    const width = 350 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - 40;

    var dataType = filterByType(globalData);
    var data = filterByGeneration(dataType);

    const male_average = d3.mean(data, (d) => (d.percentage_male !== -1) ? d.percentage_male : NaN);
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

    const svg = d3.select("#pieChart")
        .select("svg")
        .select("g");

    svg.selectAll(".slice").remove();   // Remove old slices

    // map to data
    const chart = svg.selectAll("path")
        .data(data_ready);

    // Build the pie chart
    chart.join('path')
        .attr('d', arcGenerator)
        .attr("class", "slice")
        .attr('fill', d => genderColors[d.data[0]])
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
        .on("click", handleGenderClick)
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
        // Add the filters text under the pie chart
        filterLabel = d3.select("#pieChart")
            .append("text")
            .text(type)
            .attr("x", (width / 2))
            .attr("y", 400)
            .style("text-anchor", "start")
            .style("font-size", 20);
    }

    
    if(gender) {
        reSelectGenderMarks();
    }

}

function updateBarChart(selected) {

    select(selected);

    //Define variables
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    //Filter data
    var dataType = filterByType(globalData);
    var data = filterByGender(dataType);

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

    //Impute missing generations
    for(let i = 0; i < 7; i++) {
        if(!generationCountsUpdated[i]) {
            const newObj = { generation: (i+1).toString(), legendaryCount: 0 }
            generationCountsUpdated.push(newObj)
        }
    }

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

function updateParallelCoordinatesPlot(selected) {

    select(selected);

    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    var dataGender = filterByGender(globalData);
    var data = filterByGeneration(dataGender);

    //Calculate average values for fighting stats
    const updatedAverageData = d3.rollup(data,
        group => ({
            Attack: d3.mean(group, d => d.attack).toFixed(2),
            SpAttack: d3.mean(group, d => d.sp_attack).toFixed(2),
            Defense: d3.mean(group, d => d.defense).toFixed(2),
            SpDefense: d3.mean(group, d => d.sp_defense).toFixed(2),
            HP: d3.mean(group, d => d.hp).toFixed(2),
            Speed: d3.mean(group, d => d.speed).toFixed(2),
            type: group[0].type1
        }),
        d => d.type1
    );

    const svg = d3.select("#parallelCoordinatesPlot").select("svg").select("g");

    svg.selectAll(".line_type").remove();       // Remove plot marks

    const stats = ["Attack", "SpAttack", "Defense", "SpDefense", "HP", "Speed"];

    const yMin = d3.min(globalData, d => d3.min([d.attack, d.sp_attack, d.defense, d.sp_defense, d.hp, d.speed]));      // Min y possible value
    const yMax = d3.max(globalData, d => d3.max([d.attack, d.sp_attack, d.defense, d.sp_defense, d.hp, d.speed]));      // Max y possible value

    // Define the y-scale for the stats
    const yScales = {
        Attack: d3.scaleLinear().domain([yMin, yMax]).range([height, 0]),
        SpAttack: d3.scaleLinear().domain([yMin, yMax]).range([height, 0]),
        Defense: d3.scaleLinear().domain([yMin, yMax]).range([height, 0]),
        SpDefense: d3.scaleLinear().domain([yMin, yMax]).range([height, 0]),
        HP: d3.scaleLinear().domain([yMin, yMax]).range([height, 0]),
        Speed: d3.scaleLinear().domain([yMin, yMax]).range([height, 0])
    };

    const offset = width / (stats.length + 1);

    updatedAverageData.forEach((d, i) => {
        const type = d.type;

        // Initialize an array to store the coordinates of the line
        const lineData = stats.map((stat, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[stat](updatedAverageData.get(type)[stat]);
            const type2 = type;
            return [xPosition, yPosition, type2];
        });

        const tooltip = stats.map(stat => {
            return `Average ${stat}: ${updatedAverageData.get(type)[stat]}`;
        });

        // Create points
        stats.forEach((stat, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[stat](updatedAverageData.get(type)[stat]);

            const lineGenerator = d3.line();
            svg.append("path")
                .datum(lineData)
                .attr("class", "line_type")
                .attr("d", lineGenerator)
                .attr("type", type)
                .style("stroke", typeColors[type]) // Adjust the line color
                .style("fill", "none")
                .attr('opacity', 1.1)
                .style("stroke-width", 2) // Adjust the line width
                .on("click", handleTypeClick)
                .on("mouseover", handleMouseOverType)
                .on("mouseout", handleMouseOutType)
                .append("title")
                .text(d => `Type: ${type}\n${tooltip.join('\n')}`);

            svg.append("circle")
                .datum(lineData)
                .attr("class", "line_type")
                .attr("cx", xPosition)
                .attr("cy", yPosition)
                .attr("r", 6) // Adjust the radius of the circle
                .attr("type", type)
                .style("fill", typeColors[type]) // Adjust the fill color
                .attr('opacity', 1.1)
                .attr('stroke-width', 1)
                .on("click", handleTypeClick)
                .append("title")
                .text(d => `Type: ${type}\n${tooltip.join('\n')}`);
        });
    });
    if(type) {
        reSelectTypeMarks();
    }
}

function updateBubbleChart(selected) {

    select(selected);

    const width = 750 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    var dataGender = filterByGender(globalData);
    var data = filterByGeneration(dataGender);

    const filteredData = data.filter(function (d) {
        return (d.height_m > 0) && (d.weight_kg > 0);
    });

    //Calculate average values for height_m and base_egg_steps
    const updatedAverageData = d3.rollup(filteredData,
        group => ({
            averageHeight: d3.mean(group, d => d.height_m),
            averageBaseEggSteps: Math.round(d3.mean(group, d => d.base_egg_steps)),
            type: group[0].type1,
            averageWeight: d3.mean(group, d => d.weight_kg)
        }),
        d => d.type1
    );

    // Calculate the Pearson correlation coefficient (r) for your data
    const correlationCoefficient = calculatePearsonCorrelation(updatedAverageData);

    const svg = d3.select("#bubbleChart").select("svg").select("g");

    svg.selectAll(".circle_type").remove();     // Remove bubbles 
    svg.selectAll(".pearson").remove();     // Remove pearson line      


    //Define scales for x and y
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(updatedAverageData.values(), d => d.averageBaseEggSteps)])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(updatedAverageData.values(), d => d.averageHeight)])
        .range([height - margin.bottom, margin.top]);

    const rScale = d3.scaleLinear()
        .domain([d3.min(updatedAverageData.values(), d => d.averageWeight), d3.max(updatedAverageData.values(), d => d.averageWeight)])
        .range([10, 20]);


    //Add circles to the scatter plot representing each country
    svg.selectAll(".circle")
        .data(updatedAverageData)
        .enter()
        .append("circle")   
        .attr("class", "circle_type")
        //.transition()
        //.duration(1000)
        //.delay((d, i) => i * 100)
        .attr("cx", d => xScale(d[1].averageBaseEggSteps))
        .attr("cy", d => yScale(d[1].averageHeight))
        .attr("r", d => rScale(d[1].averageWeight))
        .attr("type", d => d[1].type)
        .attr("fill", d => typeColors[d[1].type])
        .attr('stroke-width', 1)
        .attr("stroke", "black")
        .attr('opacity', 1.1);

    // Add tooltips to all circles
    svg.selectAll(".circle_type")
        .on("click", handleTypeClick)
        .on("mouseover", handleMouseOverType)
        .on("mouseout", handleMouseOutType)
        .append("title")
        .text(d =>
            `Type: ${d[1].type}\nAverage Steps:${d[1].averageBaseEggSteps}\nAverage Height:${Math.round(d[1].averageHeight * 10) / 10}\nAverage Weight:${Math.round(d[1].averageWeight * 10) / 10}`
        );

    // Add a Pearson correlation line
    svg.append("line")
        .attr("class", "pearson")
        //.transition()
        //.duration(1000)
        .attr("x1", xScale(d3.min(updatedAverageData, d => d[1].averageBaseEggSteps)))
        .attr("y1", yScale(d3.min(updatedAverageData, d => d[1].averageHeight)))
        .attr("x2", xScale(d3.max(updatedAverageData, d => d[1].averageBaseEggSteps)))
        .attr("y2", yScale(d3.max(updatedAverageData, d => d[1].averageHeight)))
        .style("stroke", "black")
        .style("stroke-width", 2);

    // Add tooltips to pearson line
    svg.selectAll(".pearson")
        .append("title")
        .text(`Pearson Correlation: ${Math.round(correlationCoefficient * 1000) / 1000}`);

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

    if(type) {
        reSelectTypeMarks();
    }
    var i = 0;
    updatedAverageData.forEach(d => console.log(d.type))
}


function filterByType(data){
    if (type) {
        data = data.filter(function (d) {
            return d.type1 === type || d.type2 === type;
        });
    }
    return data;
}

function filterByGender(data){
    if (gender === "Male") {
        data = data.filter(function (d) {
            return d.percentage_male >= 50;
        });
    }
    else if (gender === "Female") {
        data = data.filter(function (d) {
            return d.percentage_male < 50;
        });
    }
    return data;
}

function filterByGeneration(data) {
    if (generation) {
        data = data.filter(function (d) {
            return d.generation === generation;
        });
    }
    return data;
}
