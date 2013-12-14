

(function () {
	var width = 1160,
	    height = 500;

	var color = d3.scale.category20();

	var radius = d3.scale.sqrt()
	    .range([0, 6]);

	var atomSelected;
	var atomClicked = function (dataPoint) {
	 	/*console.log ("atom:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));*/
	 	
	 	if (dataPoint.atom === "H")
	 		return;

	 	if (atomSelected)
	 		atomSelected.style("filter", "");

	 	atomSelected = d3.select(this)
	 					 			.select("circle")
	 						    .style("filter", "url(#nodeGlow)");
	};

	var bondSelected;
	var bondClicked = function (dataPoint) {
	 	/*console.log ("bond:", dataPoint);
	 	console.log ("this:", this);
	 	console.log("this.firstElementChild:", this.firstElementChild);
	 	console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));*/
	 	
	 	if (bondSelected)
	 		bondSelected.style("filter", "");

	 	bondSelected = d3.select(this)
	 									 .select("line")
	 						    	 .style("filter", "url(#lineGlow)");
	};

	var generateRandomID = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		  return v.toString(16);
		});
	}
	

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

	d3.json("graph.json", function(graph) {
	  console.log(graph);
	  var nodesList = graph.nodes;
	  var linksList = graph.links;

	  var force = d3.layout.force()
	    						.nodes(nodesList)
	    						.links(linksList)
	    						.size([width, height])
	    						.charge(-400)
	    						.linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; })
	    						.on("tick", tick);

	  var links = force.links(),
	  		nodes = force.nodes(),
	  		link = svg.selectAll(".link"),
	  		node = svg.selectAll(".node");

	  buildMolecule();

	  function buildMolecule () {

	  	// Update link data
	  	link = link.data(links);
		  
		  // Create new links
		  link.enter().append("g")
		      .attr("class", "link")
		      .each(function(d) {
		      	// Add bond line
		      	d3.select(this)
		      		.insert("line", ".node")
							.style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

						// If double add second line
						d3.select(this)
							.filter(function(d) { return d.bond > 1; }).append("line")
							.attr("class", "separator");

						// Give bond the power to be selected
						d3.select(this)
							.on("click", bondClicked);
		      });
		  
		  // Delete removed links
		  link.exit().remove();    

		  // Update node data
	  	node = node.data(nodes);

	    // Create new nodes
		  node.enter().append("g")
		      .attr("class", "node")
		      .each(function(d) {
		      	// Add node circle
			      d3.select(this)
			      	.append("circle")
		      		.attr("r", function(d) { return radius(d.size); })
		      		.style("fill", function(d) { return color(d.atom); });

		        // Add atom symbol
			      d3.select(this)
			      	.append("text")
							.attr("dy", ".35em")
							.attr("text-anchor", "middle")
							.text(function(d) { return d.atom; });

						// Give atom the power to be selected
						d3.select(this)
							.on("click", atomClicked);

						// Grant atom the power of gravity	
						d3.select(this)
							.call(force.drag);
			    });

		  // Delete removed nodes
	    node.exit().remove();

		  force.start();
	  }

	  window.addCarbon = function () {
	  	console.log("Adding Carbon");
	  	updateMolecule();
	  };

	  function updateMolecule () {
			if (!atomSelected) {
				Messenger().post({
				  message: 'No atom selected.',
				  type: 'error',
				  showCloseButton: true
				});
				return;
			}

			var newNode = {"atom": "C", "size": 12, x: randomX(), y: randomY(), id: generateRandomID ()},
		  		n = nodes.push(newNode);

		 	var targetNode = nodes[atomSelected[0][0].parentNode.__data__.index]; //could probs be simplified
		  links.push({source: newNode, target: targetNode, bond: 1});
	  	
	  	buildMolecule();
	  }

	  window.deleteAtom = function () {
	  	if (!atomSelected) {
				Messenger().post({
				  message: 'No atom selected.',
				  type: 'error',
				  showCloseButton: true
				});
				return;
			}

			var atomSelectedObj = atomSelected[0][0].parentNode.__data__;
			var target, source;
			console.log('atomSelectedObj.id:', atomSelectedObj.id);
			for (var i = links.length - 1; i >= 0; i--) {
				target = links[i].target, source = links[i].source;
				console.log('target.id:', target.id);
				console.log('source.id:', source.id);
				if (target.id === atomSelectedObj.id || source.id === atomSelectedObj.id) {
					console.log('target:', target);
					console.log('source:', source);
					links.splice(i, 1);
				}
			}

	  	nodes.splice(atomSelected.index, 1);
	  	atomSelected = null;
	  	buildMolecule ();
	  };

	  function tick() {
	  	//Update old and new elements
	    link.selectAll("line")
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; });
	  }

	});
})();