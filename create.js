// Function to create a bar chart
function createBarChart(data) {
    // Select the #barChart element and append an SVG to it
    const svg = d3
      .select("#testBarChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create x and y scales for the bar chart
    const xScale = d3
    .scaleLinear()
    .domain(data.map((d) => d.speed))
    .range([0, width])
    .padding(0.2);

    const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.attack))
    .range([0, height])
    .padding(0.2);

    // Append x and y axes to the chart
    svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

    svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
}