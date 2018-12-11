var serialNumber = 9445;

function makeTree(startx, starty, endx, endy) {
	if (startx == endx && starty == endy) {
		
		var rankId = startx + 10;
		var powerLevel = rankId * starty;
		powerLevel += serialNumber;
		powerLevel *= rankId;
		
		powerLevel %= 1000;
		powerLevel /= 100;
		powerLevel = Math.floor(powerLevel);
		powerLevel -= 5;
		
		return {
			startx: startx,
			starty: starty,
			endx: endx,
			endy: endy,
			children: [],
			score: powerLevel
		}
	}
	
	var children = [];
	
	var breakx = Math.floor((startx + endx)/2);
	var postbreakx = Math.min(endx, breakx+1);
	var breaky = Math.floor((starty + endy)/2);
	var postbreaky = Math.min(endy, breaky+1);
	
	children.push(makeTree(startx, starty, breakx, breaky));
	children.push(makeTree(postbreakx, postbreaky, endx, endy));
	
	if(startx != endx && starty != endy) {
		children.push(makeTree(startx, postbreaky, breakx, endy));
		children.push(makeTree(postbreakx, starty, endx, breaky));
	}
			
	return {
		startx: startx,
		starty: starty,
		endx: endx,
		endy: endy,
		children: children,
		score: children.map(c => c.score).reduce((a,b) => a + b, 0)
	}
}

var root = makeTree(1, 1, 300, 300);

console.log('tree made');

function sumValuesFrom(tree, startx, starty, endx, endy) {
	if (tree.startx > endx || tree.endx < startx || tree.starty > endy || tree.endy < starty) {
		return 0;
	}
	
	if (tree.startx >= startx && tree.endx <= endx && tree.starty >= starty && tree.endy <= endy) {
		return tree.score;
	} else {
		var sum = 0;
		for(var i = 0; i < tree.children.length; i++) {
			sum += sumValuesFrom(tree.children[i], startx, starty, endx, endy);
		}
		return sum;
	}
}

var bestX = 1;
var bestY = 1;
var bestSquareSize = 1;
var bestScore = 0;

for (var squareSize = 1; squareSize <= 300; squareSize++) {
	for(var x = 1; x <= 300-(squareSize-1); x++) {
		for(var y = 1; y <= 300-(squareSize-1); y++) {
			var sumPower = sumValuesFrom(root, x, y, x + (squareSize-1), y + (squareSize-1));
			
			if (sumPower > bestScore) {
				bestScore = sumPower;
				bestX = x;
				bestY = y;
				bestSquareSize = squareSize;
			}
		}
	}
	
	console.log('current size:' + squareSize);
}

console.log(bestScore + ': ' + bestX + ',' + bestY + ',' + bestSquareSize);

