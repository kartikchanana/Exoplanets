var w = 1500;
var h = 1500;
var scaleAuFactor = 10;
var msInDay = 50;
var RE = 3;
var RJ = RE * 5;
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

queue()
	.defer(d3.csv, 'planets.csv')
	.defer(d3.csv, 'hab_zone.csv')
	.await(processData);

function processData(error, planets, hab_zones) {

  if (error) 
  {
        console.error('Oh dear, something went wrong: ' + error);
  }

  var uSystems = [];
  //var systems = [];

  var i = 0;
  var j = 0;
  planets.forEach(function(planet) 
	        {
			if(!contains(uSystems, planet["pl_hostname"]))
			{
				uSystems.push(planet["pl_hostname"]);

				var planets = [];
				var planet_el = {
						 orbit_period: planet["pl_orbper"], 
						 maj_axis: (planet["pl_orbsmax"] == "")? 5 : planet["pl_orbsmax"],
						 min_axis: 0,
						 eccentr: (planet["pl_orbeccen"]=="")? 0 : planet["pl_orbeccen"],
						 planet_name: planet["pl_name"],
						 radius: planet["pl_radj"],
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
						 orbit_period: planet["pl_orbper"], 
						 maj_axis: (planet["pl_orbsmax"] == "")? 5 : planet["pl_orbsmax"],
						 min_axis: 0,
						 eccentr: (planet["pl_orbeccen"]=="")?0:planet["pl_orbeccen"],
						 planet_name: planet["pl_name"],
						 radius: planet["pl_radj"],
						 speed: (planet["pl_orbper"] != "")? msInDay / planet["pl_orbper"] : 0.01,
						 mass: planet["pl_bmassj"],
						 name: planet["pl_hostname"] + "-" + planet["pl_letter"]
						}
				systems[indexOfEl(uSystems, planet["pl_hostname"])]["pl_set"].push(planet_el);
				//console.log(systems[indexOfEl(uSystems, planet["pl_hostname"])]["pl_set"][1]);
			}
			//console.log(planet["pl_hostname"]);			
                });


  hab_zones.forEach(function(hab_zone) 
                {
			var i = indexOfEl(uSystems, hab_zone["name"])
			systems[i]["ri"] = hab_zone["ri"];
			systems[i]["ro"] = hab_zone["ro"];
			//console.log(systems[i]["ro"] );
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
  } 


  //index = Math.floor(Math.random() * (systems.length - 1));
  //index = 1663;
  console.log("index: ", index);
  console.log(systems[index]);

  var svg = d3.select("body")
              .insert("svg")
              .attr("width", w)
              .attr("height", h);

  svg.append("circle")
     .attr("r", systems[index]["scale_factor"] * systems[index]["ro"])
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "hab_zone_ro");
  
  console.log("hz: ", systems[index]["ri"]);
  svg.append("circle")
     .attr("r", systems[index]["scale_factor"] * systems[index]["ri"])
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "hab_zone_ri");

  //svg.append("ellipse").attr("cx", w/2).attr("cy", h/2).attr("rx", 50).attr("ry", 100);

  svg.append("circle")
     .attr("class", "earth_orbit")
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("r", (systems[index]["scale_factor"] > 500)? 500 : systems[index]["scale_factor"]);

  svg.append("circle")
     .attr("r", 10)
     .attr("cx", w/2)
     .attr("cy", h/2)
     .attr("class", "sun");

  var container = svg.append("g")
        .attr("transform", "translate(" + w/2 + "," + h/2 + ")")

  container.selectAll("g.planet")
           .data(systems[index]["pl_set"]).enter()
           .append("g").each(function(d) 
					{
          					/*d3.select(this).append("circle")
							       .attr("class", "orbit")
            					               .attr("r", d["maj_axis"] * 100);*/
						//console.log("this ", this);

						console.log("Take a look", systems[index]["pl_set"][0]);
						placeOrbit(d, this, index);
						
          					d3.select(this).append("circle")
							       .attr("r", function()
										{
											//console.log("Radius: ", d["radius"] != "");
											/*console.log("mass: ", parseFloat(d["mass"]));
											console.log(RJ * d["mass"]); */

											if(d["radius"] != "")
												if(d["radius"] > 0.25)
													return (RJ * d["radius"] > 20) ? 20 : RJ * d["radius"];
												else
													return (RE * d["radius"] < 5) ? 5 : RE * d["radius"];

											if(d["mass"] != "")
												if(d["mass"] > 0.25)
													return (RJ * d["mass"] > 20) ? 20 : RJ * d["mass"];
												else
													return (RE * d["mass"] < 5) ? 5 : RE * d["mass"] > 7;
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
									       }); 
						//console.log("here", d);
        				});
  var t = 0;
  var startTime = new Date().getTime();
  var numCalled = 0;

  var tmp2 = svg.selectAll(".planet");
  var speed = [];

  var tmp3 = svg.selectAll(".earth_orbit");

  console.log("TMP2:", tmp3[0][0]);

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

$('.planet').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
	  var d = this.__data__;
          return d["name"] + "<br/>" + "Distance to star: " + d["maj_axis"] + " AU"; 
        }
      });

$('.hab_zone_ro').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return "habitable zone, yo!"; 
        }
      });

$('.sun').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return "This is a star, yo!"; 
        }
      });

$('.earth_orbit').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
	  //console.log("HERE: ", this);
          return "Approximate Earth orbit" ; 
        }
      });

  //console.log(speed);

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
	//console.log(tmp2[0][2]);
        startTime = new Date().getTime();
      });

  //console.log(systems[2]);
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



