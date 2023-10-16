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

    const correlationLine = d3.line()
        .x(d => xScale(d.averageBaseEggSteps))  // Use xScale for x-coordinate
        .y(d => yScale(correlationCoefficient * d.averageBaseEggSteps)) // Adjusted for y-coordinate

    //Add circles to the scatter plot representing each country
    svg.selectAll(".circle")
        .data(averageData)
        .enter()
        .append("circle")
        .attr("class", "circle_type")
        .attr("cx", d => xScale(d[1].averageBaseEggSteps))
        .attr("cy", d => yScale(d[1].averageHeight))
        .attr("r", d => rScale(d[1].averageWeight))
        .attr("item", d => d[1].type)
        .attr("fill", d => typeColors[d[1].type])
        .attr('stroke-width',1)
        .attr("stroke", "black")
        .attr('opacity', 1.1)
        .on("click", handleOpacityCircle)
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
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

    //Label the axes
    svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top - 20)
        .style("text-anchor", "middle")
        .text("Steps by type");

    svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 40)
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height by type");

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

    const dimensions = ["Attack", "SpAttack", "Defense", "SpDefense", "HP", "Speed"];


    const yTickValues = [40, 60, 80, 100, 120, 140];

    // Define the x-scale for the types
    const xScale = d3.scalePoint()
        .domain(Object.keys(averageData))
        .range([0, width]);

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

    const offset = width / (dimensions.length + 1);

    // Add a single scale before all axes
    svg.append("g")
        .attr("class", "scale-axis")
        .call(d3.axisLeft(scale).tickValues(yTickValues));

    // Add vertical axes for the selected dimensions with a fixed separation
    dimensions.forEach((dimension, i) => {
        const xPosition = (i + 1) * offset; // Add 1 to the index to account for the first axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${xPosition},0)`)
            .call(d3.axisLeft(yScales[dimension]).tickValues([]));

        // Add the axis label
        svg.append("text")
            .attr("x", xPosition)
            .attr("y", height + 20) // Adjust the vertical position of the label
            .style("text-anchor", "middle")
            .text(dimension);
    });


    averageData.forEach((d, i) => {
        const type = d.type;

        // Initialize an array to store the coordinates of the line
        const lineData = dimensions.map((dimension, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[dimension](averageData.get(type)[dimension]);
            const type2 = type;
            return [xPosition, yPosition, type2];
        });

        const tooltip = dimensions.map(stat => {
            return `${stat}: ${averageData.get(type)[stat]}`;
        });

        // Use D3 to draw the line connecting the points
        const lineGenerator = d3.line();

        // Create points
        dimensions.forEach((dimension, j) => {
            const xPosition = (j + 1) * offset;
            const yPosition = yScales[dimension](averageData.get(type)[dimension]);

            const lineGenerator = d3.line();
            svg.append("path")
                .datum(lineData)
                .attr("class", "line_type")
                .attr("d", lineGenerator)
                .attr("item", type)
                .style("stroke", typeColors[type]) // Adjust the line color
                .style("fill", "none")
                .attr('opacity', 1.1)
                .style("stroke-width", 2) // Adjust the line width
                .on("click", handleOpacityLines)
                .append("title")
                .text(d => `Type: ${type}\n${tooltip.join('\n')}`);

            svg.append("circle")
                .attr("class", "pc_circle")
                .attr("cx", xPosition)
                .attr("cy", yPosition)
                .attr("r", 6) // Adjust the radius of the circle
                .attr("item", type)
                .style("fill", typeColors[type]) // Adjust the fill color
                .attr('opacity', 1.1)
                .attr('stroke-width', 1)
                .on("click", handleOpacityLines)
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


    const width = 350 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const male_average = d3.mean(data, d => d.percentage_male);
    const female_average = 100 - male_average;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - 40;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // set the color scale
    const color = d3.scaleOrdinal()
        .range(["#5888B4", "#D3469D"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries({ Male: male_average, Female: female_average }))

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('slices')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .append("title")
        .text(d => `${d.data[1].toFixed(2)}%`);


    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) { return d.data[0] })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 17)
}