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
    var allCircles = d3.selectAll(".circle_type");

    //Select all lines
    var allLines = d3.selectAll(".line_type");

    //Get selected type
    if(item[1].type != null) {

        selected.set("type", item[1].type);
        typeTemp = item[1].type;
       
    } else {

        selected.set("type", item[0][2]);
        typeTemp = item[0][2];

    }

    var clicked = getClickedTypeMarks(typeTemp, allCircles, allLines);

    //Save the clickedCircle and clickedLine
    clickedCircle = clicked[0];
    clickedLine = clicked[1];

    //Check to see if type was already selected
    if(clickedCircle.attr('opacity') == 1) {

        console.log("Unselecting... " + selected.get("type"));

        selected.set("type", "");
        updateIdioms(selected);

        //Reassign updated elements

        //Select all circles
        allCircles = d3.selectAll(".circle_type");

        //Select all lines
        allLines = d3.selectAll(".line_type");

        //Deselect type
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);

    } else {

        console.log("Selecting... " + selected.get("type"));

        updateIdioms(selected);

        //Reassign updated elements

        //Select all circles
        allCircles = d3.selectAll(".circle_type");

        //Select all lines
        allLines = d3.selectAll(".line_type");

        clicked = getClickedTypeMarks(typeTemp, allCircles, allLines);

        //Save the updated clickedCircle and clickedLine
        clickedCircle = clicked[0];
        clickedLine = clicked[1];

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

function handleGenderClick(event, item) {
    var gender = item.data[0];

    //Select all slices
    var allSlices = d3.selectAll(".slice");

    if (selected.get("gender") === gender) {

        console.log("Unselecting... " + gender);
        selected.set("gender", "");

        updateIdioms(selected);

        allSlices = d3.selectAll(".slice");

        allSlices.attr("stroke", "white")
            .attr('stroke-width', 1.1)
            .style("opacity", 1);
    }
    else {

        console.log("Selecting... " + gender);
        selected.set("gender", gender);

        updateIdioms(selected);

        allSlices = d3.selectAll(".slice");

        //Select gender
        allSlices.filter(function (d) {
            console.log(d.data[0])
            return gender !== d.data[0];
        })
            .style("opacity", 0.3)
            .style('stroke-opacity', '0');

        allSlices.filter(function (d) {
            return gender === d.data[0];
        })
            .attr("stroke", "black")
            .attr('stroke-width', 1.2);
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
        updateIdioms(selected);

        //Deselect type
        allBars.attr('opacity', 1.1);

    } else {

        updateIdioms(selected);
        
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

}

function reSelectGenderMarks() {
    var gender = selected.get("gender");
    

    //Select all slices
    var allSlices = d3.selectAll(".slice");
    
    allSlices.filter(function (d) {
        console.log(d.data[0])
        return gender !== d.data[0];
    })
        .style("opacity", 0.3)
        .style('stroke-opacity', '0');

    allSlices.filter(function (d) {
        return gender === d.data[0];
    })
        .attr("stroke", "black")
        .attr('stroke-width', 1.2);

}