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
        createBubbleChart(data);

    })
    .catch((error) => {
        // If there's an error while loading the CSV data, log the error.
        console.error("Error loading the CSV file:", error);
      });

}
