/*
 * Method Definition taken from Programming Challenges by Skiena and Revilla
 * Insert(x,p) — Insert item x into priority queue p.
 * Maximum(p) — Return the item with the largest key in priority queue p. 
 * ExtractMax(p) — Return and remove the item with the largest key in p.
 */ 
function PriorityQueue (arr) {
	this.arr = arr || [];
}

PriorityQueue.prototype = {
	constructor: PriorityQueue,
	insert: function(element) {
		if (this.arr.length === 0)
			return this.arr = [element];
		for (var i = this.arr.length - 1; i >= 0; i--) {
			if (element > this.arr[i]) {
				this.arr.splice(i, 0, element);
				return this;
			}
		}
	},
	maximum: function() {
		return this.arr[0];
	},
	extractMax: function() {
		return this.arr.shift();
	}
};

/*
 * Simple Test
 */

pq = new PriorityQueue ();
	pq.insert(2);
	pq.insert(22);
	pq.insert(13);
	pq.insert(8);

console.assert(pq.maximum() === 22, 'max is 4');
console.assert(pq.extractMax() === 22, 'extracted max is 4');
console.assert(pq.maximum() === 13, 'max is 3');
