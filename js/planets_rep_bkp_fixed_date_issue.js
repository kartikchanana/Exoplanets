/**
 * Created by akshaya on 11/25/16.
 */
var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

// var x = d3.scale.linear()
var x = d3.time.scale()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "pl_disc_year",
    yCat = "st_dist",
    rCat = "pl_radj",
    colorCat = "pl_discmethod";

d3.csv("planets_updated.csv", function(data) {
    var dateFormat = d3.time.format('%Y');
    var parseDate = dateFormat.parse
    console.log("entering into the data"+dateFormat);
    console.log("parseDate"+parseDate);
    data.forEach(function(d) {
        d.dd = dateFormat.parse(d.pl_disc);
        // console.log("entering into the loop"+d.dd+"typeof"+typeof d.dd);
        d.pl_disc_year = d.dd;
        // d.pl_disc_year = d.dd.getFullYear().toString();
        // d.pl_disc_year = d3.time.year(d.dd);
        // console.log("print kara de ae khuda"+d.pl_disc_year+" type 0f"+typeof d.pl_disc_year);
        // d.pl_disc = +d.pl_disc;
        // console.log("this planet discovered in "+d.pl_disc)
        d.st_dist = +d.st_dist;
        // d["pl_discmethod"] = +d["pl_discmethod"];
        // d["Dietary Fiber"] = +d["Dietary Fiber"];
        // d["Display Shelf"] = +d["Display Shelf"];
        d.pl_radj = +d.pl_radj;
        d.pl_bmassj = +d.pl_bmassj;
        // d.Potassium = +d.Potassium;
        // d["Protein (g)"] = +d["Protein (g)"];
        // d["Serving Size Weight"] = +d["Serving Size Weight"];
        // d.Sodium = +d.Sodium;
        // d.Sugars = +d.Sugars;
        // d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];
    });
    var format = d3.time.format("%m/%Y"),
        mindate = format.parse("01/1988"),
        maxdate = format.parse("01/2017");
    // var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
    var xMax = maxdate,
    //     xMin = d3.min(data, function(d) { return d[xCat]; }),
    //     xMin = xMin > 0 ? 0 : xMin,
        xMin = mindate;
    var yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
        yMin = d3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > 0 ? 0 : yMin;

    // var xMin = new Date(Math.min.apply(null, function(d){return d.pl_disc_year;}));

    // var xMax = new Date(Math.max.apply(null, function(d){return d.pl_disc_year;}));
    
    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xScale = d3.time.scale()
        // .domain([xMin, xMax])    // values between for month of january
        .range([0, width ]);   // map these the the chart width = total width minus padding at both sides
    console.log("xMax->"+xMax+" xMin->"+xMin);
    xScale.domain([xMin, xMax]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    var color = d3.scale.category10();

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+
            "<br>"+rCat+ ": " + d[rCat] + "<br>" + colorCat + ": " + d[colorCat];
        });

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text(xCat);

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yCat);

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", function (d) { return 10 * Math.sqrt(d[rCat] / Math.PI); })
        .attr("transform", transform)
        .style("fill", function(d) { return color(d[colorCat]); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);



    d3.select("input").on("click", change);

    // function change() {
    //     xCat = "Carbs";
    //     xMax = d3.max(data, function(d) { return d[xCat]; });
    //     xMin = d3.min(data, function(d) { return d[xCat]; });
    //
    //     zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));
    //
    //     var svg = d3.select("#scatter").transition();
    //
    //     svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);
    //
    //     objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    // }

    function change() {
        if(yCat == "st_dist"){
            yCat = "pl_bmassj"
        } else {
            yCat = "st_dist"
        }
        yMax = d3.max(data, function(d) { return d[yCat]; });
        yMin = d3.min(data, function(d) { return d[yCat]; });

        zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

        var svg = d3.select("#scatter").transition();

        svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(yCat);

        objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    }

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
    }

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .classed("legend", true)
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("circle")
        .attr("r", 3.5)
        .attr("cx", width + 20)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width + 26)
        .attr("dy", ".35em")
        .text(function(d) { return d; });


    //  Code Borrowed from outside starts
    /*var issue = svg.selectAll(".issue")
        // .data(categories) // Select nested data and append to new svg group elements
        .data(colorCat)
        .enter().append("g")
        .attr("class", "issue");

    issue.append("path")
        // .attr("class", "line")
        .attr("class", "scatter")
        // .style("pointer-events", "none") // Stop line interferring with cursor
        .attr("id", function(d) {
            console.log("what's happending????"+d);
            return "line-" + d[colorCat].replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
        })
        .attr("d", function(d) {
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't
        })
        .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
        .style("stroke", function(d) { return color(d.name); });
        */
    //  Code Borrowed from outside ends






});