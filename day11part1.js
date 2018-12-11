var serialNumber = 9445;

var bestX = 1;
var bestY = 1;

var bestScore = 0;

for(var x = 1; x <= 300-2; x++) {
	for(var y = 1; y <= 300-2; y++) {
		var sumPower = 0;
	
		for(var dx = 0; dx < 3; dx++) {
			for(var dy = 0; dy < 3; dy++) {
			
				var rankId = x + dx + 10;
				var powerLevel = rankId * (y + dy);
				powerLevel += serialNumber;
				powerLevel *= rankId;
				
				powerLevel %= 1000;
				powerLevel /= 100;
				powerLevel = Math.floor(powerLevel);
				powerLevel -= 5;
			
				sumPower += powerLevel;
			}
		}
		
		if (sumPower > bestScore) {
			bestScore = sumPower;
			bestX = x;
			bestY = y;
		}
	}
}

console.log(bestScore + ': ' + bestX + ',' + bestY);