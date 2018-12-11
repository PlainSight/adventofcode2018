var serialNumber = 9445;

var sumAreaTable = {};

function insertPower(x, y, power) {
	sumAreaTable[x + y * 300] = power;
}

function getPower(x, y) {
	return sumAreaTable[x + y * 300];
}

var startTime = new Date();

for(var x = 1; x <= 300; x++) {
	for(var y = 1; y <= 300; y++) {
		var rankId = x + 10;
		var powerLevel = rankId * y;
		powerLevel += serialNumber;
		powerLevel *= rankId;
		
		powerLevel %= 1000;
		powerLevel /= 100;
		powerLevel = Math.floor(powerLevel);
		powerLevel -= 5;
		
		var sumArea = powerLevel;
		
		if (x > 1) {
			sumArea += getPower(x-1, y);
		}
		if (y > 1) {
			sumArea += getPower(x, y-1);
		}
		if (x > 1 && y > 1) {
			sumArea -= getPower(x-1, y-1);
		}
		
		insertPower(x, y, sumArea);
	}
}

var bestX = 1;
var bestY = 1;
var bestSquareSize = 1;
var bestScore = 0;

for(var x = 1; x < 300; x++) {
	for(var y = 1; y < 300; y++) {
		
		for(var squareSize = 1; squareSize <= 300 - Math.max(x, y); squareSize++) {
			var score = getPower(x+squareSize-1, y+squareSize-1);
			
			if (x > 1) {
				score -= getPower(x-1, y+squareSize-1);
			}
			if (y > 1) {
				score -= getPower(x+squareSize-1, y-1);
			}
			if (x > 1 && y > 1) {
				score += getPower(x-1, y-1);
			}
						
			if (score > bestScore) {
				bestX = x;
				bestY = y;
				bestSquareSize = squareSize;
				bestScore = score;
			}
		}
	}
}

console.log(bestScore + ': ' + bestX + ',' + bestY + ',' + bestSquareSize);

console.log(new Date() - startTime + 'ms');