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
            d.base_egg_steps = +d.base_egg_steps;
            d.height_m = +d.height_m;
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

    // Calculate average values for height_m and base_egg_steps by type
    const averageData = d3.rollup(data, 
        group => ({
            averageHeight: d3.mean(group, d => d.height_m),
            averageBaseEggSteps: d3.mean(group, d => d.base_egg_steps),
            type: group[0].type1
        }), 
        d => d.type1
    );
    
    // Color scale for types
    const typeColors = {
        "Normal": "#A8A77A",
        "Fire": "#EE8130",
        "Water": "#6390F0",
        "Electric": "#F7D02C",
        "Grass": "#7AC74C",
        "Ice": "#96D9D6",
        "Fighting": "#C22E28",
        "Poison": "#A33EA1",
        "Ground": "#E2BF65",
        "Flying": "#A98FF3",
        "Psychic": "#F95587",
        "Bug": "#A6B91A",
        "Rock": "#B6A136",
        "Ghost": "#735797",
        "Steel": "#B7B7CE",
        "Dragon": "#6F35FC",
        "Dark": "#705746",
        "Fairy": "#D685AD"
    };

    //Selecting HTML element and appeding svg element
    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales for x and y
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageBaseEggSteps)])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(averageData.values(), d => d.averageHeight)])
        .range([height - margin.bottom, margin.top]);

    // Add circles to the scatter plot representing each country
    svg.selectAll(".circle")
        .data(averageData)
        .enter()
        .append("circle")
        .attr("class", "circle data")
        .attr("cx", d => xScale(d[1].averageBaseEggSteps))
        .attr("cy", d => yScale(d[1].averageHeight))
        .attr("r", 5)
        .attr("fill", d => typeColors[d[1].type])

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);
}