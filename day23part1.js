var fs = require('fs');

var input = fs.readFileSync('./day23input.txt', { encoding: 'utf-8' });

var inputLines = input.split('\n');

var bots = [];

inputLines.forEach(function(i) {
	var parts = i.split(/[pos=<|>, r=|,]/).filter(function(a) { return a != ''; });
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	var z = parseInt(parts[2]);
	var r = parseInt(parts[3]);

	bots.push({
		x: x,
		y: y,
		z: z,
		r: r
	});
});

function manhattanDistance(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

var bestCount = 0;
var bestRange = 0;

bots.forEach(function(b) {
	if(b.r > bestRange) {
		bestRange = b.r;

		var count = 0;
		bots.forEach(function(c) {
			if (manhattanDistance(b, c) <= b.r) {
				count++;
			}
		});

		bestCount = count;
	}
});

console.log(bestCount);