//Declare a variable to hold the loaded JSON data.
var globalData;

//Define margin and dimensions for the charts
const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
};
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

//Color scale for types
const typeColors = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water": "#6390F0",
    "electric": "#F7D02C",
    "grass": "#7AC74C",
    "ice": "#96D9D6",
    "fighting": "#C22E28",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "flying": "#A98FF3",
    "psychic": "#F95587",
    "bug": "#A6B91A",
    "rock": "#B6A136",
    "ghost": "#735797",
    "steel": "#B7B7CE",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "fairy": "#D685AD"
};
  
//Function to start the dashboard
function startDashboard() {

    d3.csv("pokemon_data.csv")
    .then((data) => {

        //Data is stored as strings. This piece of the code makes sure numbers are read as integers.
        data.forEach((d) => {
            d.attack = +d.attack;
            d.spAttack = +d.sp_attack;
            d.defense = +d.defense;
            d.sp_defense = +d.sp_defense;
            d.hp = +d.hp;
            d.speed = +d.speed;
            d.base_egg_steps = +d.base_egg_steps;
            d.height_m = +d.height_m;
            d.weight_kg = +d.weight_kg;
        });
        
        globalData = data;

        //Create functions
        createBubbleChart(data);
        createParallelCoordinatesPlot(data);
        createPieChart(data);
        createChordDiagram(data);

    })
    .catch((error) => {
        //If there's an error while loading the CSV data, log the error.
        console.error("Error loading the CSV file:", error);
      });

}
