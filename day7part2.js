var a = [{child: 'F', parent: 'R' },{child: 'I', parent: 'P' },{child: 'C', parent: 'O' },{child: 'H', parent: 'K' },{child: 'Y', parent: 'N' },{child: 'M', parent: 'J' },{child: 'D', parent: 'W' },{child: 'B', parent: 'N' },{child: 'T', parent: 'A' },{child: 'R', parent: 'L' },{child: 'P', parent: 'S' },{child: 'O', parent: 'J' },{child: 'X', parent: 'N' },{child: 'A', parent: 'K' },{child: 'N', parent: 'G' },{child: 'W', parent: 'U' },{child: 'Q', parent: 'U' },{child: 'V', parent: 'U' },{child: 'J', parent: 'G' },{child: 'G', parent: 'S' },{child: 'Z', parent: 'U' },{child: 'U', parent: 'S' },{child: 'E', parent: 'L' },{child: 'K', parent: 'L' },{child: 'L', parent: 'S' },{child: 'M', parent: 'N' },{child: 'T', parent: 'E' },{child: 'J', parent: 'U' },{child: 'G', parent: 'L' },{child: 'D', parent: 'P' },{child: 'T', parent: 'Z' },{child: 'U', parent: 'L' },{child: 'Z', parent: 'K' },{child: 'Q', parent: 'V' },{child: 'G', parent: 'K' },{child: 'Z', parent: 'E' },{child: 'Q', parent: 'Z' },{child: 'J', parent: 'S' },{child: 'G', parent: 'U' },{child: 'I', parent: 'M' },{child: 'W', parent: 'K' },{child: 'Y', parent: 'V' },{child: 'B', parent: 'Q' },{child: 'Y', parent: 'D' },{child: 'I', parent: 'G' },{child: 'A', parent: 'S' },{child: 'X', parent: 'S' },{child: 'O', parent: 'N' },{child: 'M', parent: 'X' },{child: 'V', parent: 'Z' },{child: 'W', parent: 'Z' },{child: 'C', parent: 'L' },{child: 'Q', parent: 'G' },{child: 'A', parent: 'U' },{child: 'G', parent: 'Z' },{child: 'P', parent: 'Q' },{child: 'C', parent: 'Z' },{child: 'U', parent: 'K' },{child: 'Q', parent: 'L' },{child: 'X', parent: 'U' },{child: 'A', parent: 'N' },{child: 'N', parent: 'S' },{child: 'Z', parent: 'L' },{child: 'F', parent: 'D' },{child: 'D', parent: 'A' },{child: 'J', parent: 'K' },{child: 'W', parent: 'Q' },{child: 'T', parent: 'J' },{child: 'T', parent: 'W' },{child: 'E', parent: 'K' },{child: 'P', parent: 'U' },{child: 'O', parent: 'Z' },{child: 'D', parent: 'B' },{child: 'R', parent: 'J' },{child: 'O', parent: 'A' },{child: 'N', parent: 'E' },{child: 'D', parent: 'G' },{child: 'M', parent: 'Q' },{child: 'F', parent: 'W' },{child: 'T', parent: 'L' },{child: 'U', parent: 'E' },{child: 'X', parent: 'L' },{child: 'M', parent: 'G' },{child: 'Z', parent: 'S' },{child: 'F', parent: 'Y' },{child: 'N', parent: 'Z' },{child: 'T', parent: 'U' },{child: 'D', parent: 'O' },{child: 'H', parent: 'X' },{child: 'V', parent: 'E' },{child: 'M', parent: 'T' },{child: 'Y', parent: 'O' },{child: 'P', parent: 'E' },{child: 'C', parent: 'E' },{child: 'P', parent: 'L' },{child: 'M', parent: 'A' },{child: 'F', parent: 'T' },{child: 'I', parent: 'C' },{child: 'X', parent: 'Z' },{child: 'Y', parent: 'U' },{child: 'B', parent: 'E' }];

var steps = {};

for(var dep in a) {
	var dependency = a[dep];
		
	if (!steps[dependency.parent]) {
		steps[dependency.parent] = { step: dependency.parent, dependencies: [dependency.child], done: false, inprogress: false };
	} else {
		steps[dependency.parent].dependencies.push(dependency.child);
	}
	
	if (!steps[dependency.child]) {
		steps[dependency.child] = { step: dependency.child, dependencies: [], done: false, inprogress: false };
	}
}

var currentWorkers = [
	{work: null, cooldown: 0},
	{work: null, cooldown: 0},
	{work: null, cooldown: 0},
	{work: null, cooldown: 0},
	{work: null, cooldown: 0}
];
var currentTime = 0;

function stepToTime(s) {
	return s.charCodeAt() - 4;
}

while (true) {
	// complete the closest to complete work
	var shortestCooldown = 0;
	if (currentWorkers.filter(w => w.work !== null).length) {
		shortestCooldown = Math.min.apply(null, currentWorkers.filter(w => w.work !== null).map(w => w.cooldown));
	}
	
	currentTime += shortestCooldown;
	
	for (var i = 0; i < currentWorkers.length; i++) {
		if (currentWorkers[i].cooldown > 0) {
			currentWorkers[i].cooldown -= shortestCooldown;
		}
		if (currentWorkers[i].cooldown == 0 && currentWorkers[i].work !== null) {
			currentWorkers[i].work.done = true;
			currentWorkers[i].work = null;
		}
	}

	var candidates = [];

	for(var s in steps) {
		var step = steps[s];
		
		if(step.dependencies.filter(function(d) {
			return steps[d].done == false;
		}).length == 0 && step.done == false) {
			candidates.push(step);
		}
	}
	
	if (candidates.length == 0) {
		break;
	}
	
	var orderedCandidates = candidates.sort(function (a, b) {
		if(a.step < b.step) {
			return -1;
		}
		return 1;
	});

	for (var c = 0; c < orderedCandidates.length; c++) {
		for(var i = 0; i < currentWorkers.length; i++) {
			if (currentWorkers[i].cooldown == 0 && orderedCandidates[c].inprogress == false) {
				currentWorkers[i].work = orderedCandidates[c];
				currentWorkers[i].cooldown = stepToTime(orderedCandidates[c].step);
				orderedCandidates[c].inprogress = true;
			}
		}
	}
}

console.log(currentTime);