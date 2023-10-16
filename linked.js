function handleMouseClick(item) {

    var selectedMark = null;
    
    d3.selectAll(".data")
        .each(function (d) {
            var currentItem = d3.select(this).attr("item");
            console.log(d3.select(this).style("opacity"));
            

            // Check if the mark is selected
            if (Array.isArray(d) && item === currentItem) {
                d3.select(this)
                    .style("stroke-width", 2)
                    .style("opacity", 1);
                selectedMark = this; // Update the selected mark
            } else {
                d3.select(this)
                    .style("stroke-width", 0)
                    .style("opacity", selectedMark === this ? 1 : 0.5);
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