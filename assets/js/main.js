

(function () {
	var width = 960,
	    height = 500;

	var color = d3.scale.category20();

	var radius = d3.scale.sqrt()
	    .range([0, 6]);

	var atom;
	var atomClicked = function (dataPoint) {
	 	console.log ("atom:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));
	 	if (atom)
	 		atom.remove();

	 	atom = d3.select(this)
	 						    .insert("circle", ":first-child")
	    				    .attr("r", function(d) { return radius(d.size); })
	    				    .style("fill", function(d) { return color(d.atom); })
	 						    .style("filter", "url(#selectedGlow)");
	};

	/*var bond;
	var bondClicked = function (dataPoint) {
	 	console.log ("bond:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));
	 	if (bond)
	 		bond.remove();

	 	bond = d3.select(this)
	 						    .insert("line", ":first-child")
	 						    .attr("class", "link")
	 						    .style("stroke-width", function(d) { 
	 						    	console.log(d);
	 						    	return (d.bond * 2 - 1) * 2 + "px"; })
	 						    .style("filter", "url(#selectedGlow)");
	};*/

	var selectedGlow = glow("selectedGlow").rgb("#1F75C4").stdDeviation(4);

	var svg = d3.select("#moleculeDisplay").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .call(selectedGlow);

	var force = d3.layout.force()
	    .size([width, height])
	    .charge(-400)
	    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; });

	d3.json("graph.json", function(graph) {
	  force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .on("tick", tick)
	      .start();

	  var link = svg.selectAll(".link")
	      .data(graph.links)
	    	.enter().append("g")
	      .attr("class", "link");
	      /*.on("click", bondClicked);*/

	  link.append("line")
	      .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

	  link.filter(function(d) { return d.bond > 1; }).append("line")
	      .attr("class", "separator");

	  var node = svg.selectAll(".node")
	      .data(graph.nodes)
	   		.enter().append("g")
	      .attr("class", "node")
	      .on("click", atomClicked)
	      .call(force.drag);

	  node.append("circle")
	      .attr("r", function(d) { return radius(d.size); })
	      .style("fill", function(d) { return color(d.atom); });

	  node.append("text")
	      .attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.atom; });

	  function tick() {
	    link.selectAll("line")
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  }
	});
})();