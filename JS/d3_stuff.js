var d3vars = {};
var margin ={ top:20, right:20, bottom: 30, left: 50 };
var width = 640 - margin.left - margin.right;
var height = 480 - margin.top - margin.bottom;

//var scaleX = d3.time.scale()
//					.range([0,width]);
var scaleX = d3.scale.linear()
					.range([0,width]);
var scaleY = d3.scale.linear()
					.range([height, 0]);

var xAxis = d3.svg.axis().scale(scaleX).orient("bottom");
var yAxis = d3.svg.axis().scale(scaleY).orient("left");

var line = d3.svg.line()
	.x(function(d,i) { return scaleX(Date(i))})
	.y(function(d) { return scaleY(d.value)})

var svgCon = d3.select("body").append("svg")
	.attr({"width":width, "height":height})
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

scaleX.domain(d3.extent(obs_json,function(d,i){ return i;}));
scaleY.domain(d3.extent(obs_json,function(d){ return d.value;}));

svgCon.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svgCon.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svgCon.append("path")
      .datum(obs_json)
      .attr("class", "line")
      .attr("d", line);