var input = '################################\r\n#############..#################\r\n#############..#.###############\r\n############G..G.###############\r\n#############....###############\r\n##############.#...#############\r\n################..##############\r\n#############G.##..#..##########\r\n#############.##.......#..######\r\n#######.####.G##.......##.######\r\n######..####.G.......#.##.######\r\n#####.....#..GG....G......######\r\n####..###.....#####.......######\r\n####.........#######..E.G..#####\r\n####.G..G...#########....E.#####\r\n#####....G.G#########.#...######\r\n###........G#########....#######\r\n##..#.......#########....##.E.##\r\n##.#........#########.#####...##\r\n#............#######..#.......##\r\n#.G...........#####........E..##\r\n#....G........G..G.............#\r\n#..................E#...E...E..#\r\n#....#...##...G...E..........###\r\n#..###...####..........G###E.###\r\n#.###########..E.......#########\r\n#.###############.......########\r\n#################.......########\r\n##################....#..#######\r\n##################..####.#######\r\n#################..#####.#######\r\n################################';

//var input = '#########\r\n#G......#\r\n#.E.#...#\r\n#..##..G#\r\n#...##..#\r\n#...#...#\r\n#.G...G.#\r\n#.....G.#\r\n#########';


var rows = input.split('\r\n');

var grid = [];
var entities = [];

var eid= 1;

var y = 0;
for(var r in rows) {
	var row = rows[r];
	var x = 0;
	
	var gridRow = [];
	for(var c in row) {
		switch(row[c]){
			case '#':
				gridRow.push({ block: true, x: x, y: y });
				break;
			case 'E':
			case 'G':
				entities.push({ id: eid, faction: row[c], x: x, y: y, hp: 200, attack: 3 });
				eid++;
				gridRow.push({ block: true, x: x, y: y });
				break;
			default:
				gridRow.push({ block: false, x: x, y: y });
		}
		x++;
	}
	grid.push(gridRow);
	y++;
}

function bothFactionsAlive() {
	var elvesAlive = false;
	var goblinsAlive = false;
	for(var e in entities) {
		var entity = entities[e];
		if (entity.faction == 'E') {
			elvesAlive = true;
		} else {
			goblinsAlive = true;
		}
	}
	return elvesAlive && goblinsAlive;
}

function openGridSorrounding(entity) {
	var openGrid = [];
	if(!grid[entity.y-1][entity.x].block) {
		openGrid.push(grid[entity.y-1][entity.x]);
	}
	if(!grid[entity.y+1][entity.x].block) {
		openGrid.push(grid[entity.y+1][entity.x]);
	}
	if(!grid[entity.y][entity.x-1].block) {
		openGrid.push(grid[entity.y][entity.x-1]);
	}
	if(!grid[entity.y][entity.x+1].block) {
		openGrid.push(grid[entity.y][entity.x+1]);
	}
	return openGrid;
}

function getPath(entity, destination) {
	var openSet = [];
	var closedSet = [];
	
	function pushNodes(gridSpaces, parent) {
outer:	for(var g in gridSpaces) {
			var gridSpace = gridSpaces[g];
			
			for(var os in openSet) {
				var open = openSet[os];
				if (open.gs == gridSpace) {
					if(open.g > parent.g+1) {
						open.g = parent.g+1;
						open.parent = parent;
					}
					
					continue outer;
				}
			}
			
			openSet.push({ gs: gridSpace, g: parent == null ? 1 : parent.g+1, parent: parent });
		}
	}
	
	pushNodes(openGridSorrounding(entity), null);
	
	while(openSet.length > 0) {
		openSet.sort(function (a, b) {
			if (b.g == a.g) {
				if(a.gs.y == b.gs.y) {
					return b.gs.x - a.gs.x;
				}
				return b.gs.y - a.gs.y;
			}
			return b.g - a.g;
		});
		
		//console.log(openSet);
		
		var openGrid = openSet.pop();
		closedSet.push(openGrid);
		
		if(openGrid.gs == destination) {
				// make path
				var path = [];
				for(var n = openGrid; n != null; n = n.parent) {
					path.unshift(n.gs);
				}
				
				return path;
			}
		
		var explored = openGridSorrounding(openGrid.gs);
		for(var e in explored) {
			var explore = explored[e];
			if (!closedSet.map(n => n.gs).includes(explore)) {
				pushNodes([explore], openGrid);
			}
		}
	}
	
	return null;
}

function attackAdjacentEnemy(entity) {
	var adjacentEnemies = [];
	
	for(var e in entities) {
		var other = entities[e];
		
		if(other.faction != entity.faction && other.hp > 0) {
			if(Math.abs(other.x - entity.x) + Math.abs(other.y - entity.y) == 1) {
				adjacentEnemies.push(other);
			}
		}
	}
	
	if (adjacentEnemies.length == 0) {
		return false;
	}
	
	var enemyToAttack = adjacentEnemies.sort(function(a, b) {
		if(a.hp == b.hp) {
			if(a.y == b.y) {
				return a.x - b.x;
			}
			return a.y - b.y;
		}
		return a.hp - b.hp;
	})[0];
		
	enemyToAttack.hp -= entity.attack;
	
	if(enemyToAttack.hp <= 0) {
		grid[enemyToAttack.y][enemyToAttack.x].block = false;
	}
	
	removeDeadEntities();
	
	return true;
}

function removeDeadEntities() {
	entities = entities.filter(function(e) {
		return e.hp > 0;
	});
}

function findClosestTarget(entity) {
	var inRangeLocations = [];
	
	for(var e in entities) {
		var other = entities[e];
		if(other.faction != entity.faction) {
			inRangeLocations.push(...openGridSorrounding(other));
		}
	}
	
	var reachable = [];
	
	for(var g in inRangeLocations) {
		var gridSpace = inRangeLocations[g];
		
		var pathTo = getPath(entity, gridSpace);
		
		if(pathTo) {
			reachable.push({ gridSpace: gridSpace, path: pathTo, score: pathTo.length });
		}
	}
	
	if(reachable.length == 0) {
		return null;
	}
	
	var orderedReachable = reachable.sort(function(a, b) {
		if(a.score == b.score) {
			if(a.path[0].y == b.path[0].y) {
				return a.path[0].x - b.path[0].x;
			}
			return a.path[0].y - b.path[0].y;
		}
		return a.score - b.score;
	});

	return orderedReachable[0];
}

function printPath(path) {
	for(var y = 0; y < grid.length; y++) {
		var line = '';
lineloop:	for(var x = 0; x < grid[y].length; x++) {
			for(var p in path) {
				var step = path[p];
				if (step.x == x && step.y == y) {
					line += 'P';
					continue lineloop;
				}
			}
			if(grid[y][x].block) {
				line += '#';
			} else {
				line += '.';
			}
		}
		console.log(line);
	}
}

function printWorld() {
	for(var y = 0; y < grid.length; y++) {
		var line = '';
lineloop:	for(var x = 0; x < grid[y].length; x++) {
			for(var e in entities) {
				var entity = entities[e];
				if (entity.x == x && entity.y == y) {
					line += entity.faction;
					continue lineloop;
				}
			}
			if(grid[y][x].block) {
				line += '#';
			} else {
				line += '.';
			}
		}
		console.log(line);
	}
}

var iters = 0;

while(bothFactionsAlive()) {
	
	var orderedEntities = entities.sort(function(a, b) {
		if(a.y == b.y) {
			return a.x - b.x;
		}
		return a.y - b.y;
	});
	
	//console.log(iters);
	console.clear();
	printWorld();
	//console.log(entities);
	
	for(var e in orderedEntities) {
		var entity = orderedEntities[e];
		
		if(entity.hp < 0) {
			continue;
		}
		
		if(!attackAdjacentEnemy(entity)) {
			var closestTargetAndPath = findClosestTarget(entity);
			
			if(closestTargetAndPath) {
				// we can move
				grid[entity.y][entity.x].block = false;
				var newLocation = closestTargetAndPath.path[0];
				
				//printPath(closestTargetAndPath.path);
				
				grid[newLocation.y][newLocation.x].block = true;
				entity.x = newLocation.x;
				entity.y = newLocation.y;
			}
			
			attackAdjacentEnemy(entity);
		}
	}
	iters++;
}

console.log(iters-1);
printWorld();
console.log(entities);

var sumhp = 0;

for(var e in entities) {
	var entity = entities[e];
	sumhp += entity.hp;
}

console.log('hp:' + sumhp);