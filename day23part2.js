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

function cubeSquareIntersect(sphere, cube) {
	var dx = 0;
	var dy = 0
	var dz = 0;

	if(sphere.x >= cube.minx && sphere.x <= cube.maxx) {
		dx = 0;
	} else {
		dx = Math.min(Math.abs(sphere.x - cube.minx), Math.abs(sphere.x - cube.maxx));
	}
	if(sphere.y >= cube.miny && sphere.y <= cube.maxy) {
		dy = 0;
	} else {
		dy = Math.min(Math.abs(sphere.y - cube.miny), Math.abs(sphere.y - cube.maxy));
	}
	if(sphere.z >= cube.minz && sphere.z <= cube.maxz) {
		dz = 0;
	} else {
		dz = Math.min(Math.abs(sphere.z - cube.minz), Math.abs(sphere.z - cube.maxz));
	}

	return (dx + dy + dz <= sphere.r);
}

var minx = Math.min.apply(null, bots.map(function(b) { return b.x-b.r; }));
var maxx = Math.max.apply(null, bots.map(function(b) { return b.x+b.r; }));
var miny = Math.min.apply(null, bots.map(function(b) { return b.y-b.r; }));
var maxy = Math.max.apply(null, bots.map(function(b) { return b.y+b.r; }));
var minz = Math.min.apply(null, bots.map(function(b) { return b.z-b.r; }));
var maxz = Math.max.apply(null, bots.map(function(b) { return b.z+b.r; }));

console.log('x');
console.log(minx);
console.log(maxx);

console.log('y');
console.log(miny);
console.log(maxy);

console.log('z');
console.log(minz);
console.log(maxz);

function cubeClosestDistance(cube) {
	var dx = Math.min(Math.abs(cube.minx), Math.abs(cube.maxx));
	var dy = Math.min(Math.abs(cube.miny), Math.abs(cube.maxy));
	var dz = Math.min(Math.abs(cube.minz), Math.abs(cube.maxz));
	return dx + dy + dz;
}

function cubeMaxScore(cube) {
	if(cube.score) {
		return cube.score;
	}
	var count = 0;
	bots.forEach(function(b) {
		if (cubeSquareIntersect(b, cube)) {
			count++;
		}
	});
	cube.score = count;
	return count;
}

function printCube(cube) {
	console.log('minx: ' + cube.minx + ' maxx: ' + cube.maxx + 
		'miny: ' + cube.miny + ' maxy: ' + cube.maxy + 
		'minz: ' + cube.minz + ' maxz: ' + cube.maxz);
}

function cubeSize(cube) {
	var dx = cube.maxx - cube.minx;
	var dy = cube.maxy - cube.miny;
	var dz = cube.maxz - cube.minz;

	return Math.max(dx, Math.max(dy, dz));
}

var lowerThreshold = 0;
var bestCube = null;

var rootCube = {
	minx: minx,
	maxx: maxx,
	miny: miny,
	maxy: maxy,
	minz: minz,
	maxz: maxz,
};

var queue = [rootCube];

while(queue.length) {
	queue = queue.filter(function(a) {
		var score = cubeMaxScore(a);
		return score > 0 && score >= lowerThreshold;
	});

	queue = queue.sort(function(a, b) {
		if (cubeMaxScore(a) == cubeMaxScore(b)) {
			return cubeSize(b) - cubeSize(a);
		}
		return cubeMaxScore(a) - cubeMaxScore(b);
	});

	var currentCube = queue.pop();

	if(currentCube == null) {
		break;
	}

	printCube(currentCube);

	if (cubeSize(currentCube) == 0) {
		if(bestCube == null) {
			bestCube = currentCube;
			lowerThreshold = cubeMaxScore(bestCube);
			console.log(lowerThreshold);
		} else {
			if(cubeMaxScore(currentCube) == cubeMaxScore(bestCube)) {
				if(cubeClosestDistance(currentCube) < cubeClosestDistance(bestCube)) {
					bestCube = currentCube;
				}
			} else {
				if (cubeMaxScore(currentCube) > cubeMaxScore(bestCube)) {
					bestCube = currentCube;
					lowerThreshold = cubeMaxScore(bestCube);
				}
			}
		}
	} else {
		// divide cube into parts
		var bmidx = currentCube.minx + Math.floor((currentCube.maxx - currentCube.minx) / 2);
		var umidx = Math.min(bmidx+1, currentCube.maxx);
		var xvals = [currentCube.minx, bmidx];
		if(currentCube.minx != currentCube.maxx) {
			xvals.push(umidx, currentCube.maxx);
		}

		var bmidy = currentCube.miny + Math.floor((currentCube.maxy - currentCube.miny) / 2);
		var umidy = Math.min(bmidy+1, currentCube.maxy);
		var yvals = [currentCube.miny, bmidy];
		if(currentCube.miny != currentCube.maxy) {
			yvals.push(umidy, currentCube.maxy);
		}

		var bmidz = currentCube.minz + Math.floor((currentCube.maxz - currentCube.minz) / 2);
		var umidz = Math.min(bmidz+1, currentCube.maxz);
		var zvals = [currentCube.minz, bmidz];
		if(currentCube.minz != currentCube.maxz) {
			zvals.push(umidz, currentCube.maxz);
		}

		for(var dx = 0; dx < xvals.length; dx+=2) {
			for(var dy = 0; dy < yvals.length; dy+=2) {
				for(var dz = 0; dz < zvals.length; dz+=2) {
					queue.push({ 
						minx: xvals[dx], maxx: xvals[dx+1],
					 	miny: yvals[dy], maxy: yvals[dy+1],
					  minz: zvals[dz], maxz: zvals[dz+1] 
					});
					//printCube(queue[queue.length-1]);
				}
			}
		}
	}
}

var count = 0;

var chosenx = bestCube.minx;
var choseny = bestCube.miny;
var chosenz = bestCube.minz;

bots.forEach(function(b) {
	if (manhattanDistance(b, { x: chosenx, y: choseny, z: chosenz }) <= b.r) {
		count++;
	}
});

console.log('best pos:');
console.log(chosenx + choseny + chosenz);
console.log(count);
