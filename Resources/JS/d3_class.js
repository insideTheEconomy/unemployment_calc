/*
unChart constructor takes two constructor arguments, the width and height of the chart.
.build( selector ) must be called with a selector for the parent element.
finally, set the baseline property to define the chart ranges/domains and draw the baseline;
setting the dataset property will update the chart and draw the new data.

*/


function unChart(_w , _h ){

	this.w = _w;
	this.h = _h;

	this.padding = {
		left: 60,
		right: 30,
		top: 30,
		bottom: 30
	}
	this.innerWidth = this.w - this.padding.left - this.padding.right;
	this.innerHeight = this.h - this.padding.top - this.padding.bottom;
	this.innerTop = this.h - this.padding.top;
	this.data = this.base = {"data":"default"};
	this.speed = 300;
	this.sliderValue = 0;
	this.dScale = d3.time.scale()
			.range([this.padding.left, this.w - this.padding.right])

	this.yScale = d3.scale.linear()
			.range([this.innerTop, this.padding.bottom]);

	


	this.xAxis = d3.svg.axis()
			  .scale(this.dScale)
			  .orient("bottom")
			  .ticks(5);

			//Define Y axis
	this.yAxis = d3.svg.axis()
			.scale(this.yScale)
			.orient("left")
			.ticks(5).tickFormat(function(t){return t+"%"})
			
	this.svg = null;
	this.sliderX = null;
	this.container = null;
	this.slideAxis = d3.svg.axis()
			  .scale(this.dScale)
			  .orient("bottom")
			  .ticks(5);
			
	this.line = d3.svg.line();
}

p = unChart.prototype;
		

p.build = function( sel ){
	sel = typeof sel !== 'undefined' ? sel : "body";
	this.container = d3.select(sel);
	this.svg = this.container
			.append("svg")
			.attr({
				"width": this.w,
				"height": this.h,
				"class" : "chart"
			})
	
	gutter = 5;
	clipPad = this.padding.left + gutter;	
	this.clip = this.svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("svg:rect")
		.attr("id", "clip-rect")
		.attr({x: clipPad  , y:0 })
		.attr({width: this.innerWidth - gutter, height:this.h })
		
	this.chartBody = this.svg.append("g")
		.attr("clip-path", "url(#clip)")
		
	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (this.h - this.padding.bottom) + ")")
		.call(this.xAxis);

	//Create Y axis
	this.svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + this.padding.left + ",0)")
		.call(this.yAxis);
		
	this.chartBody.append("path").attr("class"," line current");	
//	this.svg.append("path").attr("class"," line base");
	this.chartBody.append("path").attr("class"," line base");
	this.chartBody.append("circle").attr("class"," line base");

}
//define setter functions
Object.defineProperty(p, "dataset",{
	get: function(){return this.data},
	set: function(ds){
		this.data = ds;
		//console.log("DATASET RECEIVED");
		this.update();
		}});
		
Object.defineProperty(p, "baseline",{
	get: function(){return this.base},
	set: function(bl){
		this.base = bl;
		//console.log("DATASET RECEIVED");
		this.drawBase();
		}});


p.update = function(){
			
//	this.yScale.domain( d3.extent(this.data, function(d, i) { return parseFloat(d.value) }))
	_base = this.base;
	this.scaleMax = 	d3.max(this.data, function(d, i) { return Math.max( +d.value, +_base[i].value ) } );
	this.yScale.domain( 
		[0,this.scaleMax]
	//	d3.extent(this.base, function(d) { return +d.value}) 
	//	d3.extent([0,this.scaleMax])
		)
	
	
	this.dScale.domain(d3.extent(this.data, function(d){
		//d.jsDate = new new Date(d.date);
		return d.jsDate ;
	}))
	
	this.yAxis.scale(this.yScale);
	this.xAxis.scale(this.dScale);
	
	this.svg.select(".x.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.xAxis);
	
	this.svg.select(".y.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.yAxis);
		
	//finally, lines and dots!
	this.chartBody.select(".line.current")
				.datum(this.data)
				.transition()
		    	.duration(this.speed)
			//	.attr("class","line current")
				.attr("d", this.line);
				
	this.chartBody.select(".line.base")
				.datum(this.base)
				.transition()
		    	.duration(this.speed)
				.attr("d", this.line);
	this.sliderHandler(null, this.sliderValue);
	$.event.trigger({
				type: "SLIDER",
				observation: this.data[this.sliderValue],
				base: this.base[this.sliderValue]
			}); 
			
};

p.drawBase = function(){
	this.sliderValue = this.base.length-1;
	this.dScale.domain(d3.extent(this.base, function(d,i){
		return d.jsDate ;
	}))

	ds = this.dScale;
	ys = this.yScale;
	this.line
		.x(function(d){return ds(d.jsDate )})
		.y(function(d){return ys(d.value)}).interpolate("cardinal")
		
	
	
	//setup axes
	//  X axis
	this.svg.select(".x.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.xAxis);
	//Y axis
	this.svg.select(".y.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.yAxis);
	
	//Update Slider
	//console.log("Current Position : " + this.sliderValue);
	this.slide = d3.slider().min(0).max(this.base.length-1).value(this.base.length-1);
//	this.container.select(".d3-slider")
//		.remove();
		
	var self = this;

	this.sliderHandler = function(e, v){
		
		self.sliderValue = v;
		var dateClass;
		var sliderMid = self.slide.max()/2;
		
		if ( self.sliderValue >=  sliderMid) {
				dateClass = "left";
			}
			else{
				dateClass ="right";
			}
		console.log("dataTarget truthiness")
		console.log(typeof self.data[self.sliderValue] == 'undefined');
		var dataTarget = ( typeof self.data[self.sliderValue] == 'undefined' ) ? self.base : self.data;
		console.log(dataTarget);
		self.dateBody.html("<h1 class='"+dateClass+"'>"+dataTarget[self.sliderValue].jsDate.toLocaleDateString()+"</h1>");
		
		var xDate = self.dScale(dataTarget[v].jsDate);
		var yDate = self.yScale(dataTarget[v].value);
		
	
		self.date.transition().duration(60)
			.attr("y", yDate-15)
			.style("opacity",0).attr("x", xDate-150)
			.transition().duration(250)
			.style("opacity",1);
		

		
		$.event.trigger({
					type: "SLIDER",
					observation: self.data[v],
					base: self.base[v]
				});
	}
	
	this.container.append("div")
		.attr("class", "x axis slider")
		.style({
			width:this.innerWidth, 
			"margin-left":this.padding.left-1
			}).call(this.slide.value(this.base.length-1));
			this.slide.on("slide", self.sliderHandler);
			
	this.date = this.svg.append("foreignObject")
		.attr({
			"width":"300px",
			"height":"30px",
			//"x":"220","y":"220",
			"style":"color:white"
		})
	this.dateBody = this.date.append("xhtml:body").attr("class","foreign");
	

	
//	handle.append("div").attr("class","arrow left");
//	handle.append("div").attr("class","arrow right");
	this.drawArr();
	//add label
	this.svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", 6)
		.attr("x", -this.h/3)
	    .attr("dy", ".75em")
	   .attr("transform", "rotate(-90)")
	    .text("Unemployment Rate");
	
	//and axes, X axis
	this.svg.select(".x.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.xAxis);
	
	
	//Update Y axis
	this.svg.select(".y.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.yAxis);
	
	//finally, lines and dots!
	this.chartBody.select(".line.base")
				.datum(this.base)
				.transition()
		    	.duration(this.speed)
				.attr("d", this.line);	
	

	
			    
};

p.drawArr = function(){
	
	var stripPX = function(s){
		return s.substr(0, s.length -2 );
	}
	var handle = this.container.select(".d3-slider-handle")
	
	right = +stripPX(handle.style("width"));
	vOff = +stripPX(handle.style("height"))/2;
	gutt = 2;
	w = right/2-gutt;
	svH = this.innerHeight + vOff;
	hOff = this.innerHeight;
	svgMargin = -(hOff-vOff)
	var pad = 10;
	var pad2 = 2*pad;
	wide = right+pad2;
	
	hSVG = handle.append("svg").attr({
		width: wide,
		height: svH+pad2,
		"class": "handle",
	}).style("margin-top", svgMargin).style("margin-left", -pad-1);
	
/*	$p = $(".preset>defs");
	$h = $("svg.handle");
	$h.append($p); */
	fuzz = hSVG.append("filter")
	    .attr("id", "fuzz");
	
	fuzz.append("feGaussianBlur")
	    .attr("class","blurFilter").attr("stdDeviation", 5).attr("in","SourceGraphic").attr("");

		
		
	filter = hSVG.append("filter")
	    .attr("id", "glow");
	
	filter.append("feGaussianBlur")
	    .attr("class","blurFilter").attr("stdDeviation", 3).attr("in","SourceAlpha").attr("result","blurred")
	
	comTran = filter.append("feComponentTransfer").attr({
		in1:"blurred",
		result:"colored"
	})
	
	comTran.append("feFuncR").attr({
		type:"linear", slope:"-1", intercept:"1"
	})
	comTran.append("feFuncG").attr({
		type:"linear", slope:"-1", intercept:"1"
	})
	comTran.append("feFuncB").attr({
		type:"linear", slope:"-1", intercept:"1"
	})
	alpha = comTran.append("feFuncA").attr({
		type:"linear", slope:"1"
	})
	

	
	merge = filter.append("feMerge");
		merge.append("feMergeNode").attr("in","colored");
		merge.append("feMergeNode").attr("in","SourceGraphic");	
	
	
	poly = [{"x":pad+0, "y":hOff},
	        {"x":pad+w,"y":hOff-vOff},
	        {"x":pad+w,"y":svH}];

	poly2 = [{"x":pad+right, "y":hOff},
	        {"x":pad+right-w,"y":hOff-vOff},
	        {"x":pad+right-w,"y":svH}];
	
	hGrp = hSVG.append("g").attr("height","200")
	
	hGrp.append("polygon")
	    .data([poly])
	    .attr("points",function(d) { 
	        return d.map(function(d) { return [d.x,d.y].join(","); }).join(" ");});
	

	hGrp.append("polygon")
	    .data([poly2])
	    .attr("points",function(d) { 
	        return d.map(function(d) { return [d.x,d.y].join(","); }).join(" ");});
	
	hGrp.selectAll("polygon").attr(
		"class", "glowy arrow"
	);
	
/*	hSVG.append("line").attr({
		x1: pad+w+1, 
		y1: hOff,
		x2: pad+w+1, 
		y2: 0,
		"class": "pipe "
	})*/
	
	hSVG.append("rect").attr({
		x: pad+w+1, 
		y: 0,
		width:3,
		height:svH-vOff,
		"class": "pipe glowy"
	})
	
	
}



