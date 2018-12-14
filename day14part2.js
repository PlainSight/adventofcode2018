var scoresAfter = 360781;
var scoresAfterString = '360781';

var scores = [3, 7];

var elfOne = 0;
var elfTwo = 1;

var iters = 0;

while(true) {
	iters++;
	var sum = scores[elfOne] + scores[elfTwo];
	
	if (sum < 10) {
		// one recipe
		var firstNew = sum;
		
		scores.push(firstNew);
		
	} else {
		// two recipes
		var firstNew = 1;
		var secondNew = sum % 10;
		
		scores.push(firstNew);
		scores.push(secondNew);
	}
	
	elfOne = (elfOne + 1 + scores[elfOne]) % scores.length;
	elfTwo = (elfTwo + 1 + scores[elfTwo]) % scores.length;
	
	
	if(iters % 100000 == 0) {
		var allScores = scores.join('');
		var indexOfString = allScores.indexOf(scoresAfterString);
		if(indexOfString != -1) {
			console.log(indexOfString);
			break;
		}
		console.log(iters);
	}
}