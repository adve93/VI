function handleOpacityCircle(event, item) {

    //Select all elements with the class "circle_type" using D3.js
    const allCircles = d3.selectAll(".circle_type");

    //Select all elements with the class "line_type" using D3.js
    const allLines = d3.selectAll(".line_type");

    //Save the clickedCircle
    const clickedCircle = allCircles.filter(function (d) {
        return item[1].type === d[1].type;
        });
    
    const clickedLine = allLines.filter(function (d) {
        return item[1].type === d[0][2];
        });
    
    if(clickedCircle.attr('opacity') == 1) {
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);
    } else {
        //Filter and change the opacity for non-selected circles
        allCircles.filter(function (d) {
            return item[1].type !== d[1].type;
            })
            .attr('opacity', 0.3);
        
        //Filter and change the opacity for non-selected lines
        allLines.filter(function (d) {
            return item[1].type !== d[0][2];
            })
            .attr('opacity', 0.02)
            .attr('stroke-width', 0.2);

        //Change the opacity for the selected circle
        clickedCircle.attr('opacity', 1)
        .raise();

        //Change the opacity for the selected circle
        clickedLine.attr('opacity', 1)
        .raise();
    } 

}

function handleOpacityLines(event, item) {

    //Select all elements with the class "circle_type" using D3.js
    const allCircles = d3.selectAll(".circle_type");

    //Select all elements with the class "line_type" using D3.js
    const allLines = d3.selectAll(".line_type");

    //Save the clickedCircle
    const clickedCircle = allCircles.filter(function (d) {
        return item[0][2] === d[1].type;
        });
    
    const clickedLine = allLines.filter(function (d) {
        return item[0][2] === d[0][2];
        });
    
    if(clickedCircle.attr('opacity') == 1) {
        allCircles.attr('opacity', 1.1);
        allLines.attr('opacity', 1.1)
                .attr('stroke-width', 1);
    } else {
        //Filter and change the opacity for non-selected circles
        allCircles.filter(function (d) {
            return item[0][2] !== d[1].type;
            })
            .attr('opacity', 0.3);
        
        //Filter and change the opacity for non-selected lines
        allLines.filter(function (d) {
            return item[0][2] !== d[0][2];
            })
            .attr('opacity', 0.02)
            .attr('stroke-width', 0.2);

        //Change the opacity for the selected circle
        clickedCircle.attr('opacity', 1)
        .raise();

        //Change the opacity for the selected circle
        clickedLine.attr('opacity', 1)
        .raise();
    } 


}