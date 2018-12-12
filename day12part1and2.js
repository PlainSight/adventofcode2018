var a = [true, false, false, false, true, false, false, true, true, true, false, true, false, true, true, true, false, true, true, true, true, false, true, true, true, true, false, true, false, false, true, false, true, true, false, false, true, false, false, true, true, false, false, true, false, false, false, false, false, true, false, true, false, true, false, true, true, false, true, false, false, false, true, true, true, false, true, false, false, true, true, false, false, true, false, true, true, false, false, true, true, true, false, false, true, false, false, true, true, false, true, false, false, true, true, false, false, false];

var rules = [
{ match: [false, false, false, true, false ], result:  true },
{ match: [true, false, false, true, true ], result:  true },
{ match: [false, false, false, false, false ], result:  false },
{ match: [true, true, false, true, true ], result:  false },
{ match: [false, true, true, false, false ], result:  true },
{ match: [false, true, true, false, true ], result:  false },
{ match: [true, true, true, true, false ], result:  true },
{ match: [false, true, false, true, false ], result:  false },
{ match: [false, false, true, false, true ], result:  false },
{ match: [false, true, false, true, true ], result:  false },
{ match: [false, true, false, false, true ], result:  false },
{ match: [true, true, false, false, false ], result:  true },
{ match: [true, false, false, false, true ], result:  true },
{ match: [true, true, true, true, true ], result:  false },
{ match: [true, false, true, true, true ], result:  true },
{ match: [false, false, true, true, true ], result:  true },
{ match: [true, true, true, false, false ], result:  false },
{ match: [true, false, true, false, true ], result:  true },
{ match: [true, true, false, false, true ], result:  true },
{ match: [false, false, true, false, false ], result:  true },
{ match: [false, true, true, true, true ], result:  false },
{ match: [true, false, true, true, false ], result:  false },
{ match: [false, false, false, false, true ], result:  false },
{ match: [false, false, false, true, true ], result:  false },
{ match: [true, false, false, false, false ], result:  false },
{ match: [true, false, false, true, false ], result:  false },
{ match: [false, false, true, true, false ], result:  false },
{ match: [true, true, true, false, true ], result:  true },
{ match: [true, false, true, false, false ], result:  true },
{ match: [true, true, false, true, false ], result:  true },
{ match: [false, true, true, true, false ], result:  false },
{ match: [false, true, false, false, false ], result:  false }
];

var plants = {};
var nextGeneration = {};

function getMaxMin() {
	var allPlants = [];
	
	for(var p in plants) {
		if (plants[p]) {
			allPlants.push(p);
		}
	}
	
	return {
		min: Math.min(...allPlants),
		max: Math.max(...allPlants)
	};
}

for(var i = 0; i < a.length; i++) {
	plants[i] = a[i];
}

var score = 0;

for(var p in plants) {
	var plant = plants[p];
	if (plant) {
		score += parseInt(p);
	}
}

console.log(score);

var lastScore = score;

for(var g = 0; g < 20; g++) {
	var minMax = getMaxMin();
	
	for (var p = minMax.min-2; p <= minMax.max+2; p++) {
		
		for(var r in rules) {
			var rule = rules[r];
			var matches = true;
			for(var m = 0; m < rule.match.length; m++) {
				var plantvalue = plants[p-2+m] || false;
				if (plantvalue != rule.match[m]) {
					matches = false;
				}
			}
			
			if (matches) {
				nextGeneration[p] = rule.result;
			}
		}
	}
	
	plants = nextGeneration;
	nextGeneration = {};
	
	var score = 0;
	
	for(var p in plants) {
		var plant = plants[p];
		if (plant) {
			score += parseInt(p);
		}
	}

	console.log('score:' + score);
	console.log('diff: ' + (score - lastScore));
	console.log('gen: ' + (g+1));
	
	lastScore = score;
}

// extrapolate from 
// score:4875
// diff: 22
// gen: 200
// to gen 50,000,000,000

