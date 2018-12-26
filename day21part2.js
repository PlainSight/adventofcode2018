var haltValue = 0;
var two = 0;
var four = 0;
var five = 0;

var lastHaltValue = 0;
var haltValues = {};

var five = 0;
outer: while(true) {
	var four = five | 65536;
	five = 8858047;

	while(true) {
		two = four & 255;
		five = five + two;
		five = five & 16777215;
		five = five * 65899;
		five = five & 16777215;

		// halt check
		if(four < 256) {
			if(haltValue == five) {
				break outer;
			} else {
				if(haltValues[five]) {
					break outer;
				} else {
					haltValues[five] = true;
					lastHaltValue = five;
				}
				continue outer;
			}
		} else {
			four = Math.floor(four / 256);
		}
	}
}

console.log('last halt value: ' + lastHaltValue);














