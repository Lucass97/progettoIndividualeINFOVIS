
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
// append the svg object to the body of the page

var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "lightBlue");

var boatWidth = 32;
var boatHeight = 32;
  

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);



function drawAxes(max_x, max_y) {


  // Add X axis
  x.domain([0, max_x + boatWidth]);
  svg.append("g")
    .attr("class", "myXaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "1")

  // Add Y axis
  y.domain([0, max_y + boatHeight]);
  svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));


  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 30) + ")")
    .style("text-anchor", "middle")
    .text("Premi il tasto N per andare avanti e il tasto P per tornare indietro");

   // text label for the y axis
   /*
   svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (height / 2))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("Asse Y");
   */

}

function drawDots(data) {


  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .transition()
    .delay(function (d, i) { return (i * 3) })
    .duration(2000)
    .attr("cx", function (d) { return x(d[0]); })
    .attr("cy", function (d) { return y(d[1]); })
    .attr("r", 5)
    .style("fill", "#69b3a2");


}

function drawBoats(data) {
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append('image')
    .attr("xlink:href", function (d) { return "kayak.svg"})
    .attr("x", function (d) { return x(d[0]) - boatWidth/2})
    .attr("y", function (d) { return y(d[1]) - boatHeight/2})
    .attr("width", boatWidth)
    .attr("height", boatHeight);
}

function updateAxes(max_x, max_y) {
  x.domain([0, max_x + boatWidth]);
  y.domain([0, max_y + boatHeight]);

  svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));


  svg.select(".myYaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisLeft(y));
}

function updateDots(data) {

  svg.selectAll("circle")
    .data(data)
    .transition()
    .delay(function (d, i) { return (i * 3) })
    .duration(2000)
    .attr("cx", function (d) { return x(d[0]); })
    .attr("cy", function (d) { return y(d[1]); });

}

function updateBoats(data) {

  svg.selectAll("image")
    .data(data)
    .transition()
    .delay(function (d, i) { return (i * 3) })
    .duration(2000)
    .attr("x", function (d) { return x(d[0]) - boatWidth/2; })
    .attr("y", function (d) { return y(d[1]) - boatHeight/2; });

}

function selectVariables(data, i) {
  result = []
  if (i == 1)
    data.forEach(row => { result.push([row["x1"], row["y1"]]) });
  if (i == 2)
    data.forEach(row => { result.push([row["x2"], row["y2"]]) });
  if (i == 3)
    data.forEach(row => { result.push([row["x3"], row["y3"]]) });
  return result;
}



d3.json("data.json").then(function (data) {

  cursor = 3;
  selectedData = selectVariables(data, cursor);
  max_x = d3.max(selectedData, d => d[0]);
  max_y = d3.max(selectedData, d => d[1]);
  drawAxes(max_x, max_y);
  drawBoats(selectedData);

  d3.select("body").on("keydown", function (event, d) {
    console.log(event);
    if (event.key == "n")
      cursor++;
      if (cursor > 3)
        cursor = 1
    if (event.key == "p")
      cursor--;
      if (cursor < 1)
        cursor = 3

    if(( event.key == "n" ) | (event.key == "p")){
      selectedData = selectVariables(data, cursor);
      max_x = d3.max(selectedData, d => d[0]);
      max_y = d3.max(selectedData, d => d[1]);
      updateAxes(max_x, max_y)
      updateBoats(selectedData);
      }
  })

});



