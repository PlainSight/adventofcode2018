// 452 players; last marble is worth 7125000 points

var startTime = new Date();

// players score
var players = [];
for (var p = 0; p < 452; p++) {
	players.push(0);
}

var firstMarble = {
	value: 0
};
firstMarble.next = firstMarble;
firstMarble.last = firstMarble;

var marbles = [firstMarble];
var currentMarble = firstMarble;
var currentPlayer = 0;

for (var m = 1; m <= 7125000; m++) {
	if (m % 23 == 0) {
		var score = m;
		
		for(var i = 0; i < 7; i++) {
			currentMarble = currentMarble.last;
		}
		score += currentMarble.value;
		
		currentMarble.last.next = currentMarble.next;
		currentMarble.next.last = currentMarble.last;
		currentMarble = currentMarble.next;
		
		players[currentPlayer] += score;
	} else {
		var toAddAfter = currentMarble.next;
		var toAddBefore = toAddAfter.next;

		var newMarble = {
			value: m,
			next: toAddBefore,
			last: toAddAfter
		}
		
		toAddAfter.next = newMarble;
		toAddBefore.last = newMarble;
		
		currentMarble = newMarble;
	}
	
	currentPlayer++
	currentPlayer = currentPlayer % players.length;
}


console.log(Math.max(...players));

console.log(new Date() - startTime + 'ms');