'use strict';

orgo.utility = function () {
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
	
	return {
		longestChain: longestChain
	};
};