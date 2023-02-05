/*--------------------------------------------------------------*
 * Filename: graphBuilder.js
 * Author: Shameek Hargrave
 * Description:
 * A JSON object containing the necessary metadata for
 * graph represenation. Specifically, the filepath, the name of each
 * statistical indicator (column of csv datafile) within that file and a corresponding color for each indicator the legend.
 *-------------------------------------------------------------*/

// user-configurable settings
var animationDuration = 5;
animateGraph = false;
var units = 10e3

/************************************************************
 * SECTION: GRAPH INITIALIZATION
    * sets the width/height of graph
    * init. d3 linear scale (y-axis) and time scale (x-axis)
    * line tracking
*************************************************************/
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

/************************************************************
 * SECTION: LINE GENERATION
    * animation
    * line tracking
    * solid,dashed,dotted line generator
    * line removal, graph clearing
*************************************************************/

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
// dashing is the offset between rect chunks
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
// dashing is the offset between circle chunks
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

// track current lines on the graph
var currentLines = [
    // TEMPLATE: "solid": 0, dashed" = 1, "dotted" = 2
    {
        "indicator_name": "Stat name",
        "id": 1010,
        "line_type": 2,
        "min_year": 1800,
        "max_year": 2020
    }
]

// helper fxn to convert strings to integers for d3 dataset
const convertStringToIntegerData = function (d) {
    console.log(d)
    // Strings --> Integers
    d["year"] = parseTime(d["year"]);
    // d[indicatorName] = +d[indicatorName].replace(/,/g, "");
    return d;
};

// retrieve indicator specific data from corresponding column in csvfile
// returning filtered data for the current global yearRange
async function prepareIndicatorData(indicator) {
    const data = await d3.csv(indicator["filepath"], function(data) {
        data[indicator["x-axis"]] = parseTime(data[indicator["x-axis"]]);
        data[indicator["column_name"]] = +data[indicator["column_name"]].replace(/,/g, "");
        return data;
    });
    // filter the dataset to include the specified range of years
    // (excluding other data)
    return filterYears(data);
}

// returns the metadata dict. for specific indicator
function getIndicatorData(indicator) {
    metaData = null
    statisticalIndicators.forEach(stat => {
        if (stat.name === indicator)
            metaData = stat;
    });
    return metaData;
}

// adds line to graph (random color w/label in legend)
function addLine(indicator) {
    indicatorMetaData = getIndicatorData(indicator)
    console.log(indicatorMetaData)
    prepareIndicatorData(indicatorMetaData).then(
        // helper function to call d3 methods, prepares data into line and feeds to drawLine
        function (data) {
            graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            // negative offset for space between x-axis and graph
            yAxisOffset = -5*10e3
            // Line declaration
            let line = d3.line()
            .x(function(d) { return x(d[indicatorMetaData["x-axis"]])})
            .y(function(d) { return y(d[indicatorMetaData["column_name"]])})

            x.domain(d3.extent(data, function(d) { return d[indicatorMetaData["x-axis"]]; }));
            // add padding to y-axis for legend
            y.domain([yAxisOffset, 10e6+ d3.max(data, function(d) { return d[indicatorMetaData["column_name"]]; })]);

            // Axis declaration
            let xAxis = graph.append("g")
                .attr("class", "x-axis")
                .call(d3.axisBottom(x))
                .attr("clip-path", "url(#clip)")
            //  .attr("transform", "translate(0," + height + ")");
                .attr("transform", `translate(0,${height - margin.bottom})`);
            //  .select(".domain")
            //  .remove();
            let yAxis = graph.append("g")
                .attr("class", "x-axis") // hmmm *****
                .attr("transform", `translate(${margin.left},0)`)
                // scale y axis by units
                .call(d3.axisLeft(y).tickFormat(function(d){return d/units}).tickSizeOuter(0))

            //  Add some style
            yAxis.append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", "-4em")
                .attr("x", "-6em")
                .attr("text-anchor", "end")
            //  .text("Yearly Number of Citations (millions)")

            // styling
            var defs = svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("x", margin.left)
                .attr("width", width - margin.right)
                .attr("height", height);

            // Draw graph
            console.log(indicatorMetaData)
            let lineName = indicatorMetaData["name"];
            let prevLineType = currentLines[currentLines.length-1]["line_type"]
            let min_year = function(d) { return d3.min(d[indicatorMetaData["x-axis"]])}
            let max_year = function(d) { return d3.max(d[indicatorMetaData["x-axis"]])}
            let path = drawLine(data, line, lineName, prevLineType, min_year, max_year, animateGraph);
            // svg.call(hover)
        
            // function hover() {
        
            //     var bisect = d3.bisector(d => d[indicatorMetaData["x-axis"]]).left,
            //         format = d3.format("+.0%"),
            //         dateFormat = d3.timeFormat("%Y")
        
            //     var focus = svg.append("g")
            //         .attr("class", "focus")
            //         .style("display", "none")
            //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            //     focus.append("line")
            //         .attr("stroke", "#666")
            //         .attr("stroke-width", 1)
            //         .attr("y1", -height + margin.top)
            //         .attr("y2", -margin.bottom);
        
            //     focus.append("circle")
            //         .attr("class", "circle1")
            //         .attr("r", 5)
            //         .attr("dy", 5)
            //         .attr("stroke", "steelblue")
            //         .attr("fill", "#fff");
                
            //     focus.append("circle")
            //         .attr("class", "circle2")
            //         .attr("r", 5)
            //         .attr("dy", 5)
            //         .attr("stroke", "steelblue")
            //         .attr("fill", "#fff");      
        
            //     focus.append("text")
            //         .attr("class", "year_display")
            //         .attr("text-anchor", "middle")
            //         .attr("dy", ".35em");
        
            // //  change position of text
            //     focus.append("text")
            //         .attr("class", "usa")
            //         .attr("x", 280)
            //         .attr("y", 65)
        
            //     focus.append("text")
            //         .attr("class", "prc")
            //         .attr("x", 280)
            //         .attr("y", 95)
        
            //     var overlay = svg.append("rect")
            //         .attr("fill", "none")
            //         .attr("class", "overlay")
            //         .attr("x", margin.left)
            //         .attr("y", margin.top)
            //         .attr("width", width - margin.right )
            //         .attr("height", height - margin.bottom )
            //         .on("mouseover", () => focus.style("display", null))
            //         .on("mouseout", () => focus.style("display", "none"))
            //         .on("mousemove", mousemove);
        
            //     function mousemove() {
        
            //         var x0 = x.invert(d3.mouse(this)[0]);
        
            //         var i = bisect(data, x0, 1),
            //             d0 = data[i - 1],
            //             d1 = data[i],
            //             d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        
            //         focus.select("line")
            //             .attr("transform", 
            //                 "translate(" + x(d[indicatorMetaData["x-axis"]]) + "," + height + ")");
        
            //         focus.selectAll(".circle1")
            //         .attr("r", "5")
            //         .attr("stroke", "black")
            //             .attr("transform", 
            //                 "translate(" + x(d[indicatorMetaData["x-axis"]]) + "," + y(d.us_paper_citation) + ")");
                    
            //         focus.selectAll(".circle2")
            //         .attr("stroke", "black")
            //         .attr("transform", 
            //             "translate(" + x(d[indicatorMetaData["x-axis"]]) + "," + y(d.cn_paper_citation) + ")");
        
            //         focus.selectAll(".year_display")
            //             .attr("transform", 
            //                 "translate(" + x(d[indicatorMetaData["x-axis"]]) + "," + (height + 0.75*margin.bottom) + ")")
            //             .text(dateFormat(d[indicatorMetaData["x-axis"]]));
                    
            //         focus.selectAll(".usa")
            //             .text(d.us_paper_citation.toLocaleString());
                    
            //         focus.selectAll(".prc")
            //             .text(d.cn_paper_citation.toLocaleString());
        
            //     }
            // }
        })
}

// removes line from graph
function removeLine(id) {
    d3.select("#" + id).remove();
}

// clear graph
function clearGraph() {
    d3.selectAll("svg>*").remove();
}

// adds a (solid/dashed/dotted) line to graph and tracking list, calls updateYearRange
function drawLine(data, line, lineName, prevType, min_year, max_year, animateLines = true) {
    let lineCount = currentLines.length - 1 // offset for template
    // Credit to: https://stackoverflow.com/questions/1484506/random-color-generator (ZPiDER)
    let lineColor = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
    let lineType = prevType == 2 ? 0 : prevType + 1
    let lineID = +currentLines[currentLines.length-1].id + 1
    let strokeWidth = 3;
    let fillOpacity = "0.0";
    // Handmade legend
    let legendXPos = 100;
    let legendYPos = 30;
    let textOffsetX = 10;
    var paths = Array(1);
    // solid line
    if (lineType == 0)   {
        paths.push(
            graph.append("path")
                .datum(data)
                .attr("fill-opacity", fillOpacity)
                .attr("fill", lineColor)
                .attr("clip-path", "url(#clip)")
                .attr("class", "path" + lineCount)
                .attr("stroke", lineColor)
                .attr("stroke-width", strokeWidth)
                .attr("d", line)
                .attr("id", lineID)
        );
        // animate if bool == true
        animateLines ? animateSolidLine(paths[paths.length-1]) : 0;
        // update legend
        graph.append("line")
            .attr("x1", legendXPos-30)
            .attr("x2", legendXPos)
            .attr("y1",legendYPos+ 30*(lineCount+1))
            .attr("y2",legendYPos+ 30*(lineCount+1))
            .attr("stroke-width", strokeWidth)
            .style("stroke", lineColor)
        graph.append("text")
            .attr("class", "legend")
            .attr("x", legendXPos + textOffsetX)
            .attr("y", legendYPos+ 30*(lineCount+1))
            // .style("text-anchor", "beginning")
            .text(lineName)
            .attr("alignment-baseline","middle")
    }
    // dashed line
    else if (lineType == 1) {
        let dashing = "10,10";
        paths.push(graph.append("path")
            .datum(data)
            .attr("fill-opacity", fillOpacity)
            .attr("fill", lineColor)
            .attr("clip-path", "url(#clip)")
            .attr("stroke", lineColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", line)
            .attr("id", lineID)
        );
        animateLines ? animateDashedLine(paths[paths.length-1], dashing): 0;
        // update legend
        graph.append("line")
            .attr("x1", legendXPos - 30)
            .attr("x2", legendXPos)
            .attr("y1",legendYPos+ 30*(lineCount+1))
            .attr("y2",legendYPos+ 30*(lineCount+1))
            .attr("stroke-width", strokeWidth)
            .style("stroke-dasharray", "6,6")
            .style("stroke", lineColor)
        graph.append("text")
            .attr("class", "legend")
            .attr("x", legendXPos + textOffsetX)
            .attr("y", legendYPos+ 30*(lineCount+1))
            .text(lineName)
            .attr("alignment-baseline","middle")
    }
    // dotted line
    else if (lineType == 2) {
        let dashing = "1,7";
        paths.push(graph.append("path")
            .datum(data)
            .attr("fill-opacity", fillOpacity)
            .attr("fill", lineColor)
            .attr("clip-path", "url(#clip)")
            .attr("stroke-width", strokeWidth)
            .attr("stroke", lineColor)
            .attr("stroke-width", strokeWidth + 1)
            .attr("d", line)
            .attr("id", lineID)
        );
        animateLines ? animateDottedLine(paths[paths.length-1], dashing): 0;
        // update legend
        graph.append("line")
            .attr("x1", legendXPos - 28)
            .attr("x2", legendXPos)
            .attr("y1",legendYPos+ 30*(lineCount+1))
            .attr("y2",legendYPos+ 30*(lineCount+1))
            .style("stroke-dasharray", dashing)
            .attr("stroke-linecap","round")
            .attr("stroke-width", strokeWidth)
            .style("stroke", lineColor)
        graph.append("text")
            .attr("class", "legend")
            .attr("x", legendXPos + textOffsetX)
            .attr("y", legendYPos+ 30*(lineCount+1))
            .text(lineName)
            .attr("alignment-baseline","middle")
    }
    // add line to list with new id and year range
    currentLines.push(
        {
            "indicator_name": lineName,
            "id": lineID,
            "line_type": lineType,
            "min_year": min_year,
            "max_year": max_year,
        }
    )
    // change frontend selection box to new range
    updateYearRange();
    return paths;
}



/************************************************************
 * SECTION: YEAR/TIME TRACKING + UPDATES
    * global yearRange variable
    * setting/updating year range on frontend select box
    * year range filtering for dataset retrieval
*************************************************************/
// track current min/max year graph based on currentLines
var yearRange = {
    "min": 1800,
    "max": 2020
}
// set year range in selection box, based on global yearRange
function setYearOptions() {
    start = document.getElementById("start_year");
    end = document.getElementById("end_year");
    contains_start = false
    contains_end = false
    // reset options, one for each year in range
    for (let i = start.length; i >= 0 ; i--) {
        start.remove(i)
    }
    for (let i = end.length; i >= 0 ; i--) {
        end.remove(i)
    }
    for (let i = yearRange.min; i < yearRange.max; i++) {
        start.options[start.length] = new Option(i.toString(), i.toString());
        if (i == +start)
            contains_start = true
    }
    for (let i = yearRange.max; i >= yearRange.min; i--) {
        end.options[end.length] = new Option(i.toString(), i.toString());
        if (i == +end)
            contains_end = true
    }
    // update select range to prev selected start/end iff in cur. range
    start.value = contains_start ? start_year : yearRange.min
    end.value = contains_end ? end_year : yearRange.max
}
// finds the min/max year of currently selected indicators, resetting the global yearRange to reflect it
function updateYearRange() {
    let mins = []
    let maxes = []
    // build list of mins/maxes of each indicator
    currentLines.forEach(
        function(line) {
            mins.push(line.min_year);
            maxes.push(line.max_year)
        }
    )
    // update global yearRange
    yearRange.min = Math.min(mins)
    yearRange.max = Math.max(maxes)

    // update frontend selection box with correct range
    setYearOptions();

    start_sel = document.getElementById("start_year");
    end_sel = document.getElementById("end_year");
    start_year = parseInt(start_sel.options[start_sel.selectedIndex].text)
    end_year = parseInt(end_sel.options[end_sel.selectedIndex].text)
}

// selects data within the year range selected by user (global vars)
function filterYears(data) {
    output = []
    data.forEach(d => {
        if (d.year >= parseTime(yearRange.min) && d.year <= parseTime(yearRange.max)) {
            // console.log("yoo")
            // console.log(d.year)
            output.push(d)
        }
    })
    return output;
}

// parse year data into Date objects that scaleTime() can handle
var parseTime = d3.timeParse("%Y");
/************************************************************
 * SECTION: FRONTEND DYNAMIC COMPONENTS
    * download functions (datafiles + svg)
    * animation toggle button, information modal box
    * year range filtering for dataset retrieval
*************************************************************/

// Data download function
function downloadDataSource() {
    let permissionGranted = confirm("Press OK to download the csv data file.");
    if (permissionGranted) {
    //   base = "data/"
    download_button = document.getElementById("source_downloader");
    Object.keys(ccc_dataSources).forEach(key => {
        if (ccc_dataSources[key].selected) {
            download_button.href = ccc_dataSources[key].filepath;
            console.log(ccc_dataSources[key].filepath);
        }
        });
    }
    else 
        console.log("User cancelled file download.")
}
// Data download function

function downloadSvg() {
    let permissionGranted = confirm("Press OK to download the svg graphic displayed on the webpage.");
    if (permissionGranted) {
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
    downloadLink.download = "svg-graphic";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    }
    else 
        console.log("User cancelled file download.")
}
// Help modal
function infoModal() {
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }
}

// animation on/off
function toggleAnimation() {
    animate = document.getElementById("animation_btn")
//    text = document.getElementById("animate_text");
    if (animate.className == "fa-solid fa-video fa-2x") {
        animate.className = "fa-solid fa-video-slash fa-2x";
        animateGraph = false;
        updateDataFromGroup();
        //   text.textContent = "No Animation"
    }
    else {
        animate.className = "fa-solid fa-video fa-2x";
        animateGraph = true;
        updateDataFromGroup();
        //   text.textContent = "Animate!"
    }

}
// stack chart
function toggleStackChart() {
    fillOpacity = "1"
    animateGraph = false;
    // updateDataSource();
}
// line chart
function toggleLineChart() {
    fillOpacity = "0";
    animateGraph = true;
    // updateDataSource();
}
// histogram
function toggleHistogramChart() {
    id = 'histogram_toggle';
    // Turn off individually, turn on and shut other toggles off
    if (document.getElementById(id).className == "fa-solid fa-toggle-on")
    toggle(id);
    else 
    multiToggle(id);
    // Change current graph to stack view

}
