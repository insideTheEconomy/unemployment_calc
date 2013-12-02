function unChart(_w , _h ){
//	this.w = typeof _w !== 'undefined' ? _w : 1024;
//	this.h = typeof _h !== 'undefined' ? _h : 768;
	this.w = _w;
	this.h = _h;

	this.padding = {
		left: 30,
		right: 30,
		top: 30,
		bottom: 30
	}
	this.innerWidth = this.w - this.padding.left - this.padding.right;
	this.innerHeight = this.h - this.padding.top - this.padding.bottom;
	this.innerTop = this.h - this.padding.top;
	this.data = {"data":"default"};
	this.speed = 300;
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
			.ticks(5);
	this.svg = null;
	this.sliderX = null;
	this.container = null;
	this.slideAxis = d3.svg.axis()
			  .scale(this.dScale)
			  .orient("bottom")
			  .ticks(5);
			
	
}

p = unChart.prototype;

p.getInfo = function(){
	return this.w+" , "+this.h+ " : "+this.padding.left;
}


		

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
	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (this.h - this.padding.bottom) + ")")
		.call(this.xAxis);

	//Create Y axis
	this.svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + this.padding.left + ",0)")
		.call(this.yAxis);
	this.svg.append("path").attr("class","line");
	

	
	this.slide = d3.slider();
	this.container.append("div")
		.attr("class", "x axis")
		.style({
			width:this.innerWidth, 
			"margin-left":this.padding.left
			}).call(this.slide);
			

	


	
	this.slide.on("slide", function(evt, value) {
	  console.log(value);
	})
	
}

Object.defineProperty(p, "dataset",{
	get: function(){return this.data},
	set: function(ds){
		this.data = ds;
		air.trace("DATASET RECEIVED");
		this.update();
		}});
	
p.update = function(){
	
	ds = this.dScale;
	ys = this.yScale;
	sv = this.svg;
	
	line = d3.svg.line()
			.x(function(d){return ds(d.jsDate )})
			.y(function(d){return ys(d.value)}).interpolate("basis");
	
	//update domains
	
	ds.domain(d3.extent(this.data, function(d,i){
		//d.jsDate = new new Date(d.date);
		return d.jsDate ;
	}))
	
	
	ys.domain([0, d3.max(this.data, function(d) { return d.value; })]);
	//and axes
	//Update Slider
	this.slide = d3.slider().min(0).max(this.data.length);
	this.container.select(".d3-slider")
		.remove();
	this.container.append("div")
		.attr("class", "x axis")
		.style({
			width:this.innerWidth, 
			"margin-left":this.padding.left
			}).call(this.slide);
			this.slide.on("slide", function(e,v){});
		
	sv.select(".x.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.xAxis);
	
	
	//Update Y axis
	sv.select(".y.axis")
    	.transition()
    	.duration(this.speed)
		.call(this.yAxis);
	
	//finally, lines and dots!
	sv.select(".line")
				.datum(this.data)
				.transition()
		    	.duration(this.speed)
				.attr("class","line")
				.attr("d", line);

	var circ = sv.selectAll("circle")
				.data(this.data);
	circ
				.enter()
				.append("circle")
				
	circ
			.transition()
	    	.duration(this.speed)
			.delay(function(d, i) { return i / 700 * 800; })
			.attr("cx", function(d,i) {
				return ds(d.jsDate );
			})
			.attr("cy", function(d) {
				return ys(d.value);
			})
			.attr("r", function(d) {
				return 1;
			});
	
}


