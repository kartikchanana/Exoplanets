/**
 * Created by akshaya on 11/25/16.
 */
function show_div(toShow)
{
    var navs=['motivation', 'design', 'visualization', 'about'];
    for (i = 0; i < navs.length; i++) {
        if(navs[i] != toShow){
            var notShow = document.getElementById(navs[i]);
            notShow.style.display = "none";
            var notshowA = document.getElementById(navs[i] + "A");
            notshowA.setAttribute("class", "");
        }else{
            var show = document.getElementById(toShow);
            show.style.display = "";
            var showA = document.getElementById(toShow + "A");
            showA.setAttribute("class", "active");
        }
    }

}

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
    habitable_starDist = "pl_habitable_data",
    planetName = "pl_name",
    planetRadii = "pl_radj",
    planetMass = "pl_bmassj",
    planetDiscMethod = "pl_discmethod",
    planetOrbitalPeriod = "pl_orbper",
    planetOrbitalInclination = "pl_orbincl",
    starRadii = "st_rad";

var neg_val = -200000;


d3.csv("planets_updated.csv", function(data) {
    var dateFormat = d3.time.format('%Y');
    var parseDate = dateFormat.parse;
    data.forEach(function(d) {
        d.dd = dateFormat.parse(d.pl_disc);
        d.pl_disc_year = d.dd;


        if(d.st_dist == 0) {
            d.st_dist = +neg_val;
        } else {
            d.st_dist= +d.st_dist;
        }

        if( d.pl_radj == 0) {
            d.pl_radj= +neg_val;
        } else {
            d.pl_radj= +d.pl_radj;
        }
        if( d.pl_bmassj == 0) {
            d.pl_bmassj= +neg_val;
        }
        d.pl_num = +d.pl_num;
        if( d.pl_orbper == 0) {
            d.pl_orbper= +neg_val;
        }
        d.pl_orbsmax = +d.pl_orbsmax;
        d.pl_orbincl = +d.pl_orbincl;
        d.st_teff = +d.st_teff;
        d.st_mass = +d.st_mass;
        d.st_rad = +d.st_rad;
        d.pl_eqt = +d.pl_eqt;
        d.pl_locale = +d.pl_locale;
        d.pl_telescope = +d.pl_telescope;
        d.pl_mnum =+d.pl_mnum;
        d.rowid = +d.rowid;
        if( d.pl_habitable_data  == 0) {
            d.pl_habitable_data = +neg_val;
        }

    });
    var format = d3.time.format("%Y"),
        mindate = format.parse("1988"),
        maxdate = format.parse("2017");
    var xMax = maxdate,
        xMin = mindate;
    var yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
        yMin = d3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > -400 ? -400 : yMin;
        yMin = 0; //Since we need to ignore negative values
    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    x2.domain(x.domain());
    y2.domain(y.domain());


    var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickSize(-height);



    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    var color = d3.scale.ordinal()
        .domain(["Radial Velocity", "Imaging", "Timing & Astrometry", "Transit","Microlensing"])
        .range(["#6a4e6d", "#972702", "#4982c3","#fcca6e","#f46d43"]);

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {

            var sd = "NA",
                pr ="NA",
                pm = "NA",
                pop = "NA",
                poi = "NA",
                sr = "NA";

            if(d[starDist]!=neg_val)
                sd = d[starDist].toString();
            if(d[planetRadii]!=neg_val)
                pr = d[planetRadii].toString() + "j";
            if(d[planetMass]!=neg_val)
                pm = d[planetMass].toString() +"j";
            if(d[planetOrbitalPeriod]!=neg_val)
                pop = d[planetOrbitalPeriod].toString();
            if(d[planetOrbitalInclination]!= 0)
                poi = d[planetOrbitalInclination].toString();
            if(d[starRadii]!=0)
                sr = d[starRadii].toString();


            return "Planet Name: " + d[planetName] + "<br>Distance from Earth: " + sd+
                "<br>Planet Radius: " + pr + "<br>Planet Mass: " + pm+
                "<br>Discovery Method: " + d[planetDiscMethod] + "<br>Orbital Period: " + pop+
                "<br>Orbital Inclination: " + poi + "<br>Star Radius: " + sr;

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
        .attr("x", width )
        .attr("y", margin.bottom - 17)
        .style("text-anchor", "end")
        .style("font-size","14px")
        .attr("fill", "white")
        .text("Discovery Year");

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size","14px")
        // .text(yCat);
        .text(function(d) {
            if(yCat == starDist){
                return "Approximate distance From Earth to the planet in Parsecs";
            }
            if(yCat == planetRadii){
                return "Approximate Radius as compared to Jupiter's";
            }
            if (yCat == planetMass){
                return "Approximate Mass as compared to Jupiter's"
            }
            if(yCat == planetOrbitalPeriod){
                return "Approximate orbital period in earth days";
            }
        });

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
        .attr("r", 5)
        .attr("transform", transform)
        .style("fill", function(d) { return color(d[colorCat]); })
        // .style("fill", function(d) { return colores_google(d[colorCat]); } )
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
	.on("click", function(d) {
					placeSystemModel(data, d);
				});

    // d3.select("input").on("click", change;
    d3.select("select").on("change", change);
    d3.selectAll("g")
        .attr("fill", "white");
    d3.select("body")
        .attr("fill", "white");



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
        yMin = 0; //Again, ignoring negaive values
        console.log("yMax:"+yMax+" yMin:"+yMin);
        zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

        var svg = d3.select("#scatter").transition();

        svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(
            function(d) {
                if(yCat == starDist){
                    return "Approximate distance From Earth in Parsecs";
                }
                if(yCat == planetRadii){
                    return "Approximate Radius as compared to Jupiter's";
                }
                if (yCat == planetMass){
                    return "Approximate Mass as compared to Jupiter's"
                }
                if(yCat == planetOrbitalPeriod){
                    return "Approximate orbital period in earth days";
                }
                if(yCat == habitable_starDist){
                    return "All systems with habitable zone sorted with distane from Earth in parsecs";
                }
            });

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

});


function placeSystemModel(planets, pl)
{
d3.select("#my1").style("display", "block");
d3.select("#my2").style("display", "block");
d3.selectAll(".system_model").remove(); //clear previous image.

var w = 700;
var h = 500;
var scaleAuFactor = 50;
var msInDay = 50;
var RE = 4;
var RJ = RE * 3;
var stopTimer = false;

var systems = [];

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function indexOfEl(a, el)
{
	for(var i = 0; i < a.length; i++)
	{
		if(a[i] == el)
			return i;
	}
	return -1;
}

    d3_queue.queue()
    .defer(d3.csv, 'hab_zone.csv')
    .await(processData);

function processData(error, hab_zones) {

  if (error)
  {
        console.error('Error: ' + error);
  }

  var uSystems = [];

  var i = 0;
  var j = 0;
  planets.forEach(function(planet)
	        {

			if(!contains(uSystems, planet["pl_hostname"]))
			{
				uSystems.push(planet["pl_hostname"]);

				var planets = [];
				var planet_el = {
						 orbit_period: (planet["pl_orbper"] == neg_val)? 365 : planet["pl_orbper"],
						 maj_axis: (planet["pl_orbsmax"] == "")? 5 : planet["pl_orbsmax"],
						 min_axis: 0,
						 eccentr: (planet["pl_orbeccen"]=="")? 0 : planet["pl_orbeccen"],
						 planet_name: planet["pl_name"],
						 radius: (planet["pl_radj"] == neg_val)? -1 : planet["pl_radj"],
						 speed: (planet["pl_orbper"] != "")? msInDay / planet["pl_orbper"] : 0.01,
						 mass: planet["pl_bmassj"],
						 name: planet["pl_hostname"] + "-" + planet["pl_letter"]
						}
				planets.push(planet_el);
				systems[i] = {name: planet["pl_hostname"], num_planets: 1, pl_set: planets, ri: 0, ro: 0, scale_factor: scaleAuFactor / planet_el["maj_axis"]};
				i++;
			}
			else
			{
				systems[indexOfEl(uSystems, planet["pl_hostname"])]["num_planets"]++;

				var planet_el = {
						 orbit_period: (planet["pl_orbper"] == neg_val)? 365 : planet["pl_orbper"],
						 maj_axis: (planet["pl_orbsmax"] == "")? 5 : planet["pl_orbsmax"],
						 min_axis: 0,
						 eccentr: (planet["pl_orbeccen"]=="")?0:planet["pl_orbeccen"],
						 planet_name: planet["pl_name"],
						 radius: (planet["pl_radj"] == neg_val)? -1 : planet["pl_radj"],
						 speed: (planet["pl_orbper"] != "")? msInDay / planet["pl_orbper"] : 0.01,
						 mass: planet["pl_bmassj"],
						 name: planet["pl_hostname"] + "-" + planet["pl_letter"]
						}
				systems[indexOfEl(uSystems, planet["pl_hostname"])]["pl_set"].push(planet_el);
			}
                });


  hab_zones.forEach(function(hab_zone)
                {
			var i = indexOfEl(uSystems, hab_zone["name"])
			systems[i]["ri"] = hab_zone["ri"];
			systems[i]["ro"] = hab_zone["ro"];
                });

  var index = 317;
  //index = 2334;
  //index = 2424; //524 <----- strange!
  //index = 524;
  //index = 2245;
  //index = 1664;
  //index = 2486;
  var tmp = 0;
  for(var i = 0; i < systems.length; i++)
  {
	if(systems[i]["ri"] != 0)
	{
		if(tmp < 10)
		{
			tmp++;
			continue;
		}
		else
		{
			index = i;
			break;
		}
	}
	if(systems[i]["name"] == "CoRoT-16") //HIJI 865.0519031141869 ups And HIJI 736.3770250368188
	{
		index = i;
		break;
	}
  }


  //index = Math.floor(Math.random() * (systems.length - 1));
  //index = 1663;
  //console.log("index: ", index);
  //console.log(systems[index]); */

  for(var i = 0; i < systems.length; i++)
  {
  	if(systems[i]["name"] == pl["pl_hostname"])
  	{
  		index = i;
  		break;
  	}
  }
  console.log("NAME:", pl["pl_hostname"]); 
  //console.log(index);
  //console.log("nipah: ", systems[i]["pl_set"][0]);
  var svg = d3.select("#my1")
              .insert("svg")
              .attr("width", w)
              .attr("height", h)
	      .attr("class", "system_model");

  var svg1 = d3.select("#my2")
               .insert("svg")
                .attr("x", 155)
                .attr("y", 10)
               .attr("width", 155)
               .attr("height", h)
	       .attr("class", "system_model");


  svg.append("circle")
     .attr("r", ((systems[index]["scale_factor"] * systems[index]["ro"]) > 250)? 0 : (systems[index]["scale_factor"] * systems[index]["ro"]))
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "hab_zone_ro");
  
  svg.append("circle")
     .attr("r", ((systems[index]["scale_factor"] * systems[index]["ro"]) > 250)? 0 : (systems[index]["scale_factor"] * systems[index]["ri"]))
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "hab_zone_ri");

  console.log("Earth orbit: ", systems[index]["scale_factor"]);
  svg.append("circle")
     .attr("class", "earth_orbit")
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("r", (systems[index]["scale_factor"] > 2000)?0:systems[index]["scale_factor"]); console.log("SSS", systems[index]["scale_factor"] * systems[index]["pl_set"][systems[index]["pl_set"].length - 1]["maj_axis"]);
 
  svg.append("circle")
     .style("fill", "black")
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("r", systems[index]["scale_factor"]-8);

  svg.append("circle")
     .attr("r", 10)
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "sun").datum(systems[index]);

  var container = svg.append("g")
        .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
  var cr = 0;
  var cb = 0;
  container.selectAll("g.planet")
           .data(systems[index]["pl_set"]).enter()
           .append("g").each(function(d) 
					{
						placeOrbit(d, this, index);
						
          					d3.select(this).append("circle")
							       .attr("r", function()
										{
											if(d["radius"] != "" && d["radius"] > 0)
												if(d["radius"] > 0.25)
													return (RJ * d["radius"] > 14) ? 14 : RJ * d["radius"];
												else
													return (RE * d["radius"] < 2) ? 2 : RE * d["radius"];
											//console.log(d["mass"]);
											if(d["mass"] != "")
												if(d["mass"] > 0.03)
													return (RJ * d["mass"] > 14) ? 14 : (RJ * d["mass"] < 8)? 8 : RJ * d["mass"];
												else
													return (d["mass"] / 0.003 * RE > 8)? 8 : (d["mass"] / 0.003 * RE < 2)? 2 : d["mass"] / 0.003 * RE;
											return 5;
										})
							       .attr("cx",d["maj_axis"] * systems[index]["scale_factor"] * d["eccentr"] + d["maj_axis"] * systems[index]["scale_factor"])
            						       .attr("cy", 0)
							       .attr("class", "planet")
							       .on("mouseover", function()
										{
											stopTimer = true;
										})
							       .on("mouseout", function()
									       {
											stopTimer = false;
									       })
							       .style("fill", function()
									      {
										if(cr == 0 && (d["mass"] / 0.003 >= 10))
										{
											svg1.append("circle")
										    	.attr("r", 10)
										    	.attr("cx", 20)
											.attr("cy", 350)
											.style("fill", "#e73b3b")
											.style("stroke", "white")
											.attr("class", "red_pl");

                                            svg1.selectAll("exoleast").remove();
                                            svg1.selectAll("exolegend").remove();
                                            svg1.append("text")
                                                .attr("x", 0)
                                                .attr("y", 320)
                                                .text("Exopanet solar system")
                                                .attr("font-size", "15px")
                                                .attr("fill", "white")
                                                .attr("class", "exolegend");


                                            svg1.append("text")
                                                .attr("x", 35)
                                                .attr("y", 354)
                                                .attr("font-size", "14px")
                                                .style("fill", "white")
                                                .text("Atleast 10x Earth")
                                                .attr("class", "exoleast");
											cr++;
										}
										if(cb == 0 && (d["mass"] / 0.003 < 10))
										{
											svg1.append("circle")
										    	.attr("r", 5)
										    	.attr("cx", 100/5)
											.attr("cy", 385)
											.style("fill", "#4e9cc9")
											.style("stroke", "white")
											.attr("class", "blue_pl");

                                            svg1.selectAll("exomost").remove();
                                            svg1.selectAll("exolegend").remove();
                                            svg1.append("text")
                                                .attr("x", 0)
                                                .attr("y", 320)
                                                .text("Exopanet solar system")
                                                .attr("font-size", "15px")
                                                .attr("fill", "white")
                                                .attr("class", "exolegend");

                                            svg1.append("text")
                                                .attr("x", 35)
                                                .attr("y", 389)
                                                .attr("font-size", "14px")
                                                .style("fill", "white")
                                                .text("Atmost 10x Earth")
                                                .attr("class", "exomost");

											cb++;
										}
										return (d["mass"] / 0.003 < 10)? "#4e9cc9":"#e73b3b";
									      });
        				});
  var t = 0;
  var startTime = new Date().getTime();
  var numCalled = 0;

  var tmp2 = svg.selectAll(".planet");
  var speed = [];

  var tmp3 = svg.selectAll(".earth_orbit");

  //console.log("TMP2:", tmp3[0][0]);

  for(var i = 0; i < tmp2[0].length; i++)
  {
	speed[i] = 0;
  }

  var maxSpeedInd = 0;
  for(var i = 1; i < systems[index]["pl_set"].length; i++)
  {
	if(systems[index]["pl_set"][i]["speed"] > systems[index]["pl_set"][maxSpeedInd]["speed"])
		maxSpeedInd = i;
  }

  var speedScaleFactor = 1;
  while(systems[index]["pl_set"][maxSpeedInd]["speed"] > 0.25)
  {
	systems[index]["pl_set"][maxSpeedInd]["speed"] /= 10;
	speedScaleFactor *= 10;
  }

  for(var i = 0; i < systems[index]["pl_set"].length; i++)
  {
	if(i != maxSpeedInd)
		systems[index]["pl_set"][i]["speed"] /= speedScaleFactor;
  }

    svg1.append("text")
        .attr("x", 22)
        .attr("y", 160)
        .text("SIZE LEGEND")
        .attr("font-size", "16px")
        .attr("fill", "white")
        .attr("class", "text");

    svg1.append("text")
        .attr("x", 15)
        .attr("y", 198)
        .text("Our solar system")
        .attr("font-size", "15px")
        .attr("fill", "white")
        .attr("class", "text");
  svg1.append("circle")
      .attr("r", RJ)
      .attr("cx", 100/5)
      .attr("cy", h/2 - 25)
      .attr("class", "ref_j");

    svg1.append("text")
        .attr("x", 35)
        .attr("y", 230)
        .text("Jupiter")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr("class", "text");

  svg1.append("circle")
      .attr("r", RE)
      .attr("cx", 100/5)
      .attr("cy", h/2 + 25)
      .attr("class", "ref_e");

    svg1.append("text")
        .attr("x", 35)
        .attr("y", 278)
        .text("Earth")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr("class", "text");


$('.planet').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
	  var d = this.__data__;
          return d["name"] + "<br/>" + "Distance to star: " + parseFloat(d["maj_axis"]) + " AU" + "<br/>" + "Radius: " + ((d["radius"] < 0)?"Undefined":parseFloat(d["radius"])) + "<br/>" + "Mass: " + ((d["mass"] == "ou")?"":(parseFloat(d["mass"]) + " Jupiter masses"));
        }
      });

$('.hab_zone_ro').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return "habitable zone"; 
        }
      });

$('.sun').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() 
	{
	  var d = this.__data__;
          return d["name"] + "<br/>" + "Number of planets: " + d["num_planets"]; 
        }
      });

$('.earth_orbit').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() 
	{
          return "1 Astronomical Unit (AU) <br/> 1 AU equals the distance from the planet Earth to the Sun" ;
        }
      });

$('.ref_e').tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() 
	{
          return "Size of the Earth" ; 
        }
      });

$('.red_pl').tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() 
	{
          return "Planet with the mass at least 10 masses of the Earth" ; 
        }
      });

$('.blue_pl').tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() 
	{
          return "Planet with the mass at most 10 masses of the Earth" ; 
        }
      });

var el = $('.ref_e');
console.log("El:", el);
console.log(el.tipsy('show'));

$('.ref_j').tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() 
	{
          return "Size of the Jupiter" ; 
        }
      });

  //console.log(speed);

  //for(var i = 0; i < tmp4[0].length; i++)
  //{
	//svg.attr("transform", "scale(0.5)");
	//svg.attr("transform", "translate(" + w/2 + "," + h/2 + ")");

  var orbs = d3.selectAll(".orbit");
  console.log(orbs[0][orbs[0].length - 1].attributes.rx.value);
  //console.log(orbs[0][1].attributes.ry.value);
  console.log(orbs[0][orbs[0].length - 1].attributes.cx.value);

  var star = d3.selectAll(".sun");
  var eo = d3.selectAll(".earth_orbit");
  var ref = d3.selectAll(".ref_j");
  //console.log("REF:", ref[0]);
  var scaleByEarthOrbit = false;
  if( (parseFloat(eo[0][0].attributes.r.value) > h / 2) && (parseFloat(eo[0][0].attributes.r.value) > parseFloat(orbs[0][orbs[0].length - 1].attributes.cx.value)))
	scaleByEarthOrbit = true;


  if(!scaleByEarthOrbit && parseFloat(orbs[0][orbs[0].length - 1].attributes.cx.value) + parseFloat(orbs[0][orbs[0].length - 1].attributes.rx.value) >= w)
  {
	var scaleInd = (w / 2) / (parseFloat(orbs[0][orbs[0].length - 1].attributes.cx.value) + parseFloat(orbs[0][orbs[0].length - 1].attributes.rx.value));
	
	if(parseFloat(orbs[0][orbs[0].length - 1].attributes.ry.value) > h)
	{
		var scaleInd2 = (h / 2) / parseFloat(orbs[0][orbs[0].length - 1].attributes.ry.value);
		scaleInd = (scaleInd < scaleInd2)?scaleInd:scaleInd2;
	}

	svg.attr("transform", "scale(" + scaleInd +")");
	//svg.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 10);
        svg.attr("transform", function(d)
			      {
					return "translate(" + (w/2 - scaleInd * parseFloat(star[0][0].attributes.cx.value) - 20) + "," + (h/2 - scaleInd * parseFloat(star[0][0].attributes.cy.value) - 10) + ") " + this.getAttribute("transform");
			      });
	svg1.attr("transform", function(d)
				{
					console.log("here", parseFloat(orbs[0][orbs[0].length - 1].attributes.ry.value));
					return "scale(" + scaleInd + ") " + "translate(" + (100/2 - scaleInd * parseFloat(ref[0][0].attributes.cx.value)) + "," + (h/2 - scaleInd * parseFloat(ref[0][0].attributes.cy.value)) + ")";  
				}); 
  }
  else
	if(scaleByEarthOrbit)
	{
		//console.log("HIJI", eo[0][0].attributes.r.value);
		var scaleInd = (h / 2) / parseFloat(eo[0][0].attributes.r.value);
		svg.attr("transform", "scale(" + scaleInd +")");
        	svg.attr("transform", function(d)
				      {
					return "translate(" + (w/2 - scaleInd * parseFloat(star[0][0].attributes.cx.value) - 20) + "," + (h/2 - scaleInd * parseFloat(star[0][0].attributes.cy.value)) + ") " + this.getAttribute("transform");
			      		});

		svg1.attr("transform", function(d)
					{
						return "translate(" + (100/2 - scaleInd * parseFloat(ref[0][0].attributes.cx.value)) + "," + (h/2 - scaleInd * parseFloat(ref[0][0].attributes.cy.value)) + ") " + "scale(" + scaleInd + ")";  
					});  
	}

  //} 

  d3.timer(function() {

	if(stopTimer)
		return;
        var time = new Date().getTime();
	time -= startTime
	if(time < 50)
	 return;


	var tmp = svg.selectAll(".orbit");

	//console.log(tmp[0][2].data);

        svg.selectAll(".planet")
           .attr("cx", function(d, i) 
		       {
          			var x = parseFloat(tmp[0][i].attributes.cx.value) + parseFloat(d["maj_axis"]) * systems[index]["scale_factor"] * Math.cos(speed[i]);
				//console.log(d["maj_axis"] * scaleAuFactor * Math.cos(t));
				//var x = parseFloat(this.attributes.cx.value) + 1; 
				//console.log(i);
	  			return x;
        	       })
	   .attr("cy", function(d, i)
		       {
				var y = parseFloat(tmp[0][i].attributes.cy.value) + parseFloat(d["min_axis"]) * Math.sin(speed[i]);
				//console.log(d["min_axis"] * scaleAuFactor * Math.sin(t));
				//var y = parseFloat(this.attributes.cy.value) + 1;
				speed[i] += d["speed"];
				return y;
		       });
	t += 0.1;

	numCalled++;
        startTime = new Date().getTime();
      });

}

function placeOrbit(d, t, index)
{
	if(d["eccentr"] == 0)
		placeCircularOrbit(d, t, index);
	else
		placeEllOrbit(d, t, index);

}

function placeCircularOrbit(d, t, index)
{
	    d3.select(t).append("ellipse")
			.attr("class", "orbit")
			.attr("cx", function()
				    {
					return Math.floor(d["maj_axis"] * systems[index]["scale_factor"] * d["eccentr"]);
				    })
			.attr("cy", 0)
			.attr("rx", d["maj_axis"] * systems[index]["scale_factor"])
			.attr("ry", function()
				    {
					d["min_axis"] = d["maj_axis"] * systems[index]["scale_factor"];
					return d["maj_axis"] * systems[index]["scale_factor"];
				    });

}

function placeEllOrbit(d, t, index)
{
	    d3.select(t).append("ellipse")
			.attr("class", "orbit")
			.attr("cx", function()
				    {	
					return Math.floor(d["maj_axis"] * systems[index]["scale_factor"] * d["eccentr"]);
				    })
			.attr("cy", 0)
			.attr("rx", d["maj_axis"] * systems[index]["scale_factor"])
			.attr("ry", function()
				    {
					var c = d["maj_axis"] * systems[index]["scale_factor"] * d["eccentr"]
					var b = d["maj_axis"] * systems[index]["scale_factor"];
					b *= b;
					c *= c;
					b -= c;
					//console.log("b: ", Math.sqrt(b));
					d["min_axis"] = Math.floor(Math.sqrt(b));
					return Math.floor(Math.sqrt(b));
				    });
}

}
