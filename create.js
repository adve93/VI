//Function to create a bar chart
function createBubbleChart(data) {

  //Calculate average values for height_m and base_egg_steps by type
  const averageData = d3.rollup(data, 
      group => ({
          averageHeight: d3.mean(group, d => d.height_m),
          averageBaseEggSteps: d3.mean(group, d => d.base_egg_steps),
          type: group[0].type1,
          typeLength: group.length
      }), 
      d => d.type1
  );

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

  //Selecting HTML element and appeding svg element
  const svg = d3.select("#bubbleChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  //Define scales for x and y
  const xScale = d3.scaleLinear()
      .domain([0, d3.max(averageData.values(), d => d.averageBaseEggSteps)])
      .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(averageData.values(), d => d.averageHeight)])
      .range([height - margin.bottom, margin.top]);

  //Add circles to the scatter plot representing each country
  svg.selectAll(".circle")
      .data(averageData)
      .enter()
      .append("circle")
      .attr("class", "circle data")
      .attr("cx", d => xScale(d[1].averageBaseEggSteps))
      .attr("cy", d => yScale(d[1].averageHeight))
      .attr("r", d => Math.sqrt(d[1].typeLength))
      .attr("fill", d => typeColors[d[1].type])
      .append("title")
      .text( d =>
          `Type: ${d[1].type}\nN Pokemon: ${d[1].typeLength}\nAverage Steps:${Math.round(d[1].averageBaseEggSteps)}\nAverage Height:${Math.round(d[1].averageHeight*10)/10}`
      );


  //Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

  //Label the axes
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.top - 20)
    .style("text-anchor", "middle")
    .text("Steps by type");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 40)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height by type");

}