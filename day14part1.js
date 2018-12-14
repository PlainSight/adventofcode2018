var scoresAfter = 360781;
var scoresAfterString = '360781';

var scores = [3, 7];

var elfOne = 0;
var elfTwo = 1;

while(scores.length < scoresAfter+10) {
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
}

for(var i = scoresAfter; i < scores.length; i++) {
	console.log(i + ':' + scores[i]);
}