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

        console.log("Unselecting... " + selected.get("type"));

        //Deselect type
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);

    } else {

        console.log("Selecting... " + selected.get("type"));

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

    updateIdioms(selected);
}

function handleGenderClick(event, item){
    var gender = item.data[0];

    //Select all slices
    const allSlices = d3.selectAll(".slices");

    if(selected.get("gender") === gender) {

        console.log("Unselecting... " + gender);
        selected.set("gender", "");
    }
    else {

        console.log("Selecting... " + gender);
        selected.set("gender", gender);
    }

    updateIdioms(selected);

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