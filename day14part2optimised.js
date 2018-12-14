var scoresAfter = 360781;
var scoresAfterArray = [3, 6, 0, 7, 8, 1];

var scores = [3, 7];

var elfOne = 0;
var elfTwo = 1;

var iters = 0;

outer: while(true) {
	iters++;
	var sum = scores[elfOne] + scores[elfTwo];
	var lookback = -1;
	
	if (sum < 10) {
		// one recipe
		var firstNew = sum;
		
		scores.push(firstNew);
		lookback = firstNew == scoresAfterArray[scoresAfterArray.length-1] ? scores.length-1 : -1;
	} else {
		// two recipes
		var firstNew = 1;
		var secondNew = sum % 10;
		
		scores.push(firstNew);
		scores.push(secondNew);
		
		lookback = firstNew == scoresAfterArray[scoresAfterArray.length-1] ? scores.length-2 : secondNew == scoresAfterArray[scoresAfterArray.length-1] ? scores.length-1 : -1;
	}
	
	elfOne = (elfOne + 1 + scores[elfOne]) % scores.length;
	elfTwo = (elfTwo + 1 + scores[elfTwo]) % scores.length;
	
	
	if(lookback != -1 && lookback > scoresAfterArray.length) {
		var j = 0;
		for(var i = scoresAfterArray.length - 2; i >= 0; i--) {
			j++;
			if(scoresAfterArray[i] != scores[lookback-j]) {
				continue outer;
			}
		}
		console.log(lookback-j);
		break;
	}
}