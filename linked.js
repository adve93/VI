//Create an empty Map
var selected = new Map();

//Add temp pairs to the Map
selected.set("type", "");
selected.set("gender", "");
selected.set("generation", "");

function handleTypeClick(event, item) {

    //Initialize variables
    var clickedCircle;
    var clickedLine;
    var typeTemp;

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    //Get selected type
    if(item[1].type != null) {

        selected.set("type", item[1].type);
        typeTemp = item[1].type;
       
    } else {

        selected.set("type", item[0][2]);
        typeTemp = item[0][2];

    }

    //Save the clickedCircle and clickedLine
    clickedCircle = allCircles.filter(function (d) {
        return typeTemp === d[1].type;
    });
    
    clickedLine = allLines.filter(function (d) {
        return typeTemp === d[0][2];
    });
    //Check to see if type was already selected
    if(clickedCircle.attr('opacity') == 1) {

        unselecting();

        //Deselect type
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);

    } else {

        selecting();

        //Select type
        allCircles.filter(function (d) {
            return typeTemp !== d[1].type;
            })
            .attr('opacity', 0.3);
        
        allLines.filter(function (d) {
            return typeTemp !== d[0][2];
            })
            .attr('opacity', 0.02)
            .attr('stroke-width', 0.2);
        

        clickedCircle.attr('opacity', 1)
        .raise();

        clickedLine.attr('opacity', 1)
        .attr('stroke-width', 1)
        .raise();

    } 
}

function handleGenerationClick(event, item) {

    //Initialize variables
    var clickedBar;
    var genTemp;

    //Select all circles
    const allBars = d3.selectAll(".legendary_bar");

    selected.set("generation", item.generation);
    genTemp = item.generation;
       

    //Save the clickedCircle and clickedLine
    clickedBar = allBars.filter(function (d) {
        return genTemp === d.generation;
    });
    
    //Check to see if type was already selected
    if(clickedBar.attr('opacity') == 1) {

        selected.set("generation", "");

        //Deselect type
        allBars.attr('opacity', 1.1);

    } else {

        //Select type
        allBars.filter(function (d) {
            return genTemp !== d.generation;
            })
            .attr('opacity', 0.3);
        

        clickedBar.attr('opacity', 1)

    } 
}

function handleMouseOverGeneration(event, item) {

    //Initialize variables
    var clickedBar;
    var genTemp;

    //Select all bars
    const allBars = d3.selectAll(".legendary_bar");

    //Save the clickedBar
    genTemp = item.generation;
    clickedBar = allBars.filter(function (d) {
        return genTemp === d.generation;
        });


    //Mark circle and line has overed
    clickedBar.attr("fill", "red");

}

function handleMouseOutGeneration(event, item) {

    //Initialize variables
    var clickedBar;
    var genTemp;

    //Select all bars
    const allBars = d3.selectAll(".legendary_bar");

    //Save the clickedBar
    genTemp = item.generation;
    clickedBar = allBars.filter(function (d) {
        return genTemp === d.generation;
        });


    //Mark circle and line has overed
    clickedBar.attr("fill", "steelblue");
    
}

function handleMouseOverType(event, item) {

    //Initialize variables
    var clickedCircle;
    var clickedLine;
    var typeTemp;

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    //Save the clickedCircle and clickedLine
    if(item[1].type != null) {
        
        typeTemp = item[1].type;
        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
            });

    } else {

        typeTemp = item[0][2];
        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
        });

    }

    //Mark circle and line has overed
    clickedCircle.attr("fill", "red")
    .raise();
    clickedLine.style("stroke", "red")
    .raise();

}

function handleMouseOutType(event, item) {

    //Initialize variables
    var clickedCircle;
    var clickedLine;
    var typeTemp;

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    //Save the clickedCircle and clickedLine
    if(item[1].type != null) {
        
        typeTemp = item[1].type;
        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
            });

    } else {

        typeTemp = item[0][2];
        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
        });

    }

    //Mark circle and line has overed
    clickedCircle.attr("fill", typeColors[typeTemp]);
    clickedLine.style("stroke", typeColors[typeTemp]);

}


function unselecting() {
    console.log("Unselecting... " + selected.get("type"));
    selected.set("type", "");
    updateIdioms(selected);
}

function selecting() {
    console.log("Selecting... " + selected.get("type"));
    updateIdioms(selected);
}