

(function () {
	var width = 1160,
	    height = 500;

	var color = d3.scale.category20();

	var radius = d3.scale.sqrt()
	    .range([0, 6]);

	var atom;
	var atomClicked = function (dataPoint) {
	 	/*console.log ("atom:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));*/
	 	
	 	if (dataPoint.atom === "H")
	 		return;

	 	if (atom)
	 		atom.style("filter", "");

	 	atom = d3.select(this)
	 					 			.select("circle")
	 						    .style("filter", "url(#nodeGlow)");
	};

	var bond;
	var bondClicked = function (dataPoint) {
	 	/*console.log ("bond:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));*/
	 	
	 	if (bond)
	 		bond.style("filter", "");

	 	bond = d3.select(this)
	 								.select("line")
	 						    .style("filter", "url(#lineGlow)");
	};

	var nodeGlow = glow("nodeGlow").rgb("#0000A0").stdDeviation(7);
	var lineGlow = glow("lineGlow").rgb("#000").stdDeviation(7);

	var svg = d3.select("#moleculeDisplay").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .call(nodeGlow)
	    .call(lineGlow);

	var force = d3.layout.force()
	    .size([width, height])
	    .charge(-400)
	    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; });

	d3.json("graph.json", function(graph) {
	  console.log(graph);
	  var nodesList = graph.nodes;
	  var linksList = graph.links;
	  force
	      .nodes(nodesList)
	      .links(linksList)
	      .on("tick", tick)
	      .start();

	  var link = svg.selectAll(".link")
	      .data(linksList)
	    	.enter().append("g")
	      .attr("class", "link");

	  link.append("line")
	      .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

	  link.filter(function(d) { return d.bond > 1; }).append("line")
	      .attr("class", "separator");

	  svg.selectAll(".link")
	      .on("click", bondClicked);

	  window.addCarbon = function () {
	  	console.log("Adding Carbon");
	  	nodesList.push({"atom": "C", "size": 12});
	  };

	  var node = svg.selectAll(".node")
	      .data(nodesList)
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
	  	// Update node/link data
	  	/*node.data(nodesList);
	  	links.data(linksList);*/

	  	// Create new nodes/links
	  	// Create node

	  	// Create node

	  	//Update old and new elements
	    link.selectAll("line")
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	    // Delete removed links/nodes
	    /*link.exit().remove();
	    node.exit().remove();*/
	  }
	});
})();