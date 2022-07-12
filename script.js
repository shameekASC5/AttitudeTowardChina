var svg = d3.select("div#svg-container")
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 1000 500")
   .classed("svg-content", true);

d3.select("svg"),
   margin = {top: 15, right: 15, bottom: 20, left: 50},
   width =  1000 - margin.left - margin.right,
   height = 500 - margin.top - margin.bottom;
   //  width = +svg.attr("width") - margin.left - margin.right,
   //  height = +svg.attr("height") - margin.top - margin.bottom;

// set graph scale
var x = d3.scaleTime().range([margin.left, width - margin.right])
var y = d3.scaleLinear().rangeRound([height-margin.bottom, margin.top]);

var USA_primary = "#0099C5";
var PRC_primary = "#ff0000";
var PRC_secondary = "#73C6B6";
var USA_secondary = "#8E44AD";

var strokeWidth = 3;
var animationDuration = 5;

// animates the drawing of line
function animateSolidLine(path) {
   // Derived From: https://www.visualcinnamon.com/2016/01/animating-dashed-line-d3/
   let length = path.node().getTotalLength();
   // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
   path.attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .duration(animationDuration*1000);
      // .on("end", () => setTimeout(repeat, 1000)); // this will repeat the animation after waiting 1 second
};

function animateDashedLine(path, dashing) {
   // Derived From: https://www.visualcinnamon.com/2016/01/animating-dashed-line-d3/
   let length = path.node().getTotalLength();
   let dashLength = dashing.split(/[\s,]/)
      .map(function (a) { return parseFloat(a) || 0 })
      .reduce(function (a, b) { return a + b });
   //How many of these dash patterns will fit inside the entire path?
   let dashCount = Math.ceil( length / dashLength );

   //Create an array that holds the pattern as often so it will fill the entire path
   let newDashes = new Array(dashCount).join( dashing + " " );
   let dashArray = newDashes + " 0, " + length;
   path.attr("stroke-dashoffset", length)
      .attr("stroke-dasharray", dashArray)
      .transition()
      .duration(animationDuration*1000)
      .ease(d3.easeLinear)
      .attr("stroke-linecap","square")
      .attr("stroke-dashoffset", 0);
}

function animateDottedLine(path, dashing) {
   // Derived From: https://www.visualcinnamon.com/2016/01/animating-dashed-line-d3/
   let length = path.node().getTotalLength();
   
   let dashLength = dashing.split(/[\s,]/)
      .map(function (a) { return parseFloat(a) || 0 })
      .reduce(function (a, b) { return a + b });
   //How many of these dash patterns will fit inside the entire path?
   let dashCount = Math.ceil( length / dashLength );

   //Create an array that holds the pattern as often so it will fill the entire path
   let newDashes = new Array(dashCount).join( dashing + " " );
   let dashArray = newDashes + " 0, " + length;
   path.attr("stroke-dashoffset", length)
      .attr("stroke-dasharray", dashArray)
      .transition()
      .duration(animationDuration*1000)
      .ease(d3.easeLinear)
      .attr("stroke-linecap","round")
      .attr("stroke-dashoffset", 0);
}

// receives parallel arrays lines and colors to create path on SVG graph
function drawLines(data, lines, colors, lineNames, animateLines = true, legYPos = 30) {
   let count = 0;
   // Handmade legend
   let legXPos = 100;
   // let legYPos = 130;
   let textOffsetX = 10;
   var paths = Array(lines.length);
   
   for (let i = 0; i < lines.length; i++) {
      count++;
      // solid line
      if (count == 1 || lines.length <= 2)   {
         paths.push(graph.append("path")
            .datum(data)
            .attr("fill-opacity", "0")
            .attr("clip-path", "url(#clip)")
            .attr("class", "path" + count)
            .attr("stroke", colors[i])
            .attr("stroke-width", strokeWidth)
            .attr("d", lines[i]));
         animateLines ? animateSolidLine(paths[paths.length-1]) : 0;
         // update legend
         graph.append("line")
            .attr("x1", legXPos-30)
            .attr("x2", legXPos)
            .attr("y1",legYPos+ 30*(i+1))
            .attr("y2",legYPos+ 30*(i+1))
            .attr("stroke-width", strokeWidth)
            .style("stroke", colors[i])
         graph.append("text")
            .attr("class", "legend")
            .attr("x", legXPos + textOffsetX)
            .attr("y", legYPos+ 30*(i+1))
            // .style("text-anchor", "beginning")
            .text(lineNames[i])
            .attr("alignment-baseline","middle")
      }
      // dotted line
      else if(count == 2) {
         let dashing = "1,7";
         paths.push(graph.append("path")
            .datum(data)
            .attr("fill-opacity", "0")
            .attr("clip-path", "url(#clip)")
            .attr("stroke-width", strokeWidth)
            .attr("stroke", colors[i])
            .attr("stroke-width", strokeWidth + 1)
            .attr("d", lines[i]));
            animateLines ? animateDottedLine(paths[paths.length-1], dashing): 0;
         // update legend
         graph.append("line")
            .attr("x1", legXPos - 28)
            .attr("x2", legXPos)
            .attr("y1",legYPos+ 30*(i+1))
            .attr("y2",legYPos+ 30*(i+1))
            .style("stroke-dasharray", dashing)
            .attr("stroke-linecap","round")
            .attr("stroke-width", strokeWidth)
            .style("stroke", colors[i])
         graph.append("text")
            .attr("class", "legend")
            .attr("x", legXPos + textOffsetX)
            .attr("y", legYPos+ 30*(i+1))
            .text(lineNames[i])
            .attr("alignment-baseline","middle")
      }
      // dashed line
      else if (count == 3) {
         paths.push(graph.append("path")
            .datum(data)
            .attr("fill-opacity", "0")
            .attr("clip-path", "url(#clip)")
            .attr("stroke", colors[i])
            .attr("stroke-width", strokeWidth)
            .attr("d", lines[i]));
            animateLines ? animateDashedLine(paths[paths.length-1], "10,10"): 0;
         // update legend
         graph.append("line")
            .attr("x1", legXPos - 30)
            .attr("x2", legXPos)
            .attr("y1",legYPos+ 30*(i+1))
            .attr("y2",legYPos+ 30*(i+1))
            .attr("stroke-width", strokeWidth)
            .style("stroke-dasharray", "6,6")
            .style("stroke", colors[i])
         graph.append("text")
            .attr("class", "legend")
            .attr("x", legXPos + textOffsetX)
            .attr("y", legYPos+ 30*(i+1))
            .text(lineNames[i])
            .attr("alignment-baseline","middle")
         // reset count
         count = 0;
      }
   }
   return paths;
}

function setXAxisToYears() {
   let xAxis = graph.append("g")
       .attr("class", "x-axis")
       .call(d3.axisBottom(x))
       .attr("clip-path", "url(#clip)")
      //  .attr("transform", "translate(0," + height + ")");
       .attr("transform", `translate(0,${height - margin.bottom})`);
      //  .select(".domain")
      //  .remove();
   return xAxis;
}

function setTwoCountryLegend() {
   // Handmade legend
   let legXPos = 50;
   let legYPos = 10;
   let legRadius = 10;
   let textOffsetX = 20;
   graph.append("circle")
   .attr("cx",legXPos)
   .attr("cy",legYPos)
   .attr("r", legRadius)
   .style("fill", USA_primary)
   graph.append("text")
   .attr("class", "legend")
   .attr("x", legXPos + textOffsetX)
   .attr("y", legYPos)
   .text("USA")
   .attr("alignment-baseline","middle")
   graph.append("circle")
   .attr("cx",legXPos)
   .attr("cy",legYPos+30)
   .attr("r", legRadius)
   .style("fill", PRC_primary)
   graph.append("text")
   .attr("class", "legend")
   .attr("x", legXPos + textOffsetX)
   .attr("y", legYPos+30)
   .text("PRC")
   .attr("alignment-baseline","middle")
}

const buildCitationGraph = function(data) {
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // Line(s) declaration
   let USA_citations =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.us_paper_citation); });

   let PRC_citations =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.cn_paper_citation); });

   x.domain(d3.extent(data, function(d) { return d.year; }));
   y.domain([-500000, d3.max(data, function(d) { return d.us_paper_citation; })]);
   // y.domain(d3.extent(data, function(d) { return d.us_paper_citation; }));

   // Axis declaration
   let xAxis = setXAxisToYears();
       
  let yAxis = graph.append("g")
       .attr("class", "y-axis")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000}).tickSizeOuter(0))
   
   //  Add some style
   yAxis
       .append("text")
       .attr("fill", "#000")
       .attr("transform", "rotate(-90)")
       .attr("y", "-4em")
       .attr("x", "-6em")
       .attr("text-anchor", "end")
       .text("Yearly Number of Citations (millions)")
   
   var defs = svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("width", width - margin.right)
      .attr("height", height);
   
   let lines = [USA_citations, PRC_citations];
   let colors = [USA_primary, PRC_primary];
   let lineNames = ["US Paper Citations", "PRC Paper Citations"];
   // Draw graph
   let path = drawLines(data, lines, colors, lineNames);
   /* Zoom/pan tutorial: https://bl.ocks.org/LemoNode/7ac1d41fe75fe7d2d9cb85e78aad6303
    https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/
   
   // svg.call(zoom);

   // function zoom(svg) {

	// 	var extent = [
	// 		[margin.left, margin.top], 
	// 		[width - margin.right, height - margin.top]
	// 	];

	// 	var zooming = d3.zoom()
	// 		.scaleExtent([1, 3])
	// 		.translateExtent(extent)
	// 		.extent(extent)
	// 		.on("zoom", zoomed);

	// 	svg.call(zooming);

	// 	function zoomed() {

	// 		x.rangeRound([margin.left, width - margin.right]
	// 			.map(d => d3.event.transform.applyX(d)));
         
   //       y.rangeRound([height - margin.bottom, margin.top]
   //          .map(d => d3.event.transform.applyY(d)));

	// 		graph.select(".path1")
   //          .attr("stroke-width", strokeWidth*d3.event.transform.k)
   //          .attr("d", USA_citations)
   //          .attr("transform", d3.event.transform.toString())
         
   //       graph.select(".path2")
   //          .attr("stroke-width", strokeWidth*d3.event.transform.k)
   //          .attr("d", PRC_citations)
   //          .attr("transform", d3.event.transform.toString());
			
   //       graph.select(".x-axis")
	// 			.call(d3.axisBottom(x).tickSizeOuter(0));
   //       graph.select(".y-axis")
   //          .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000}).tickSizeOuter(0));
   //       // hide circle since location is off
   //       svg.select(".circle1").attr("r", "0");
   //       // svg.select(".circle2").attr("stroke", "white").attr("fill", "white");

	// 	}
	// }

   */

	svg.call(hover)

	function hover() {

		var bisect = d3.bisector(d => d.year).left,
			format = d3.format("+.0%"),
			dateFormat = d3.timeFormat("%Y")

		var focus = svg.append("g")
			.attr("class", "focus")
			.style("display", "none")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		focus.append("line")
			.attr("stroke", "#666")
			.attr("stroke-width", 1)
			.attr("y1", -height + margin.top)
			.attr("y2", -margin.bottom);

		focus.append("circle")
			.attr("class", "circle1")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");
      
      focus.append("circle")
			.attr("class", "circle2")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");      

		focus.append("text")
         .attr("class", "year_display")
			.attr("text-anchor", "middle")
			.attr("dy", ".35em");

      focus.append("text")
         .attr("class", "usa")
         .attr("x", 260)
         .attr("y", 65)

      focus.append("text")
         .attr("class", "prc")
         .attr("x", 260)
         .attr("y", 95)

		var overlay = svg.append("rect")
         .attr("fill", "none")
			.attr("class", "overlay")
			.attr("x", margin.left)
			.attr("y", margin.top)
			.attr("width", width - margin.right )
			.attr("height", height - margin.bottom )
			.on("mouseover", () => focus.style("display", null))
			.on("mouseout", () => focus.style("display", "none"))
			.on("mousemove", mousemove);
	
		function mousemove() {

			var x0 = x.invert(d3.mouse(this)[0]);

			var i = bisect(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.year > d1.year - x0 ? d1 : d0;

			focus.select("line")
				.attr("transform", 
					"translate(" + x(d.year) + "," + height + ")");

			focus.selectAll(".circle1")
            .attr("r", "5")
            .attr("stroke", "black")
				.attr("transform", 
					"translate(" + x(d.year) + "," + y(d.us_paper_citation) + ")");
         
         focus.selectAll(".circle2")
            .attr("stroke", "black")
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d.cn_paper_citation) + ")");

			focus.selectAll(".year_display")
				.attr("transform", 
					"translate(" + x(d.year) + "," + (height + 0.75*margin.bottom) + ")")
				.text(dateFormat(d.year));
         
         focus.selectAll(".usa")
				.text(d.us_paper_citation);
         
         focus.selectAll(".prc")
				.text(d.cn_paper_citation);

		}
   }
};


const buildPapersGraph = function (data) {
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   // Line(s) declaration
   let USA_papers =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.us_paper_count); });

   let PRC_papers =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.cn_paper_count); });


   // d3.extent() returns min/max tuple of input array
   x.domain(d3.extent(data, function(d) { return d.year; }));
   y.domain([-50000, d3.max(data, function(d) { return d.us_paper_count; })]);

   // Axis declaration
   let xAxis = setXAxisToYears();
   
   let yAxis = graph.append("g")
       .attr("class", "y-axis")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(function(d){return d/1000}).tickSizeOuter(0))
       .append("text")
       .attr("fill", "#000")
       .attr("transform", "rotate(-90)")
       .attr("y", "-4em")
       .attr("x", "-6em")
       .attr("text-anchor", "end")
       .text("Yearly Number of Papers (thousands)");

   let lines = [USA_papers, PRC_papers];
   let colors = [USA_primary, PRC_primary];
   let lineNames = ["US Papers", "PRC Papers"];

   // Draw graph
   drawLines(data, lines, colors, lineNames);
   svg.call(hover)

	function hover() {

		var bisect = d3.bisector(d => d.year).left,
			format = d3.format("+.0%"),
			dateFormat = d3.timeFormat("%Y")

		var focus = svg.append("g")
			.attr("class", "focus")
			.style("display", "none")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		focus.append("line")
			.attr("stroke", "#666")
			.attr("stroke-width", 1)
			.attr("y1", -height + margin.top)
			.attr("y2", -margin.bottom);

		focus.append("circle")
			.attr("class", "circle1")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");
      
      focus.append("circle")
			.attr("class", "circle2")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");      

		focus.append("text")
         .attr("class", "year_display")
			.attr("text-anchor", "middle")
			.attr("dy", ".35em");

      focus.append("text")
         .attr("class", "usa")
         .attr("x", 200)
         .attr("y", 65)

      focus.append("text")
         .attr("class", "prc")
         .attr("x", 200)
         .attr("y", 95)

		var overlay = svg.append("rect")
         .attr("fill", "none")
			.attr("class", "overlay")
			.attr("x", margin.left)
			.attr("y", margin.top)
			.attr("width", width - margin.right )
			.attr("height", height - margin.bottom )
			.on("mouseover", () => focus.style("display", null))
			.on("mouseout", () => focus.style("display", "none"))
			.on("mousemove", mousemove);
	
		function mousemove() {

			var x0 = x.invert(d3.mouse(this)[0]);

			var i = bisect(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.year > d1.year - x0 ? d1 : d0;

			focus.select("line")
				.attr("transform", 
					"translate(" + x(d.year) + "," + height + ")");

			focus.selectAll(".circle1")
            .attr("r", "5")
            .attr("stroke", "black")
				.attr("transform", 
					"translate(" + x(d.year) + "," + y(d.us_paper_count) + ")");
         
         focus.selectAll(".circle2")
            .attr("stroke", "black")
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d.cn_paper_count) + ")");

			focus.selectAll(".year_display")
				.attr("transform", 
					"translate(" + x(d.year) + "," + (height + 0.75*margin.bottom) + ")")
				.text(dateFormat(d.year));
         
         focus.selectAll(".usa")
				.text(d.us_paper_count);
         
         focus.selectAll(".prc")
				.text(d.cn_paper_count);

		}
   }
};

const buildInternetUseGraph = function (data) {
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   // Line(s) declaration
   let us_internet_access =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.us_internet_access); });

   let us_broadband_subscriptions =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.us_broadband_subscriptions); });

   let us_mobile_internet_users = d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.us_mobile_internet_users); }); 
   
   let cn_internet_access =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.cn_internet_access); });
   
   let cn_broadband_subscriptions =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.cn_broadband_subscriptions); });

   let cn_mobile_internet_users = d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.cn_mobile_internet_users); });  

   // d3.extent() returns min/max tuple of input array
   x.domain(d3.extent(data, function(d) { return d.year; }));
   y.domain([-50000000, d3.max(data, function(d) { return d.cn_internet_access; })]);

   // Axis declaration
   let xAxis = setXAxisToYears();

   let yAxis = graph.append("g")
       .attr("class", "y-axis")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000}).tickSizeOuter(0))
       .append("text")
       .attr("fill", "#000")
       .attr("transform", "rotate(-90)")
       .attr("y", "-4em")
       .attr("x", "-6em")
       .attr("text-anchor", "end")
       .text("Number of Internet Users (millions)"); 

   let lines = [us_internet_access, us_broadband_subscriptions, us_mobile_internet_users, cn_internet_access, cn_broadband_subscriptions, cn_mobile_internet_users];
   let colors = [USA_primary, USA_primary, USA_primary, PRC_primary, PRC_primary, PRC_primary];
   let lineNames = ["US Internet Access", "US Broadband Subscriptions", "US Mobile Internet Users", "PRC Internet Access", "PRC Broadband Subscriptions", "PRC Mobile Internet Users" ];
   drawLines(data, lines, colors, lineNames);
};

const buildPatentGraph = function (data) {
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   // Line(s) declaration
   let us_patent_assignments =  d3.line()
   .x(function(d) { return x(d['Year']); })
   .y(function(d) { return y(d["US patents assignment"]); });

   let cn_patent_assignments =  d3.line()
   .x(function(d) { return x(d['Year']); })
   .y(function(d) { return y(d["中国专利授权量"]); });

   // d3.extent() returns min/max tuple of input array
   x.domain(d3.extent(data, function(d) { return d['Year']; }));
   y.domain([-50000, d3.max(data, function(d) { return d["中国专利授权量"]; })]);

   // Axis declaration
   let xAxis = setXAxisToYears();

   let yAxis = graph.append("g")
       .attr("class", "y-axis")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000}).tickSizeOuter(0))
       .append("text")
       .attr("fill", "#000")
       .attr("transform", "rotate(-90)")
       .attr("y", "-4em")
       .attr("x", "-6em")
       .attr("text-anchor", "end")
       .text("Yearly number of patent assignment (in millions)"); 

   let lines = [us_patent_assignments, cn_patent_assignments];
   let colors = [USA_primary, PRC_primary];
   let lineNames = ["US", "China"];
   drawLines(data, lines, colors, lineNames);

   svg.call(hover(100));
   function hover() {

		var bisect = d3.bisector(d => d['Year']).left,
			format = d3.format("+.0%"),
			dateFormat = d3.timeFormat("%Y")

		var focus = svg.append("g")
			.attr("class", "focus")
			.style("display", "none")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		focus.append("line")
			.attr("stroke", "#666")
			.attr("stroke-width", 1)
			.attr("y1", -height + margin.top)
			.attr("y2", -margin.bottom);

		focus.append("circle")
			.attr("class", "circle1")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");
      
      focus.append("circle")
			.attr("class", "circle2")
			.attr("r", 5)
			.attr("dy", 5)
			.attr("stroke", "steelblue")
			.attr("fill", "#fff");      

		focus.append("text")
         .attr("class", "year_display")
			.attr("text-anchor", "middle")
			.attr("dy", ".35em");

      focus.append("text")
         .attr("class", "usa")
         .attr("x", 175)
         .attr("y", 65)

      focus.append("text")
         .attr("class", "prc")
         .attr("x", 175)
         .attr("y", 95)

		var overlay = svg.append("rect")
         .attr("fill", "none")
			.attr("class", "overlay")
			.attr("x", margin.left)
			.attr("y", margin.top)
			.attr("width", width - margin.right )
			.attr("height", height - margin.bottom )
			.on("mouseover", () => focus.style("display", null))
			.on("mouseout", () => focus.style("display", "none"))
			.on("mousemove", mousemove);
	
      function mousemove() {

            var x0 = x.invert(d3.mouse(this)[0]);
      
            var i = bisect(data, x0, 1),
               d0 = data[i - 1],
               d1 = data[i],
               d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      
            focus.select("line")
               .attr("transform", 
                  "translate(" + x(d['Year']) + "," + height + ")");
      
            focus.selectAll(".circle1")
               .attr("r", "5")
               .attr("stroke", "black")
               .attr("transform", 
                  "translate(" + x(d['Year']) + "," + y(d["US patents assignment"]) + ")");
            
            focus.selectAll(".circle2")
               .attr("stroke", "black")
               .attr("transform", 
                  "translate(" + x(d['Year']) + "," + y(d["中国专利授权量"]) + ")");
      
            focus.selectAll(".year_display")
               .attr("transform", 
                  "translate(" + x(d['Year']) + "," + (height + 0.75*margin.bottom) + ")")
               .text(dateFormat(d['Year']));
            
            focus.selectAll(".usa")
               .text(d["US patents assignment"]);
            
            focus.selectAll(".prc")
               .text(d["中国专利授权量"]);
      
      }
   }
   

};

const buildRoadGraph = function (data) {
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   // Line(s) declaration
   let us_public_roads =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d["US: Public  Road  and  Street  Length in US (by 10,000 kilometers)"]); });
   
   let cn_highway =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d["China: Highway Length (by 10,000 kilometers)"]); });

   let us_expressway =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d["China: Length of Expressways (by 10,000 kilometers)"]); });

   let cn_expressway =  d3.line()
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d["US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)"]); });

   // d3.extent() returns min/max tuple of input array
   x.domain(d3.extent(data, function(d) { return d.year; }));
   y.domain([-50, d3.max(data, function(d) { return d["US: Public  Road  and  Street  Length in US (by 10,000 kilometers)"]; })]);

   // Axis declaration
   let xAxis = setXAxisToYears();

   let yAxis = graph.append("g")
       .attr("class", "y-axis")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(function(d){return d}).tickSizeOuter(0))
       .append("text")
       .attr("fill", "#000")
       .attr("transform", "rotate(-90)")
       .attr("y", "-4em")
       .attr("x", "-6em")
       .attr("text-anchor", "end")
       .text("Highway Length (in 10,000 kilometers)"); 

   let lines = [us_public_roads, cn_highway, us_expressway, cn_expressway];
   let colors = [USA_primary, PRC_primary, USA_primary, PRC_primary];
   let lineNames = ["US public road and street", "PRC Highways", "US interstate and other freeway/expressways", "PRC Highways"];
   drawLines(data, lines, colors, lineNames, true, 100);
};

// handle d3.csv file retrevial 
async function gatherData(source, conversion) {
   const data = await d3.csv(source, conversion);
   return data;
}

// parse year data into Date objects that scaleTime() can handle
var parseTime = d3.timeParse("%Y");

// convert the data from strings to integers
const scienceFileConversion = function (d) {
   d.year = parseTime(d.year);
   // Strings --> Integers
   d.cn_paper_count = +d.cn_paper_count;
   d.cn_paper_citation = +d.cn_paper_citation;
   d.us_paper_count = +d.us_paper_count;
   d.us_paper_citation = +d.us_paper_citation;
   return d;
};

const internetFileConversion = function (d) {
   d.year = parseTime(d.year);
   // Strings --> Integers
   d.us_internet_access = +d.us_internet_access.replace(/,/g, "");
   d.us_broadband_subscriptions = +d.us_broadband_subscriptions.replace(/,/g, "");
   d.us_mobile_internet_users = +d.us_mobile_internet_users.replace(/,/g, "");

   d.cn_internet_access = +d.cn_internet_access.replace(/,/g, "");
   d.cn_broadband_subscriptions = +d.cn_broadband_subscriptions.replace(/,/g, "");
   d.cn_mobile_internet_users = +d.cn_mobile_internet_users.replace(/,/g, ""); 
   
   d.us_population = +d.us_population.replace(/,/g, "");
   d.cn_population = +d.cn_population.replace(/,/g, "");
   d.us_mobile_users = +d.us_mobile_users.replace(/,/g, "");
   return d;
};

const patentFileConversion = function (d) {
   d['Year'] = parseTime(d['Year']);
   d["US patents assignment"] = +d["US patents assignment"].replace(/,/g, "");
   d["中国专利授权量"] = +d["中国专利授权量"].replace(/,/g, ""); 
   return d;
};

const roadFileConversion = function (d) {
   d.year = parseTime(d.year);
   d["China: Highway Length (by 10,000 kilometers)"] = +d["China: Highway Length (by 10,000 kilometers)"].replace(/,/g, "");
   d["US: Public  Road  and  Street  Length in US (by 10,000 kilometers)"] = +d["US: Public  Road  and  Street  Length in US (by 10,000 kilometers)"].replace(/,/g, "");
   d["China: Length of Expressways (by 10,000 kilometers)"] = +d["China: Length of Expressways (by 10,000 kilometers)"].replace(/,/g, "");
   d["US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)"] = +d["US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)"].replace(/,/g, "");

   console.log(d)
   return d;
}

function citationsGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   gatherData("data/science.csv", scienceFileConversion).then(buildCitationGraph);
}

function papersGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   gatherData("data/science.csv", scienceFileConversion).then(buildPapersGraph);
}

function internetUseGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   gatherData("data/internet.csv", internetFileConversion).then(buildInternetUseGraph);
}

function patentGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   gatherData("data/patent.csv", patentFileConversion).then(buildPatentGraph);
}

function roadGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   gatherData("data/roads.csv", roadFileConversion).then(buildRoadGraph);
}

function updateSource(){ 
   let values = ["citations", "papers", "roads", "internet", "patent"];
   let functions = [citationsGraph, papersGraph, roadGraph, internetUseGraph, patentGraph]
   let current_value = document.getElementById("source_selector").elements["data_source"].value;
   if (values.indexOf(current_value) > -1) {
      functions[values.indexOf(current_value)]();
      console.log(values.indexOf(current_value));
   }
   else 
      console.log("Error, this value is not associated with a valid graph");
   
}

function downloadSvg() {

   var svg = document.getElementsByClassName("svg-content")[0];
   var serializer = new XMLSerializer();
   var source = serializer.serializeToString(svg);
   source = source.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
   
   source = source.replace(/ns\d+:href/g, 'xlink:href'); // Safari NS namespace fix.
   
   
   if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
       source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
   }
   if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
       source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
   }
   
   
   var preface = '<?xml version="1.0" standalone="no"?>\r\n';
   var svgBlob = new Blob([preface, source], { type: "image/svg+xml;charset=utf-8" });
   var svgUrl = URL.createObjectURL(svgBlob);
   var downloadLink = document.createElement("a");
   downloadLink.href = svgUrl;
   downloadLink.download = name;
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);
}
/*
      // https://stackoverflow.com/questions/68496555/d3-js-draw-circle-between-dash
      // dashed and dotted line
      else if (count == 2) {
         let dashing = "0,16,0,48";
         let path1 = graph.append("path")
            .datum(data)
            .attr("fill-opacity", "0")
            .attr("stroke", colors[i])
            // .style("stroke-dasharray", dashing)
            .attr("stroke-width", strokeWidth)
            .attr("d", lines[i]);
         animateDashedLine(path1, "5,32,10,62");
         let paths.push(raph.append("path")
            .datum(data)
            .attr("fill-opacity", "0")
            .attr("stroke", colors[i])
            // .style("stroke-dasharray", dashing)
            // "10, 20, 10, 38"
            // .attr("stroke-dashoffset", "32" )
            .attr("stroke-width", strokeWidth)
            .attr("d", lines[i]);
         animateDottedLine(path, dashing);
         // update legend
         graph.append("line")
            .attr("x1", legXPos - 30)
            .attr("x2", legXPos)
            .attr("y1",legYPos+ 30*(i+1))
            .attr("y2",legYPos+ 30*(i+1))
            .style("stroke-dasharray", "10,3")
            .attr("stroke-linecap","square")
            .style("stroke", colors[i])
         graph.append("line")
            .attr("x1", legXPos - 28)
            .attr("x2", legXPos)
            .attr("y1",legYPos+ 30*(i+1))
            .attr("y2",legYPos+ 30*(i+1))
            .style("stroke-dasharray", "0 15")
            .attr("stroke-linecap","round")
            .attr("stroke-width", strokeWidth)
            .style("stroke", colors[i])
         graph.append("text")
            .attr("x", legXPos + textOffsetX)
            .attr("y", legYPos+ 30*(i+1))
            .text(lineNames[i])
            .attr("alignment-baseline","middle")
      }
*/