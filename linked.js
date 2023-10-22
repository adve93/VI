// Create an empty Map
const selected = new Map();

// Add temp pairs to the Map
selected.set("type", "");
selected.set("sex", "");
selected.set("generation", -1);

function handleTypeClick(event, item) {

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
        selected.set("type", item[1].type);
        typeTemp = item[1].type;
       
        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
            });

    } else {
        selected.set("type", item[0][2]);
        typeTemp = item[0][2];

        clickedCircle = allCircles.filter(function (d) {
            return typeTemp === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return typeTemp === d[0][2];
            });
    }
    
    //Check to see if type was already selected
    if(clickedCircle.attr('opacity') == 1) {

        //Deselect type
        selected.set("type", "");
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);

    } else {

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
        .raise();
    } 

    updatePieChart();

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
            return item[1].type === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return item[1].type === d[0][2];
            });

    } else {

        typeTemp = item[0][2];
        clickedCircle = allCircles.filter(function (d) {
            return item[0][2] === d[1].type;
            });
        
        clickedLine = allLines.filter(function (d) {
            return item[0][2] === d[0][2];
        });

    }

    //Mark circle and line has overed
    clickedCircle.attr("fill", "red");
    clickedLine.style("stroke", "red");

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