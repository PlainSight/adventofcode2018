// inc = clockwise, dec = counter-clockwise

// 452 players; last marble is worth 71250 points

// players score
var players = [];
for (var p = 0; p < 452; p++) {
	players.push(0);
}

var marbles = [0];
var currentMarbleIndex = 0;
var currentPlayer = 0;

for (var m = 1; m <= 71250; m++) {
	

	if (m % 23 == 0) {
		var score = m;
		
		var toRemove = moduloAdd(currentMarbleIndex, -7, marbles.length);
		var removed = marbles.splice(toRemove, 1);
		currentMarbleIndex = toRemove % marbles.length;
				
		score += removed[0];
		
		players[currentPlayer] += score;
	} else {
		var toAddBefore = moduloAdd(currentMarbleIndex, 2, marbles.length);
		marbles.splice(toAddBefore, 0, m);
		currentMarbleIndex = (toAddBefore) % marbles.length;
	}
	
	currentPlayer++
	currentPlayer = currentPlayer % players.length;
}

function moduloAdd(base, change, mod) {
	if (change < 0) {
		if (base + change < 0) {
			return (mod + (base + change)) % mod;
		} else {
			return base + change;
		}
	} else {
		return (base + change) % mod;
	}
}

console.log(Math.max(...players));