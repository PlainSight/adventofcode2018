/*
depth: 7305
target: 13,734
*/

var input = {
	//depth: 510,
	//target: { x: 10, y: 10 }
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
	return co.x + (input.target.x*11) * (co.y + 1);
}

function erosionLevel(co) {
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

function getTerrain(co) {
	switch(erosionLevel(co) % 3) {
		case 0:
			return 'r';
		case 1:
			return 'w';
		case 2:
			return 'n';
	}
}

function toolsForTerrain(terrain) {
	switch(terrain) {
		case 'r':
			return ['c', 't'];
		case 'w':
			return ['n', 'c'];
		case 'n':
			return ['n', 't'];
	}
}

function otherToolForTerrain(terrain, currentTool) {
	var tools = toolsForTerrain(terrain);
	var otherTool = null;
	tools.forEach(function(t) {
		if(currentTool != t) {
			otherTool = t;
		}
	});
	return otherTool;
}

// 0 - rocky 'r', 1 - wet 'w', 2 - narrow 'n'

/*
In rocky regions, you can use the climbing gear or the torch. You cannot use neither (you'll likely slip and fall).
In wet regions, you can use the climbing gear or neither tool. You cannot use the torch (if it gets wet, you won't have a light source).
In narrow regions, you can use the torch or neither tool. You cannot use the climbing gear (it's too bulky to fit).
*/

// t: c -- climbing gear, t -- torch, n -- neither

function nodeToKey(node) {
	return node.x+','+node.y+','+node.tool;
}

function distanceToNeighbour(node, neighbour) {
	if(node.x != neighbour.x || node.y != neighbour.y) {
		return 1;
	}
	if(node.tool != neighbour.tool) {
		return 7;
	}
	return 0;
}

function getNeighbours(node) {
	var neighbouringCoordinates = [
		{x: node.x, y: node.y+1}
	];
	if(node.x <= input.target.x*10) {
		neighbouringCoordinates.push({x: node.x+1, y: node.y});
	}
	if(node.x > 0) {
		neighbouringCoordinates.push({x: node.x-1, y: node.y});
	}
	if(node.y > 0) {
		neighbouringCoordinates.push({x: node.x, y: node.y-1});
	}

	var neighbours = [];

	neighbouringCoordinates.forEach(function(co) {
		var terrain = getTerrain(co);
		var tools = toolsForTerrain(terrain);

		tools.forEach(function(t) {
			if(node.tool == t) {
				neighbours.push({ x: co.x, y: co.y, tool: t });
			}
		});
	});

	neighbours.push({ 
		x: node.x, 
		y: node.y, 
		tool: otherToolForTerrain(getTerrain(node), node.tool) 
	});

	return neighbours;	
}

//input.target.x+input.target.y
var initialNode = { x:0, y:0, tool:'t', g: 0, h: 0, parent: null };
var openSet = [initialNode];
var nodeMap = { '0,0,t': initialNode };
var destinationNode = null;

function visit(node) {
	node.closed = true;
	var neighbours = getNeighbours(node);

	neighbours.forEach(function(n) {
		var existingNeighbour = nodeMap[nodeToKey(n)];
		if (existingNeighbour) {
			// check if better parent, otherwise nothing
			if(existingNeighbour.g > (node.g + distanceToNeighbour(node, existingNeighbour)) && existingNeighbour.parent != node) {
				existingNeighbour.g = node.g + distanceToNeighbour(node, existingNeighbour);
				existingNeighbour.parent = node;
			}
		} else {
			n.g = node.g + distanceToNeighbour(node, n);
			n.parent = node;

			openSet.push(n);
			nodeMap[nodeToKey(n)] = n;
		}
	});
}


while(openSet.length > 0) {
	var bestIndex;
	var bestScore = 1000000;
	openSet.forEach(function(n, i) {
		if (n.g < bestScore) {
			bestScore = n.g;
			bestIndex = i;
		}
	});

	var lastNode = openSet[openSet.length-1];
	var bestNode = openSet[bestIndex];
	openSet[bestIndex] = lastNode;
	openSet.pop();

	if(bestNode.x == input.target.x && bestNode.y == input.target.y && bestNode.tool == 't') {
		destinationNode = bestNode;
		break;
	}

	visit(bestNode);
}

var cost = 0;
for(var n = destinationNode; n.parent != null; n = n.parent) {
	cost += distanceToNeighbour(n, n.parent);
}

console.log(cost);

