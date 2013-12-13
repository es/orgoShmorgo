

(function () {
	var width = 1160,
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

  var randomX = function () {
  	return getRandomInt (0, width);
  };

  var randomY = function () {
  	return getRandomInt (0, height);
  };

  var getRandomInt = function (min, max) {
	  return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/*var force = d3.layout.force()
	    .size([width, height])
	    .charge(-400)
	    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; })
	    .nodes([{"atom": "C", "size": 12}]);*/

	d3.json("graph.json", function(graph) {
	  console.log(graph);
	  var nodesList = graph.nodes;
	  var linksList = graph.links;
	  
	  /*force
	      .nodes(nodesList)
	      .links(linksList)
	      .on("tick", tick)
	      .start();*/
	  /*force.on("tick", tick);*/

	  var force = d3.layout.force()
	  										 .nodes(graph.nodes)
		    								 .links(graph.links)
	    /*.size([width, height])
	    .charge(-400)
	    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; })
	    .nodes(graph.nodes)
	    .links(graph.links)
	    .on("tick", tick)*/;

	  var links = force.links(),
	  		nodes = force.nodes(),
	  		link = svg.selectAll(".link"),
	  		node = svg.selectAll(".node");

	 	function bigBang () {
	  	links = links.concat(linksList);
	  	nodes = nodes.concat(nodesList);
	  	buildMolecule();
	  }

	  bigBang();

	  function buildMolecule () {
	  	// Update link data
	  	link = link.data(links);
		  
		  // Create new links
		  link.enter().append("g")
		      .attr("class", "link")
		      .each(function(d) {
		      	d3.select(this).append("line")
													 .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

						d3.select(this).filter(function(d) { return d.bond > 1; }).append("line")
													 .attr("class", "separator");

						d3.select(this).on("click", bondClicked);
		      });
		  
		  // Delete removed links
		  link.exit().remove();    

		  // Update node data
	  	node = node.data(nodes);

	    // Create new nodes
		  node.enter().append("g")
		      .attr("class", "node")
		      .on("click", atomClicked)
		      .each(function(d) {
		      	console.count('d:', d);
		      	// Add node circle
			      d3.select(this).append("circle")
		      								 .attr("r", function(d) { return radius(d.size); })
		      								 .style("fill", function(d) { return color(d.atom); });

		        // Add atom symbol
			      d3.select(this).append("text")
										       .attr("dy", ".35em")
										       .attr("text-anchor", "middle")
										       .text(function(d) { return d.atom; });
			    }).call(force.drag);

		  // Delete removed nodes
	    node.exit().remove();

		  //debugger;
		  /*force.start();*/
		  force
		    .size([width, height])
		    .charge(-400)
		    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; })
		    .on("tick", tick)
		    .start();
	  }

	  window.addCarbon = function () {
	  	console.log("Adding Carbon");
	  	//nodesList.push({"atom": "C", "size": 12, px: 100, py: 0, x: 100, y: 100});
	  	updateMolecule();
	  };

	  function updateMolecule () {
			if (!atom) return; 

			/*var nodeTings = {"atom": "C", "size": 12, x: 100, y: 100, px: 200, py: 200, weight: 1, index: nodes.length},*/
			var nodeTings = {"atom": "C", "size": 12, x: randomX(), y: randomY(), mark:true, weight: 1},
		  		n = nodes.push(nodeTings);

		 	var targetNode = nodes[atom[0][0].parentNode.__data__.index]; //could probs be simplified
		  links.push({source: nodeTings, target: targetNode, bond: 1});
	  	
	  	buildMolecule();
	  }

	  function tick() {
	  	//Update old and new elements
	    link.selectAll("line")
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) {/*if (!d.mark)console.log("d:", d);*/return "translate(" + d.x + "," + d.y + ")"; });
	    

	    /*node.attr("cx", function(d) { return d.x; })
      		.attr("cy", function(d) { return d.y; });*/
	  }

	});
})();