

(function () {
	var width = 1160,
	    height = 500;

	var color = d3.scale.category20();

	var radius = d3.scale.sqrt()
	    .range([0, 6]);

	var atomSelected;
	var atomClicked = function (dataPoint) {
	 	console.log ("atom:", dataPoint);
	 	/*console.log ("this:", this);*/
	 	/*console.log("this.firstElementChild:", this.firstElementChild);*/
	 	/*console.log("this.firstElementChild+d3:", d3.select(this.firstElementChild));*/
	 	
	 	if (dataPoint.symbol === "H")
	 		return;

	 	if (atomSelected)
	 		atomSelected.style("filter", "");

	 	atomSelected = d3.select(this)
	 					 			.select("circle")
	 						    .style("filter", "url(#nodeGlow)");
	};

	var bondSelected;
	var bondClicked = function (dataPoint) {
	 	console.log ("bond:", dataPoint);
	 	/*console.log ("this:", this);
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
	  	link = link.data(links, function (d) {return d.id; });

		  // Create new links
		  link.enter().insert("g", ".node")
		      .attr("class", "link")
		      .each(function(d) {
		      	// Add bond line
		      	d3.select(this)
		      		.append("line")
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
	  	node = node.data(nodes, function (d) {return d.id; });

	    // Create new nodes
		  node.enter().append("g")
		      .attr("class", "node")
		      .each(function(d) {
		      	// Add node circle
			      d3.select(this)
			      	.append("circle")
		      		.attr("r", function(d) { return radius(d.size); })
		      		.style("fill", function(d) { return color(d.symbol); });

		        // Add atom symbol
			      d3.select(this)
			      	.append("text")
							.attr("dy", ".35em")
							.attr("text-anchor", "middle")
							.text(function(d) { return d.symbol; });

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

	  window.addAtom = function (atomType) {
	  	console.log("Adding new atom:", atomType);
	  	if (!atomType) {
	  		Messenger().post({
				  message: 'Internal error :(',
				  type: 'error',
				  showCloseButton: true
				});
				return;
	  	}
	  	else if (!atomSelected) {
				Messenger().post({
				  message: 'No atom selected.',
				  type: 'error',
				  showCloseButton: true
				});
				return;
			}
			else if (!canHaveNewBond(getAtomData(atomSelected))) {
				Messenger().post({
				  message: 'Atom can\'t take anymore bonds.',
				  type: 'error',
				  showCloseButton: true
				});
			}
			else
	  		updateMolecule(atomType, atomDB[atomType].size);
	  };

	 	function canHaveNewBond (atom) {
	 		return atom.bonds < atomDB[atom.symbol].lonePairs;
	 	}

	 	function getAtomData (d3Atom) {
	 		return d3Atom[0][0].parentNode.__data__;
	 	}

	 	function addHydrogens (atom, numHydrogens) {
	 		console.log('numHydrogens:', numHydrogens);
	 		var newHydrogen = function () {
	 			return {
		 			symbol: 'H',
		 			size: '1',
		 			bonds: 1,
		 			id: generateRandomID (),
		 			x: atom.x + getRandomInt (-15, 15),
		 			y: atom.y + getRandomInt (-15, 15)
		 		};
	 		};
	 		var tempHydrogen;
	 		for (var i = 0; i < numHydrogens; i++) {
	 			tempHydrogen = newHydrogen();
	 			nodes.push(tempHydrogen);
	 			links.push({source: atom, target: tempHydrogen, bond: 1, id: generateRandomID()});	
	 		}
	 	}

	 	function removeHydrogen (oldAtom) {
	 		var target, source;
	 		var bondsArr = getBonds(oldAtom.id);
	 		for (var i = bondsArr.length - 1; i >= 0; i--) {
	 			target = bondsArr[i].target, source = bondsArr[i].source;
				if (target.symbol === 'H' || source.symbol === 'H' ) {
					var hydroId = source.symbol === 'H'? 
																		source.id: 
																		target.id;
					removeAtom(hydroId);
					return;
				}
	 		}
	 	}

	 	function removeAtom (id) {
	 		var atomToRemove = retriveAtom(id);
	 		var bondsArr = getBonds(id);
	 		var atomsArr = [atomToRemove.id];
	 		
	 		for (var i = bondsArr.length - 1; i >= 0; i--) {
	 			if (bondsArr[i].source.symbol === 'H')
	 				atomsArr.push(bondsArr[i].source.id);
	 			else if (bondsArr[i].target.symbol === 'H')
	 				atomsArr.push(bondsArr[i].target.id);
	 			else {
						var nonHydrogenAtom = bondsArr[i].target.id !== id ? 
																									 	'target':
																										'source';
							
						bondsArr[i][nonHydrogenAtom].bonds -= bondsArr[i].bond;
		 				addHydrogens(bondsArr[i][nonHydrogenAtom], bondsArr[i].bond);
	 			}
	 			bondsArr[i] = bondsArr[i].id;
	 		}

	 		var spliceOut = function (arr, removeArr) {
		 		for (var i = arr.length - 1; i >= 0; i--) {
		 				if (removeArr.indexOf(arr[i].id) !== -1) {
		 					arr.splice(i, 1);
		 				}
		 		}
		 		return arr;
		 	};

	 		// Remove atoms marked
	 		nodes = spliceOut (nodes, atomsArr);
	 		
	 		// Remove bonds marked
	 		links = spliceOut (links, bondsArr);

	 	};

	 	var retriveAtom = function  (atomID) {
	 		for (var i = nodes.length - 1; i >= 0; i--) {
	 			if (nodes[i].id === atomID)
	 				return nodes[i];
	 		}
	 		return null;
	 	};

	  function updateMolecule (atomType, atomSize) {
			var newAtom = {
						symbol: atomType,
						size: atomSize,
						x: getAtomData(atomSelected).x + getRandomInt (-15, 15),
						y: getAtomData(atomSelected).y + getRandomInt (-15, 15),
						id: generateRandomID (), // Need to make sure is unique
						bonds: 1
					},
		  		n = nodes.push(newAtom);

		  getAtomData(atomSelected).bonds++; // Increment bond count on selected atom
		 	addHydrogens(newAtom, atomDB[atomType].lonePairs - 1); // Adds hydrogens to new atom
		 	removeHydrogen(getAtomData(atomSelected)); // Remove hydrogen from selected atom
		  
		  links.push({
		  	source: newAtom, 
		  	target: getAtomData(atomSelected), 
		  	bond: 1, 
		  	id: generateRandomID()
		  }); // Need to make sure is unique
		  
	  	buildMolecule();
	  }

	  var getBonds = function (atomID) {
	  	var arr = [];
	  	for (var i = links.length - 1; i >= 0; i--) {
	  		if (links[i].source.id === atomID || links[i].target.id === atomID)
	  			arr.push(links[i]);
	  	}
	  	return arr;
	  }

	  /*
		 * Deal with in diff branch
	   */
	  window.deleteAtom = function () {
	  	var oneNonHydrogenBond = function (atom) {
	  		var atomBonds = getBonds(atom.id);
	  		var counter = 0;
	  		for (var i = atomBonds.length - 1; i >= 0; i--) {
	  			if (atomBonds[i].source.symbol !== 'H' && atomBonds[i].target.symbol !== 'H')
	  				counter++;
	  		}
	  		return counter === 1;
	  	};

	  	if (!atomSelected) {
				Messenger().post({
				  message: 'No Atom Selected',
				  type: 'error',
				  showCloseButton: true
				});
				return;
			}
			else if (!oneNonHydrogenBond(getAtomData(atomSelected))) {
				Messenger().post({
				  message: 'Atom Must have only one non-hydrogen bond to be removed',
				  type: 'error',
				  showCloseButton: true
				});
				return;
			}

			removeAtom(getAtomData(atomSelected).id);
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