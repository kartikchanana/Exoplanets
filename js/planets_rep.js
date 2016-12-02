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

    var brush = d3.svg.brush()
                .x(x2)
                .on("brush", brushed);




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
        .attr("fill", "white")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("fill", "white")
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
        .attr("fill", "white")
        .call(zoom);



    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .call(zoomBeh);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .attr("fill", "white")
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
        .on("mouseout", tip.hide)
        .on("click", show_system);

    // d3.select("input").on("click", change;
    d3.select("select").on("change", change);
    d3.selectAll("g")
        .attr("fill", "white");
    d3.select("body")
        .attr("fill", "white");


    function show_system(element) {
        var planet_name = element.pl_name;
        var svg_height = d3.select("svg")
            .attr("height");
        if(svg_height == 500){
        d3.select("svg")
            .attr("height", outerHeight+150);}
        else if(svg_height == 650){
            d3.select("svg")
                .attr("height", outerHeight);
        }

        var system = svg.append("rect")
            .attr("class", "system")
            .attr("width", width)
            .attr("height", 200)
            .attr("x", 0)
            .attr("y", height+50)
            .style("fill", "red");
    }

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
        .attr("r", 3.5)
        .attr("cx", width + 20)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width + 26)
        .attr("dy", ".35em")
        .text(function(d) { return d; });


    function brushed() {
        console.log("inside brushed function, what should i check?");
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
        // Reset zoom scale's domain
        zoom.x(x);
    }

    function draw() {
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
        // Force changing brush range
        brush.extent(x.domain());
        svg.select(".brush").call(brush);
    }



});