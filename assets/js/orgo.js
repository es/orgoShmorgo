'use strict';

var orgo = function (atoms, bonds) {
	if (!atoms || !bonds) return 'Bad Info';
	//{"symbol":"H","size":"1","id":"ff89b899-b231-43b9-8d4c-200486153265","bonds":1}
	var addBondsArrToAtoms = function () {
		var bondsCollection = {};

		//Collect all atoms that share an edge into bondsCollection
		for (var i = bonds.length - 1; i >= 0; i--) {
			bonds[i].source = atoms[bonds[i].source];
			bonds[i].target = atoms[bonds[i].target];
			if (!bondsCollection[bonds[i].target.id])
				bondsCollection[bonds[i].target.id] = [];
			if (!bondsCollection[bonds[i].source.id])
				bondsCollection[bonds[i].source.id] = [];

			bondsCollection[bonds[i].target.id].push(bonds[i]);
			bondsCollection[bonds[i].source.id].push(bonds[i]);
		}
		
		// Add array of linked atoms (bondsCollection) to each atom
		for (var i = atoms.length - 1; i >= 0; i--) {
			atoms[i].bonds = bondsCollection[atoms[i].id];
		}
	};
	addBondsArrToAtoms();
	if (atoms.length > 30) {
		console.log('atoms:', atoms);
		console.log('bonds:', bonds);	
	}
	/*
		Atom Obj:
			bonds: Array[1]
			id: "d12533d9-76b4-4b2a-b8f5-d866f5bf4bc6"
			size: "1"
			symbol: "H"
		atomObj --> bondsArr --> obj:
			bondType: 1
			id: "35c41f90-8b6a-4eef-bde2-ab8e26f95fb0"
			source: Object
			target: Object
	*/

	/*
	 * Utility Methods
	 */
	 //_.extend(molecule);
	 /*
		Extracts all the atoms at the ends of the molecule
		Input: Molecule represented as an arr of atoms
		Output: Arr of atoms that are end nodes
	 */
	var endNodes = function (molecule) {
		molecule = _.extend(molecule, {});
		removeHydrogens(molecule);
				
		var endNodesArr = [];
		for (var i = 0; i < molecule.length; i++) {
			if (molecule[i].bonds.length <== 1) {
				endNodesArr.push(molecule[i]);
			}
		}
		
		return endNodesArr;
	};

	var longestChain = function (molecule) {
		removeHydrogens(molecule);
		return molecule.length;
		
		var chainsArr = [];
		
		var isEndMolecule = function(atom) {
			return atom.bonds.length === 1 || atom.bonds.length === 0;
		};



		var dfs = function (atom, atomsVisitedArr, counter) {
			if (atomsVisitedArr[atom.id])
				return;
			atomsVisitedArr[atom.id] = counter;
			for (var i = atom.bonds.length - 1; i >= 0; i--) {
				dfs(atom.bonds[i], atomsVisitedArr, ++counter);
			}
		};

		var findLongestChain = function (startingAtom) {
				
		};
		
		var startingAtomsArr = [];

		for (var i = molecule.length - 1; i >= 0; i--) {
			if (molecule[i].bonds.length === 1) 
				startingAtomsArr.push(_.extend(molecule[i]));
		}
	};

	var removeHydrogens = function (molecule) {
		for (var i = molecule.length - 1; i >= 0; i--) {
			if (molecule[i].symbol === 'H')
				molecule.splice(i, 1);
		}
	};

	var nameDB = {
		1: "meth",
		2: "eth",
		3: "prop",
		4: "but",
		5: "pent",
		6: "hex",
		7: "hept",
		8: "oct",
		9: "non",
		10: "dec"
	};

	var prefixDB = {
		1: "mono",
		2: "di",
		3: "tri",
		4: "tetra",
		5: "penta",
		6: "hexa",
		7: "hepta",
		8: "octa",
		9: "nona",
		10: "deca"
	};

	return nameDB[longestChain(atoms.slice(0))] + 'ane';
};



(function  (argument) {
	// body...
})();