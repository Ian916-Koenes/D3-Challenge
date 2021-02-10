// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // function used for updating x-scale var upon click on axis label
  function xScale(povertyData) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(povertyData, d => d.poverty))
      .range([0, width]);
  
    return xLinearScale;
  
  }
  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d.poverty));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup) {

  var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d => `<strong>${d.state}</strong><br>healthcare: ${d.healthcare}<br>poverty: ${d.poverty}`);

  circlesGroup.call(tool_tip);

  chartGroup.selectAll(".transStateCircle")
    .on("mousemove", function (d) { console.log(`d: ${JSON.stringify(d)}`); tool_tip.show(d, this);})
    .on("mouseover", function (d) { console.log(`d: ${JSON.stringify(d)}`); tool_tip.show(d, this);})
    .on("mouseout", function (d) { tool_tip.hide(d);});


  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData, err) {
  if (err) throw err;

// parse data
povertyData.forEach(function(data) {
  data.healthcare = +data.healthcare;
  data.poverty = +data.poverty;
});

var xLinearScale = xScale(povertyData);

// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(povertyData, d => d.healthcare)])
  .range([height, 0]);
  
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

 // append y axis
 chartGroup.append("g")
 .call(leftAxis);

 // append initial circles
 var circlesGroup = chartGroup.selectAll("circle")
 .data(povertyData)
 .enter()
 .append("circle")
 .attr("class", "stateCircle")
 .attr("cx", d => xLinearScale(d.poverty))
 .attr("cy", d => yLinearScale(d.healthcare))
 .attr("r", 20)
 .attr("fill", "blue")
 .attr("opacity", ".5");

// append state abbreviation 
var textGroup = chartGroup.selectAll(".stateText")
.data(povertyData)
.enter()
.append("text")
.attr("class", "stateText")
.attr("x", d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.healthcare))
.style("font-size", "14px")
  .style("text-anchor", "middle")
  .attr("fill-opacity", 0.1)
  .text(d => d.abbr)
.attr("fill-opacity", 1);

// append initial circles
var transCirclesGroup = chartGroup.selectAll(".transStateCircle")
.data(povertyData)
.enter()
.append("circle")
.attr("class", "transStateCircle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", 20)
.attr("fill", "blue")
.attr("opacity", "0");

// Create group for two x-axis labels
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.classed("active", true)
.text("In Poverty (%)");

// append y axis
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("active", true)
.text("Lacks Healthcare (%)");

// updateToolTip function above csv import
var transCirclesGroup = updateToolTip(transCirclesGroup);

}); 








