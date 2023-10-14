// Declare a variable to hold the loaded JSON data.
var globalData;

// Define margin and dimensions for the charts
const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
  
// Function to start the dashboard
function startDashboard() {

    d3.csv("pokemon_data.csv")
    .then((data) => {

        data.forEach((d) => {
            d.attack = +d.attack;
            d.speed = +d.speed;
        });
        
        globalData = data;

        //Create functions
        createBarChart(data);

    })
    .catch((error) => {
        // If there's an error while loading the CSV data, log the error.
        console.error("Error loading the CSV file:", error);
      });

}

// Function to create a bar chart
function createBarChart(data) {
    // Select the #barChart element and append an SVG to it
    currentData = data.filter(function (d) {
        return d.generation == 1;
    });
    console.log(d3.max(data, (d) => d.attack));
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
    .domain([d3.min(data, (d) => d.speed), d3.max(data, (d) => d.speed)])
    .range([0, width]);

    const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.attack), d3.max(data, (d) => d.attack)])
    .range([height, 0]);

    // Add circles to the scatter plot representing each country
    svg
    .selectAll(".circle")
    .data(currentData, (d) => d.name)
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d.speed))
    .attr("cy", (d) => yScale(d.attack))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .attr("stroke", "black")

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