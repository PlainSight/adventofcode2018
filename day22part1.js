/*
depth: 7305
target: 13,734
*/

var input = {
	depth: 7305,
	target: { x: 13, y: 734 }
};

/*
The region at 0,0 (the mouth of the cave) has a geologic index of 0.
The region at the coordinates of the target has a geologic index of 0.
If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.
*/

var erosionLevels = [];

function coToIndex(co) {
	return co.x + (input.target.x) * (co.y + 1);
}

function erosionLevel(co) {
	//console.log(co);
	var region = erosionLevels[coToIndex(co)];
	if (region) {
		return region;
	}
	if (co.x == 0 && co.y == 0) {
		return input.depth % 20183;
	}
	if (co.x == input.target.x && co.y == input.target.y) {
		return input.depth % 20183;
	}
	if (co.y == 0) {
		return ((co.x * 16807) + input.depth) % 20183;
	}
	if (co.x == 0) {
		return ((co.y * 48271) + input.depth) % 20183;
	}
	var xsub1 = erosionLevel({ x: (co.x-1), y: co.y });
	var ysub1 = erosionLevel({ x: co.x, y: (co.y-1) });
	var result = ((xsub1 * ysub1) + input.depth) % 20183;
	erosionLevels[coToIndex(co)] = result;
	return result;
}

var riskLevel = 0;

for(var x = 0; x <= input.target.x; x++) {
	for(var y = 0; y <= input.target.y; y++) {
		riskLevel += (erosionLevel({x: x, y: y}) % 3);
	}
}

console.log(riskLevel);