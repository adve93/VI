function handleMouseClick(item) {

 
    d3.selectAll(".data")
        .each(function (d) {
            var currentItem = d3.select(this).attr("item");
            console.log(d3.select(this).style("opacity"));
            
            // Selected mark
            if (Array.isArray(d) && item === currentItem) {
                if (d3.select(this).style("opacity") === 1){

                }
                d3.select(this)
                .style("stroke-width", 2)
                .style("opacity", 1);

                d3.selectAll(".data").style("opacity", 1);

            // Other marks
            } else {
                d3.select(this)
                    .style("stroke-width", 0)
                    .style("opacity", 0.5);
            }
        });


    d3.selectAll(".line")
        .each(function (d) {
            var currentItem = d3.select(this).attr("item");

            d3.select(this)
                .style("stroke-width", 1)
                .style("opacity", 0.2);

            // Selected mark
            if (currentItem === item) {
                d3.select(this)
                    .style("stroke-width", 3)
                    .style("opacity", 1); // Change the line width when clicked
            }
        });
}