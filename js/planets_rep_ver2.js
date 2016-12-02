/**
 * Created by akshaya on 11/25/16.
 */
var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    margin2 = { top: 430, right:300, bottom: 20, left: 50},
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom,
    height2 = outerHeight - margin2.top - margin2.bottom;

// var x = d3.scale.linear()
var x = d3.time.scale()
    .range([0, width]).nice();
var x2 = d3.time.scale()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();
var y2 = y2 = d3.scale.linear()
    .range([height2, 0]).nice();

var xCat = "pl_disc_year",
    yCat = "st_dist",
    rCat = "pl_radj",
    colorCat = "pl_discmethod",
    starDist = "st_dist",
    planetName = "pl_name",
    planetRadii = "pl_radj",
    planetMass = "pl_bmassj",
    planetDiscMethod = "pl_discmethod",
    planetOrbitalPeriod = "pl_orbper",
    planetOrbitalInclination = "pl_orbincl",
    starRadii = "st_rad";


d3.csv("planets_updated.csv", function(data) {
    var dateFormat = d3.time.format('%Y');
    var parseDate = dateFormat.parse
    // console.log("entering into the data"+dateFormat);
    // console.log("parseDate"+parseDate);
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
        d.pl_num = +d.pl_num;
        d.pl_orbper = +d.pl_orbper;
        // console.log("orbital period is "+d.pl_orbper);
        d.pl_orbsmax = +d.pl_orbsmax;
        d.pl_orbincl = +d.pl_orbincl;
        d.st_teff = +d.st_teff;
        d.st_mass = +d.st_mass;
        d.st_rad = +d.st_rad;
        // d.pl_name= +d.pl_name;
        // console.log("what's the planets name?"+d.pl_name);
        d.pl_eqt = +d.pl_eqt;
        d.pl_locale = +d.pl_locale;
        d.pl_telescope = +d.pl_telescope;
        d.pl_mnum =+d.pl_mnum;
        // d.Potassium = +d.Potassium;
        // d["Protein (g)"] = +d["Protein (g)"];
        // d["Serving Size Weight"] = +d["Serving Size Weight"];
        // d.Sodium = +d.Sodium;
        // d.Sugars = +d.Sugars;
        // d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];
    });
    var format = d3.time.format("%Y"),
        mindate = format.parse("1988"),
        maxdate = format.parse("2017");
    var xMax = maxdate,
        xMin = mindate;
    var yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
        yMin = d3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > -400 ? -400 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    x2.domain(x.domain());
    y2.domain(y.domain());


    var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickSize(-height);

    var xAxis2 = d3.svg.axis()
                .scale(x2)
                .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    // var brush = d3.svg.brush()
    //             .x(x2)
    //             .on("brush", brushed);




    // var color = d3.scale.category10();

    var color = d3.scale.ordinal()
        .domain(["Radial Velocity", "Imaging", "Eclipse Timing Variations", "Transit", "Astrometry",
                "Orbital Brightness Modulation", "Pulsation Timing Variations", "Transit Timing Variations",
                "Microlensing", "Pulsar Timing"])
        .range(["#1a9850", "#66bd63", "#a6d96a","#d9ef8b","#ffffbf",
                "#fee08b","#fdae61","#f46d43","#d73027","aaaccc"]);


    function colores_google(n) {
        var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618",
                        "#990099", "#0099c6", "#dd4477", "#66aa00",
                        "#b82e2e", "#316395", "#994499", "#22aa99",
                        "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                        "#651067", "#329262", "#5574a6", "#3b3eac"];
        return colores_g[n % colores_g.length];
    }



//addition for brushing-kartik
    var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys

        return {
            name: name, // "name": the csv headers except date
            values: data.map(function(d) { // "values": which has an array of the dates and ratings
                return {
                    date: d.pl_disc_year,
                    rating: +(d[name]),
                };
            })};
    });





    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {

            return "Planet Name: " + d[planetName] + "<br>Distance from Earth: " + d[starDist]+
            "<br>Planet Radius: " + d[planetRadii]+"j" + "<br>Planet Mass: " + d[planetMass]+"j"+
            "<br>Discovery Method: " + d[planetDiscMethod] + "<br>Orbital Period: " + d[planetOrbitalPeriod]+
            "<br>Orbital Inclination: " + d[planetOrbitalInclination] + "<br>Star Radius: " + d[starRadii];

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

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d[xCat]); })
        .y0(height2)
        .y1(function(d) { return y2(d[yCat]); });


    // Add rect cover the zoomed graph and attach zoom event.
    var rect = svg.append("svg:rect")
        .attr("class", "pane")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);



    //for slider part-----------------------------------------------------------------------------------

    var context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + 420 + ")")
        .attr("class", "context");

    //append clip path for lines plotted, hiding those part out of bounds
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    //end slider part-----------------------------------------------------------------------------------
    //for slider part-----------------------------------------------------------------------------------

    var brush = d3.svg.brush()//for slider bar at the bottom
        .x(x2)
        .on("brush", brushed);

    context.append("g") // Create brushing xAxis
        .attr("class", "x axis1")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
        .interpolate("monotone")
        .x(function(d) { return x2(d.pl_disc_year); }) // x is scaled to xScale2
        .y0(height2) // Bottom line begins at height2 (area chart not inverted)
        .y1(0); // Top line of area, 0 (area chart not inverted)

    //plot the rect as the bar at the bottom
    context.append("path") // Path is created using svg.area details
        .attr("class", "area")
        .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator
        .attr("fill", "#F1F1F2");

    //append the brush for the selection of subsection
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2) // Make brush rects same height
        .attr("fill", "#E6E7E8");
    //end slider part-----------------------------------------------------------------------------------





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
        // .attr("r", function (d) { return 10 * Math.sqrt(d[rCat] / Math.PI); })
        .attr("r", 5)
        .attr("transform", transform)
        .style("fill", function(d) { return color(d[colorCat]); })
        // .style("fill", function(d) { return colores_google(d[colorCat]); } )
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);



    // d3.select("input").on("click", change);
    d3.select("select").on("change", change);

    // focus.append("path")
    //     .datum(data)
    //     .attr("class", "area")
    //     .attr("d", area);
    //
    // focus.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);
    //
    // focus.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

    // context.append("path")
    //     .datum(data)
    //     .attr("class", "area")
    //     .attr("d", area2);
    //
    // context.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height2 + ")")
    //     .call(xAxis2);
    //
    // context.append("g")
    //     .attr("class", "x brush")
    //     .call(brush)
    //     .selectAll("rect")
    //     .attr("y", -6)
    //     .attr("height", height2 + 7);


    function change() {

        console.log("reached in the change function");
        var selectedValue = d3.event.target.value;
        console.log("let's see what is the selectedValue"+selectedValue);
        yCat = selectedValue;
        // if(yCat == "st_dist"){
        //     yCat = "pl_bmassj"
        // } else {
        //     yCat = "st_dist"
        // }
        yMax = d3.max(data, function(d) { return d[yCat]; });
        yMin = d3.min(data, function(d) { return d[yCat]; });
        console.log("yMax:"+yMax+" yMin:"+yMin);
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
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", width + 20)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width + 26)
        .attr("dy", ".35em")
        .text(function(d) { return d; });


    //for brusher of the slider bar at the bottom
    function brushed() {

        x.domain(brush.empty() ? x2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent

        svg.select(".x.axis") // replot xAxis with transition when brush used
            .transition()
            .call(xAxis);

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

        svg.select(".y.axis") // Redraw yAxis
            .transition()
            .call(yAxis);

        legend.select("circle") // Redraw lines based on brush xAxis scale and domain
            .transition()
            .attr("d", function(d){
                return d.visible ? dot(d.values) : null; // If d.visible is true then draw line for this d selection
            });

    }// End Data callback function

    // function brushed() {
    //     console.log("inside brushed function, what should i check?");
    //     x.domain(brush.empty() ? x2.domain() : brush.extent());
    //     focus.select(".area").attr("d", area);
    //     focus.select(".x.axis").call(xAxis);
    //     // Reset zoom scale's domain
    //     zoom.x(x);
    // }

    function draw() {
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
        // Force changing brush range
        brush.extent(x.domain());
        svg.select(".brush").call(brush);
    }



});