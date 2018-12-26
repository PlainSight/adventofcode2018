var fs = require('fs');

var input = fs.readFileSync('./day25input.txt', { encoding: 'utf-8' });

var inputLines = input.split('\n');

var stars = [];

var id = 0;
inputLines.forEach(function(i) {
	var parts = i.split(',');
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	var z = parseInt(parts[2]);
	var t = parseInt(parts[3]);

	stars.push({
		x: x,
		y: y,
		z: z,
		t: t,
		id: id
	});

	id++;
});

function manhattanDistance(s, o) {
	return Math.abs(s.x - o.x) +
		Math.abs(s.y - o.y) + 
		Math.abs(s.z - o.z) + 
		Math.abs(s.t - o.t);
}

outer: for(var i = 0; i < stars.length; i++) {
	var star = stars[i];
	for(var j = i+1; j < stars.length; j++) {
		var other = stars[j];

		if (manhattanDistance(star, other) <= 3) {

			var rootStar = star;
			while(rootStar.parent) {
				rootStar = rootStar.parent;
				star.parent = rootStar;
			}

			var rootOther = other;
			while(rootOther.parent) {
				rootOther = rootOther.parent;
				other.parent = rootOther;
			}

			if(rootStar != rootOther) {
				rootStar.parent = rootOther;
			}
		}
	}
}

var constellations = 0;
stars.forEach(function(s) {
	if(!s.parent) {
		constellations++;
	}
});

console.log(constellations);