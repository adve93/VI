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
    var typeIndex;

    //Select all chords
    var allChords = d3.selectAll(".chord-type");

    //Select all circles
    var allCircles = d3.selectAll(".circle_type");

    //Select all lines
    var allLines = d3.selectAll(".line_type");

    //Get selected type
    if(item[1].type != null) {
        console.log("1")
        selected.set("type", item[1].type);
        typeTemp = item[1].type;
        typeIndex  = typePos[typeTemp];
       
    } else if(item[0][2] != null){
        console.log("2")
        selected.set("type", item[0][2]);
        typeTemp = item[0][2];
        typeIndex  = typePos[typeTemp];

    } else {
        console.log("3")
        selected.set("type", item);
        typeTemp = item;
        typeIndex  = typePos[typeTemp];

    }

    var clicked = getClickedTypeMarks(typeTemp, allCircles, allLines);

    //Save the clickedCircle and clickedLine
    clickedCircle = clicked[0];
    clickedLine = clicked[1];

    //Filter chords of said arc
    var SelectedChords = allChords.filter(function (d) {
        return typeIndex === d.source.index || typeIndex === d.target.index;
    });

    //Check to see if type was already selected
    if(clickedCircle.attr('opacity') == 1) {

        unselectType(allCircles, allLines, allChords);

    } else {

        console.log("Selecting... " + gender);

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

        allChords.attr('opacity', 0.07);

        SelectedChords.attr('opacity', 1);

    } 

    updatePieChart(selected);
    updateBarChart(selected);
    
}



function handleGenderClick(event, item) {
    var gender = item.data[0];

    //Select all slices
    var allSlices = d3.selectAll(".slice");

    if (selected.get("gender") === gender) {

        unselectGender(allSlices);
    }
    else {

        console.log("Selecting... " + gender);
        selected.set("gender", gender);

        //Select gender
        allSlices.filter(function (d) {
            return gender !== d.data[0];
        })
            .attr("stroke", "white")
            .attr('stroke-width', 1.1)
            .style('stroke-opacity', '0')
            .style("opacity", 0.3);

        allSlices.filter(function (d) {
            return gender === d.data[0];
        })
            .attr("stroke", "black")
            .attr('stroke-width', 1.2)
            .style('stroke-opacity', '1')
            .style("opacity", 1);
            
    }

    updateBubbleChart(selected);
    updateChordDiagram(selected);
    updateParallelCoordinatesPlot(selected);
    updateBarChart(selected);
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

        unselectGeneration(allBars);

    } else {
        
        //Select type
        allBars.filter(function (d) {
            return genTemp !== d.generation;
            })
            .attr('opacity', 0.3);
        

        clickedBar.attr('opacity', 1)

    } 

    updateBubbleChart(selected);
    updateChordDiagram(selected);
    updateParallelCoordinatesPlot(selected);
    updatePieChart(selected);
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
    clickedBar.attr("fill", "gray");
    
}

function handleMouseOverType(event, item) {

    //Initialize variables
    var hoveredCircle;
    var hoveredLine;
    var hoveredRibbon;
    var typeTemp;

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    if(item[1].type != null) {
        
        typeTemp = item[1].type;

    } else {

        typeTemp = item[0][2];

    }

    var hovered = getClickedTypeMarks(typeTemp, allCircles, allLines);

    //Save the hoveredCircle and hoveredLine
    hoveredCircle = hovered[0];
    hoveredLine = hovered[1];

    //Mark circle and line has hovered
    hoveredCircle.attr("fill", "red")
    .raise();
    hoveredLine.style("stroke", "red")
    .raise();

}

function handleMouseOutType(event, item) {

    //Initialize variables
    var hoveredCircle;
    var hoveredLine;
    var typeTemp;

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    if(item[1].type != null) {
        
        typeTemp = item[1].type;

    } else {

        typeTemp = item[0][2];

    }

    var hovered = getClickedTypeMarks(typeTemp, allCircles, allLines);

    //Save the hoveredCircle and hoveredLine
    hoveredCircle = hovered[0];
    hoveredLine = hovered[1];

    //Mark circle and line has hovered
    hoveredCircle.attr("fill", typeColors[typeTemp]);
    hoveredLine.style("stroke", typeColors[typeTemp]);

}

function handleMouseOverGender(event, item) {

    var gender = item.data[0];

    //Select all slices
    var allSlices = d3.selectAll(".slice");

    // Hovered slice
    allSlices.filter(function (d) {
        return gender === d.data[0];
    })
        .attr("fill", "red");

}

function handleMouseOutGender(event, item) {

    var gender = item.data[0];

    //Select all slices
    var allSlices = d3.selectAll(".slice");

    // Hovered slice
    allSlices.filter(function (d) {
        return gender === d.data[0];
    })
        .attr("fill", genderColors[gender]);

}


function getClickedTypeMarks(type, circles, lines) {

    clickedCircle = circles.filter(function (d) {
        return type === d[1].type;
    });

    clickedLine = lines.filter(function (d) {
        return type === d[0][2];
    });

    return [clickedCircle, clickedLine];
}

function reSelectTypeMarks() {

    //Select all circles
    var allCircles = d3.selectAll(".circle_type");

    //Select all lines
    var allLines = d3.selectAll(".line_type");

    var allChords = d3.selectAll(".chord-type");

    var typeIndex = typePos[selected.get("type")];

    //Filter chords of said arc
    var SelectedChords = allChords.filter(function (d) {
        return typeIndex === d.source.index || typeIndex === d.target.index;
    });

    var clicked = getClickedTypeMarks(selected.get("type"), allCircles, allLines);

    allCircles.attr('opacity', 0.3);
    
    allLines.attr('opacity', 0.02)
        .attr('stroke-width', 0.2);

    //Save the clickedCircle and clickedLine
    clickedCircle = clicked[0];
    clickedLine = clicked[1];

    clickedCircle.attr('opacity', 1)
        .raise();

    clickedLine.attr('opacity', 1)
        .attr('stroke-width', 1)
        .raise();

    allChords.attr('opacity', 0.07);

    SelectedChords.attr('opacity', 1);

}

function reSelectGenderMarks() {
    var gender = selected.get("gender");


    //Select all slices
    var allSlices = d3.selectAll(".slice");

    allSlices.filter(function (d) {
        console.log(d.data[0])
        return gender !== d.data[0];
    })
        .attr("stroke", "white")
        .attr('stroke-width', 1.1)
        .style('stroke-opacity', '0')
        .style("opacity", 0.3);

    allSlices.filter(function (d) {
        return gender === d.data[0];
    })
        .attr("stroke", "black")
        .attr('stroke-width', 1.2)
        .style('stroke-opacity', '1')
        .style("opacity", 1);
}

function unselectType(allCircles, allLines, allChords) {
    
    console.log("Unselecting... " + selected.get("type"));

    selected.set("type", "");

    //Select all circles
    allCircles = d3.selectAll(".circle_type");

    //Select all lines
    allLines = d3.selectAll(".line_type");

    allChords = d3.selectAll(".chord-type");

    //Deselect type
    allCircles.attr('opacity', 1.1);
    allChords.attr('opacity', 1.1);
    allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);

}

function unselectGender(allSlices) {

    console.log("Unselecting... " + gender);
        selected.set("gender", "");

        allSlices.attr("stroke", "white")
            .attr('stroke-width', 1.1)
            .style('stroke-opacity', '1')
            .style("opacity", 1);

}

function unselectGeneration(allBars) {

    selected.set("generation", "");

    //Deselect type
    allBars.attr('opacity', 1.1);

}

// Function to reset the selected map to its original state
function resetSelectedMap() {

    selected.set("type", "");
    selected.set("gender", "");
    selected.set("generation", "");

    //Select all circles
    const allCircles = d3.selectAll(".circle_type");

    //Select all lines
    const allLines = d3.selectAll(".line_type");

    //Select all bars
    const allBars = d3.selectAll(".legendary_bar");

    //Select all slices
    const allSlices = d3.selectAll(".slice");

    updateBubbleChart(selected);
    updateChordDiagram(selected);
    updateParallelCoordinatesPlot(selected);
    updatePieChart(selected);
    updateBarChart(selected);

    unselectType(allCircles, allLines);
    unselectGender(allSlices);
    unselectGeneration(allBars);
    
}


