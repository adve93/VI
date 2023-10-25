//Function to create a bubble chart
function createBubbleChart(data) {

    const width = 750 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    //Calculate average values for height_m and base_egg_steps by type
    const averageData = d3.rollup(data, 
        group => ({
            averageHeight: d3.mean(group, d => d.height_m),
            averageBaseEggSteps: Math.round(d3.mean(group, d => d.base_egg_steps)),
            type: group[0].type1,
            averageWeight: d3.mean(group, d => d.weight_kg)
        }), 
        d => d.type1
    );

    // Calculate the Pearson correlation coefficient (r) for your data
    const correlationCoefficient = calculatePearsonCorrelation(averageData);

    //Selecting HTML element and appeding svg element
    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height  + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Define scales for x and y
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageBaseEggSteps)])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageHeight)])
        .range([height - margin.bottom, margin.top]);

    const rScale = d3.scaleLinear()
        .domain([d3.min(averageData.values(), d => d.averageWeight), d3.max(averageData.values(), d => d.averageWeight)])
        .range([10, 20]);

    //Add circles to the scatter plot representing each country
    svg.selectAll(".circle")
        .data(averageData)
        .enter()
        .append("circle")
        .attr("class", "circle_type")
        .attr("cx", d => xScale(d[1].averageBaseEggSteps))
        .attr("cy", d => yScale(d[1].averageHeight))
        .attr("r", d => rScale(d[1].averageWeight))
        .attr("type", d => d[1].type)
        .attr("fill", d => typeColors[d[1].type])
        .attr('stroke-width',1)
        .attr("stroke", "black")
        .attr('opacity', 1.1)
        .on("click", handleTypeClick)
        .on("mouseover", handleMouseOverType)
        .on("mouseout", handleMouseOutType)
        .append("title")
        .text( d =>
            `Type: ${d[1].type}\nAverage Steps:${d[1].averageBaseEggSteps}\nAverage Height:${Math.round(d[1].averageHeight * 10) / 10}\nAverage Weight:${Math.round(d[1].averageWeight * 10) / 10}`
        );

    // Add a Pearson correlation line
    svg.append("line")
        .attr("x1", xScale(d3.min(averageData, d => d[1].averageBaseEggSteps)))
        .attr("y1", yScale(d3.min(averageData, d => d[1].averageHeight)))
        .attr("x2", xScale(d3.max(averageData, d => d[1].averageBaseEggSteps)))
        .attr("y2", yScale(d3.max(averageData, d => d[1].averageHeight)))
        .style("stroke", "black")
        .style("stroke-width", 2)
        .append("title")
        .text(`Pearson Correlation: ${Math.round(correlationCoefficient*1000)/1000}`)


    //Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .call(
            d3
              .axisBottom(xScale)
              .tickFormat((d) => d3.format(".1f")(d / 1000) + "K")
              .tickSizeOuter(0)
          );

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .call(
            d3
              .axisLeft(yScale)
              .tickFormat((d) => d + "m")
          );

    //Label the axes
    svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top - 20)
        .style("text-anchor", "middle")
        .text("Steps");

    svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 40)
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height");

    }

//Function to create a parallel coordinates plot
function createParallelCoordinatesPlot(data) {

    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    //Calculate average values for fighting stats
    const averageData = d3.rollup(data,
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


    //Selecting HTML element and appeding svg element
    const svg = d3.select("#parallelCoordinatesPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const stats = ["Attack", "SpAttack", "Defense", "SpDefense", "HP", "Speed"];


    const yTickValues = [40, 60, 80, 100, 120, 140];

    // Define the y-scale for the stats
    const yScales = {
        Attack: d3.scaleLinear().domain([40, 140]).range([height, 0]),
        SpAttack: d3.scaleLinear().domain([40, 140]).range([height, 0]),
        Defense: d3.scaleLinear().domain([40, 140]).range([height, 0]),
        SpDefense: d3.scaleLinear().domain([40, 140]).range([height, 0]),
        HP: d3.scaleLinear().domain([40, 140]).range([height, 0]),
        Speed: d3.scaleLinear().domain([40, 140]).range([height, 0])
    };

    // Create a single shared scale for all axes
    const scale = d3.scaleLinear().domain([40, 140]).range([height, 0]);

    const offset = width / (stats.length + 1);

    // Add a single scale before all axes
    svg.append("g")
        .attr("class", "scale-axis")
        .call(d3.axisLeft(scale).tickValues(yTickValues));

    // Add vertical axes for the selected stats with a fixed separation
    stats.forEach((stat, i) => {
        const xPosition = (i + 1) * offset; // Add 1 to the index to account for the first axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${xPosition},0)`)
            .call(d3.axisLeft(yScales[stat]).tickValues([]));

        // Add the axis label
        svg.append("text")
            .attr("x", xPosition)
            .attr("y", height + 20) // Adjust the vertical position of the label
            .style("text-anchor", "middle")
            .text(stat);
    });


    averageData.forEach((d, i) => {
        const type = d.type;

        // Initialize an array to store the coordinates of the line
        const lineData = stats.map((stat, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[stat](averageData.get(type)[stat]);
            const type2 = type;
            return [xPosition, yPosition, type2];
        });

        const tooltip = stats.map(stat => {
            return `${stat}: ${averageData.get(type)[stat]}`;
        });

        // Create points
        stats.forEach((stat, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[stat](averageData.get(type)[stat]);

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
                .on("click", d => handleTypeClick)
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
                .on("click", d => handleTypeClick)
                .append("title")
                .text(d => `Type: ${type}\n${tooltip.join('\n')}`);
        });
    });
}

// Function to calculate Pearson correlation coefficient
function calculatePearsonCorrelation(data) {
    const xMean = d3.mean(data.values(), d => d.averageBaseEggSteps);
    const yMean = d3.mean(data.values(), d => d.averageHeight);

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    data.forEach(d => {
        const xDiff = d.averageBaseEggSteps - xMean;
        const yDiff = d.averageHeight - yMean;
        numerator += xDiff * yDiff;
        denominatorX += xDiff ** 2;
        denominatorY += yDiff ** 2;
    });
    
    const r = numerator / Math.sqrt(denominatorX * denominatorY);
    return r;
}

function createPieChart(data) {


    const width2 = 350 - margin.left - margin.right;
    const height2 = 300 - margin.top - margin.bottom;

    const male_average = d3.mean(data, d => d.percentage_male);
    const female_average = 100 - male_average;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width2, height2) / 2 - 40;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .append("g")
        .attr("transform", `translate(${width2 / 2}, ${height2 / 2})`);

    const avg = { Male: male_average, Female: female_average };

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1]; })
        .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart

    const data_ready = pie(Object.entries(avg))

    // map to data
    const chart = svg.selectAll("path")
        .data(data_ready);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
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

}

function createChordDiagram(data) {

    //Define radius
    const outerRadius = 40;
    const innerRadius = outerRadius - 20;

    //Type pos translator
    const typePos = {
        "normal": 0,
        "fire": 1,
        "water": 2,
        "electric": 3,
        "grass": 4,
        "ice": 5,
        "fighting": 6,
        "poison": 7,
        "ground": 8,
        "flying": 9,
        "psychic": 10,
        "bug": 11,
        "rock": 12,
        "ghost": 13,
        "steel": 14,
        "dragon": 15,
        "dark": 16,
        "fairy": 17
    };

    //Create an object to store abilities by type
    var abilitiesByType = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    //Create an object to store types
    var typing = ["normal","fire","water","electric","grass","ice",
    "fighting","poison","ground","flying","psychic","bug","rock","ghost","steel",
    "dragon","dark","fairy"];


    //Fill abilitiesByType array
    data.forEach(d => {

        //Check both type1 and type2
        const types = [d.type1, d.type2]; 

        //Get Pokemon abilities and push them into the array
        var abl = [];
        abl = d.abilities;
        const validJSONString = abl.replace(/'/g, '"'); //Data in stored as a string so we parse it into an array
        const array = JSON.parse(validJSONString);

        types.forEach(type => {
            if(type != -1) { //For mono type pokémon (to catch sentinel value)
                array.forEach(a => {
                    if(!(abilitiesByType[typePos[type]].includes(a))) //Check if ablitie is already in array 
                        abilitiesByType[typePos[type]].push(a);
                }); 
            }     
        });
        
    });
    
    //Calculate chords
    chord = d3.chord()
        .padAngle(5/innerRadius)
        .sortSubgroups(d3.descending);
    
    //Calculate arcs   
    arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    
    //Calculate ribbons  
    ribbon = d3.ribbon()
        .radius(innerRadius - 1)
        .padAngle(1/innerRadius);

    chords = chord(abilitiesByType);
    
    //Create the svg area
    const svg = d3.select("#chorDiagram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height  + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.data(chords)
    .append("g")
    .selectAll("g")
    .join("g")
    .append("path")
    .style("fill", "red")
    .style("stroke", "black")
    .attr("d", arc);
    
}

function createBarChart(data) {

    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    //Select the #barChart element and append an SVG to it
    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

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

    //Append and style the bars using the data and scales
    svg.selectAll(".bar")
        .data(generationCounts)
        .enter()
        .append("rect")
        .attr("class", "legendary_bar")
        .attr("x", d => xScale(d.generation))
        .attr("y", d => yScale(d.legendaryCount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.legendaryCount))
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr('opacity', 1.1)
        .on("click", handleGenerationClick)
        .on("mouseover", handleMouseOverGeneration)
        .on("mouseout", handleMouseOutGeneration)
        .append("title")
        .text( d =>
            `Generation: ${d.generation}\nNum Legendaries:${d.legendaryCount}`
        );

    //Append x and y axes to the chart
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).tickSizeOuter(0));

    //Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Generation");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .text("Number of Legendaries");
}