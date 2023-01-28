var USA_primary = "#0099C5";
var USA_secondary = "#CCEAF3";
var USA_tertiary = "#88D5F3";
var PRC_primary = "#ff0000";
var PRC_secondary = "#B0000D";
var PRC_tertiary = "#CF666D";

var strokeWidth = 3;
var animationDuration = 5;
var fillOpacity = "0.0";

// default is citations
var start_year = 1800
var end_year = 2020
let container_width = 800;
let container_height = 500;
var svg = d3.select("div#svg-container")
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 " + container_width + " " + container_height)
   .classed("svg-content", true);

d3.select("svg"),
   margin = {top: 15, right: 15, bottom: 20, left: 50},
   width =  container_width - margin.left - margin.right,
   height = container_height - margin.top - margin.bottom;
   //  width = +svg.attr("width") - margin.left - margin.right,
   //  height = +svg.attr("height") - margin.top - margin.bottom;

// set graph scale
var x = d3.scaleTime().range([margin.left, width - margin.right])
var y = d3.scaleLinear().rangeRound([height-margin.bottom, margin.top]);

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
            .attr("fill-opacity", fillOpacity)
            .attr("fill", colors[i])
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
            .attr("fill-opacity", fillOpacity)
            .attr("fill", colors[i])
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
            .attr("fill-opacity", fillOpacity)
            .attr("fill", colors[i])
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
    setDataSource("citations");
    graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   
   // Line(s) declaration
   let USA_citations =  d3.line()
   .x(function(d) { 
    //    // only add items in specified date range
    //    if (d.year >= parseTime(start_year) && d.year <= parseTime(end_year)) {

    //        if (start_year != 1800)
    //             console.log(d.year)
    //     }
        // console.log("damn")
           return x(d.year);

    })
   .y(function(d) { 
        return y(d.us_paper_citation); });

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
   let path = drawLines(data, lines, colors, lineNames, animateGraph);
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
				.text(d.us_paper_citation.toLocaleString());
         
         focus.selectAll(".prc")
				.text(d.cn_paper_citation.toLocaleString());

		}
   }
};

const buildPapersGraph = function (data) {
    setDataSource("papers");
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
   drawLines(data, lines, colors, lineNames, animateGraph);
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
				.text(d.us_paper_count.toLocaleString());
         
         focus.selectAll(".prc")
				.text(d.cn_paper_count.toLocaleString());

		}
   }
};

const buildInternetUseGraph = function (data) {
//    setDataSource("internet");
   internetGroups =  getSelectedDataSource().groups;
   generateAll = internetGroups[full_data_string]
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   console.log("check func")
   console.log(internetGroups)
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
   
   var lines = []
   var colors = []
   var lineNames = []
   var animate = animateGraph;
   if (generateAll) {
      lines = [ 
         cn_internet_access, cn_mobile_internet_users,
         us_internet_access,us_mobile_internet_users, 
         cn_broadband_subscriptions, us_broadband_subscriptions,
      ];
      colors = [
         PRC_primary, PRC_secondary, PRC_tertiary,
         USA_primary, USA_secondary, USA_tertiary, 
      ];
      lineNames = [
      "PRC Internet Access", "PRC Mobile Internet Users",
      "US Internet Access", "US Mobile Internet Users",
      "PRC Broadband Subscriptions", "US Broadband Subscriptions",  
      ];
      animate = true;
      drawLines(data, lines, colors, lineNames, animate);
   }
   else if (internetGroups.chinaOnly) {
      lines = [cn_internet_access, cn_broadband_subscriptions, cn_mobile_internet_users];
      colors = [PRC_primary, PRC_secondary, PRC_tertiary];
      lineNames = ["PRC Internet Access", "PRC Broadband Subscriptions", "PRC Mobile Internet Users" ];
      drawLines(data, lines, colors, lineNames, animate);
   }
   else if (internetGroups.usOnly) {
      lines = [us_internet_access, us_mobile_internet_users, us_broadband_subscriptions,];
      colors = [USA_primary, USA_secondary, USA_tertiary];
      lineNames = ["US Internet Access", "US Broadband Subscriptions", "US Mobile Internet Users"];
      drawLines(data, lines, colors, lineNames, animate);
   }
   else if (internetGroups.broadband) {
      lines = [cn_broadband_subscriptions, us_broadband_subscriptions];
      colors = [PRC_primary, USA_primary];
      lineNames = ["PRC Broadband Subscriptions", "US Broadband Subscriptions"];
      drawLines(data, lines, colors, lineNames, animate);
      svg.call(hover("cn_broadband_subscriptions", "us_broadband_subscriptions"))
   }
   else if (internetGroups.access) {
      lines = [us_internet_access,cn_internet_access];
      colors = [USA_primary, PRC_primary];
      lineNames = ["US Internet Access","PRC Internet Access"];
      drawLines(data, lines, colors, lineNames, animate);
      svg.call(hover("us_internet_access", "cn_internet_access"))
   }
   else if (internetGroups.mobile) {
      lines = [us_mobile_internet_users, cn_mobile_internet_users];
      colors = [USA_primary, PRC_primary];
      lineNames = ["US Mobile Internet Users", "PRC Mobile Internet Users" ];
      drawLines(data, lines, colors, lineNames, animate);
      svg.call(hover("us_mobile_internet_users", "cn_mobile_internet_users"))
   }
   function hover(data1, data2) {

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
         .attr("x", 15)
         .attr("y", 30)

      focus.append("text")
         .attr("class", "prc")
         .attr("x", -30)
         .attr("y", 30)

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
					"translate(" + x(d.year) + "," + y(d[data1]) + ")");
         
         focus.selectAll(".circle2")
            .attr("stroke", "black")
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d[data2]) + ")");

			focus.selectAll(".year_display")
				.attr("transform", 
					"translate(" + x(d.year) + "," + (height + 0.75*margin.bottom) + ")")
				.text(dateFormat(d.year));
         
         focus.selectAll(".usa")
            .attr("transform", 
            "translate(" + x(d.year) + "," + y(d[data1]) + ")")
            .text(d[data1].toLocaleString())
         
         focus.selectAll(".prc")
            .text(d[data2].toLocaleString())
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d[data2]) + ")");

		}
   }
};

const buildPatentGraph = function (data) {
    console.log(data)
   setDataSource("patent");
   graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   // Line(s) declaration
   let us_patent_assignments =  d3.line()
   .x(function(d) { return x(d['year']); })
   .y(function(d) { return y(d["US patents assignment"]); });

   let cn_patent_assignments =  d3.line()
   .x(function(d) { return x(d['year']); })
   .y(function(d) { return y(d["中国专利授权量"]); });

   // d3.extent() returns min/max tuple of input array
   x.domain(d3.extent(data, function(d) { return d['year']; }));
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
   let lineNames = ["US Patents", "China Patents"];
   drawLines(data, lines, colors, lineNames, animateGraph);

   svg.call(hover)
   function hover() {

		var bisect = d3.bisector(d => d['year']).left,
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
               .text(d["US patents assignment"].toLocaleString());
            
            focus.selectAll(".prc")
               .text(d["中国专利授权量"].toLocaleString());
      
      }
   }
   

};

const buildRoadGraph = function (data) {
   roadGroups = getSelectedDataSource().groups;
   console.log(roadGroups)
   generateAll = roadGroups[full_data_string]

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

   
   var lines = []
   var colors = []
   var lineNames = []
   var animate = animateGraph;

   if (generateAll) {
      lines = [us_public_roads, cn_highway, us_expressway, cn_expressway];
      colors = [USA_primary, PRC_primary, USA_secondary, PRC_secondary];
      lineNames = ["US public road and street", "PRC Highways", "US interstate and other freeway/expressways", "PRC Expressways"]
      animate = true;
      drawLines(data, lines, colors, lineNames, animate, 100);
   }
  
   else if (roadGroups["China (domestic)"]) {
      lines = [cn_highway, cn_expressway];
      colors = [PRC_primary, PRC_secondary];
      lineNames = [ "PRC Highways", "PRC Expressways"];
      drawLines(data, lines, colors, lineNames, animate, 100);
      svg.call(hover("China: Highway Length (by 10,000 kilometers)", "China: Length of Expressways (by 10,000 kilometers)"))

   }
   else if (roadGroups["United States (domestic)"]) {
      lines = [us_public_roads, us_expressway];
      colors = [USA_primary, USA_secondary];
      lineNames = ["US public road and street", "US interstate and other freeway/expressways"];
      drawLines(data, lines, colors, lineNames, animate, 100);
      svg.call(hover("US: Public  Road  and  Street  Length in US (by 10,000 kilometers)","US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)"))
   }
   else if (roadGroups["Highways"]) {
      lines = [cn_highway, us_public_roads];
      colors = [PRC_primary, USA_primary];
      lineNames = ["PRC Highways", "US public road and street",];
      drawLines(data, lines, colors, lineNames, animate, 100);
      svg.call(hover("China: Highway Length (by 10,000 kilometers)", "US: Public  Road  and  Street  Length in US (by 10,000 kilometers)"))
   }
   else if (roadGroups["Expressways"]) {
      lines = [cn_expressway,us_expressway];
      colors = [PRC_primary, USA_primary, ];
      lineNames = ["PRC Expressways", "US interstate and other freeway/expressways"];
      drawLines(data, lines, colors, lineNames, animate, 100);
      svg.call(hover("US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)","China: Length of Expressways (by 10,000 kilometers)"))
   }
   
	function hover(data1, data2) {

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
         .attr("x", 15)
         .attr("y", 30)

      focus.append("text")
         .attr("class", "prc")
         .attr("x", -30)
         .attr("y", 30)

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
					"translate(" + x(d.year) + "," + y(d[data1]) + ")");
         
         focus.selectAll(".circle2")
            .attr("stroke", "black")
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d[data2]) + ")");

			focus.selectAll(".year_display")
				.attr("transform", 
					"translate(" + x(d.year) + "," + (height + 0.75*margin.bottom) + ")")
				.text(dateFormat(d.year));
         
         focus.selectAll(".usa")
            .attr("transform", 
            "translate(" + x(d.year) + "," + y(d[data1]) + ")")
            .text(d[data1].toLocaleString())
         
         focus.selectAll(".prc")
            .text(d[data2].toLocaleString())
            .attr("transform", 
               "translate(" + x(d.year) + "," + y(d[data2]) + ")");

		}
   }
};

function filterYears(data) {
    output = []
    console.log("---filter----")
    console.log(start_year)
    console.log(end_year)
    data.forEach(d => {
        if (d.year >= parseTime(start_year) && d.year <= parseTime(end_year)) {
            // console.log("yoo")
            // console.log(d.year)
            output.push(d)
        }
    })
    console.log(output)
    return output;
    
}
// handle d3.csv file retrevial 
async function gatherData(source, conversion) {
   const data = await d3.csv(source, conversion);
//    console.log(data)
   return filterYears(data);
}

// parse year data into Date objects that scaleTime() can handle
var parseTime = d3.timeParse("%Y");

// convert the data from strings to integers
const scienceFileConversion = function (d) {
//    console.log(d.year);
   d.year = parseTime(d.year);
   // Strings --> Integers
   d.cn_paper_count = +d.cn_paper_count;
   d.cn_paper_citation = +d.cn_paper_citation;
   d.us_paper_count = +d.us_paper_count;
   d.us_paper_citation = +d.us_paper_citation;

//    console.log("start", start_year)
//    console.log("current", d.year)
   // only add items in specified date range
   if (d.year < parseTime(start_year) || d.year > parseTime(end_year)) {
        console.log(d)
        delete d.year
        delete d.cn_paper_count
        delete d.cn_paper_citation
        delete d.us_paper_count
        delete d.us_paper_citation
        console.log(d)
        // if (start_year != 1800)
    }
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
   d['year'] = parseTime(d['year']);
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

   return d;
}

function citationsGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   setDataSource("citations");
   gatherData("data/science.csv", scienceFileConversion).then(buildCitationGraph);
}

function papersGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   setDataSource("papers");
   gatherData("data/science.csv", scienceFileConversion).then(buildPapersGraph);
}

function internetUseGraph() {
   console.log("HELLO")
   // clear graph
   d3.selectAll("svg>*").remove();
   setDataSource("internet");
   gatherData("data/internet.csv", internetFileConversion).then(buildInternetUseGraph);
   console.log("HELLO")
}

function patentGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   setDataSource("patent");
   gatherData("data/patent.csv", patentFileConversion).then(buildPatentGraph);
}

function roadGraph() {
   // clear graph
   d3.selectAll("svg>*").remove();
   setDataSource("roads");
   gatherData("data/roads.csv", roadFileConversion).then(buildRoadGraph);
}

function setYearRange() {
    start_year = document.getElementById("start_year").options[0].innerText;
    end_year = document.getElementById("end_year").options[0].innerText;
    console.log(start_year)
    console.log(end_year)
    setYearOptions();
    updateDataFromGroup()
}