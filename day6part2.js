var a = [{x:84, y:212},{x:168, y:116},{x:195, y:339},{x:110, y:86},{x:303, y:244},{x:228, y:338},{x:151, y:295},{x:115, y:49},{x:161, y:98},{x:60, y:197},{x:40, y:55},{x:55, y:322},{x:148, y:82},{x:86, y:349},{x:145, y:295},{x:243, y:281},{x:91, y:343},{x:280, y:50},{x:149, y:129},{x:174, y:119},{x:170, y:44},{x:296, y:148},{x:152, y:160},{x:115, y:251},{x:266, y:281},{x:269, y:285},{x:109, y:242},{x:136, y:241},{x:236, y:249},{x:338, y:245},{x:71, y:101},{x:254, y:327},{x:208, y:231},{x:289, y:184},{x:282, y:158},{x:352, y:51},{x:326, y:230},{x:88, y:240},{x:292, y:342},{x:352, y:189},{x:231, y:141},{x:280, y:350},{x:296, y:185},{x:226, y:252},{x:172, y:235},{x:137, y:161},{x:207, y:90},{x:101, y:133},{x:156, y:234},{x:241, y:185}];

var xmax = -999999;
var ymax = -999999;
var xmin = 999999;
var ymin = 999999;

for(var i = 0; i < a.length; i++) {
	if (a[i].x < xmin) {
		xmin = a[i].x;
	}
	if (a[i].x > xmax) {
		xmax = a[i].x;
	}
	if (a[i].y < ymin) {
		ymin = a[i].y;
	}
	if (a[i].y > ymax) {
		ymax = a[i].y;
	}
}

var count = 0;

for(var x = xmin; x <= xmax; x++) {
	for(var y = ymin; y <= ymax; y++) {
		var totalDistance = 0;
		
		for(var i = 0; i < a.length; i++) {
			totalDistance += (Math.abs(x-a[i].x) + Math.abs(y-a[i].y))
		}
		
		if (totalDistance < 10000) {
			count++;
		}
	}
}

console.log(count);

//44634