var immuneSystem = [];
var infection = [];

function init(boost) {
	immuneSystem = [
		{ n: 4555, hp: 9688, immune: 'radiation', weak: 'bludgeoning', attackType: 'radiation', attackDamage: 17+boost, initiative: 1 },
		{ n: 2698, hp: 9598, immune: 'slashing', weak: '', attackType: 'slashing', attackDamage: 29+boost, initiative: 16 },
		{ n: 4682, hp: 6161, immune: '', weak: '', attackType: 'radiation', attackDamage: 13+boost, initiative: 19 },
		{ n: 8197, hp: 4985, immune: '', weak: 'cold', attackType: 'cold', attackDamage: 5+boost, initiative: 18 },
		{ n: 582, hp: 3649, immune: '', weak: '', attackType: 'slashing', attackDamage: 46+boost, initiative: 13 },
		{ n: 53, hp: 5147, immune: 'bludgeoning,slashing', weak: '', attackType: 'cold', attackDamage: 828+boost, initiative: 11 },
		{ n: 5231, hp: 8051, immune: '', weak: 'radiation', attackType: 'radiation', attackDamage: 14+boost, initiative: 9 },
		{ n: 704, hp: 4351, immune: 'cold', weak: 'slashing', attackType: 'radiation', attackDamage: 60+boost, initiative: 2 },
		{ n: 326, hp: 9157, immune: '', weak: 'cold,slashing', attackType: 'radiation', attackDamage: 261+boost, initiative: 6 },
		{ n: 6980, hp: 3363, immune: '', weak: 'radiation', attackType: 'slashing', attackDamage: 4+boost, initiative: 4 }
	];

	infection = [
		{ n: 1994, hp: 48414, immune: 'slashing', weak: '', attackType: 'cold', attackDamage: 46, initiative: 3 },
		{ n: 42, hp: 41601, immune: 'fire', weak: 'radiation', attackType: 'bludgeoning', attackDamage: 1547, initiative: 7 },
		{ n: 3050, hp: 29546, immune: 'fire', weak: '', attackType: 'fire', attackDamage: 19, initiative: 10 },
		{ n: 3825, hp: 5609, immune: 'cold', weak: 'slashing,bludgeoning', attackType: 'bludgeoning', attackDamage: 2, initiative: 12 },
		{ n: 37, hp: 30072, immune: '', weak: '', attackType: 'cold', attackDamage: 1365, initiative: 20 },
		{ n: 189, hp: 49726, immune: '', weak: 'bludgeoning', attackType: 'slashing', attackDamage: 514, initiative: 5 },
		{ n: 930, hp: 39623, immune: '', weak: 'radiation', attackType: 'bludgeoning', attackDamage: 81, initiative: 8 },
		{ n: 6343, hp: 31638, immune: 'slashing', weak: '', attackType: 'bludgeoning', attackDamage: 9, initiative: 15 },
		{ n: 1561, hp: 10633, immune: '', weak: 'radiation,cold', attackType: 'cold', attackDamage: 12, initiative: 14 },
		{ n: 3198, hp: 25539, immune: 'radiation,fire', weak: '', attackType: 'bludgeoning', attackDamage: 15, initiative: 17 }
	];
}


// var immuneSystem = [
// 	{ n: 17, hp: 5390, immune: '', weak: 'radiation,bludgeoning', attackType: 'fire', attackDamage: 4507, initiative: 2 },
// 	{ n: 989, hp: 1274, immune: 'fire', weak: 'bludgeoning,slashing', attackType: 'slashing', attackDamage: 25, initiative: 3 }
// ];

// var infection = [
// 	{ n: 801, hp: 4706, immune: '', weak: 'radiation', attackType: 'bludgeoning', attackDamage: 116, initiative: 1 },
// 	{ n: 4485, hp: 2961, immune: 'radiation', weak: 'fire,cold', attackType: 'slashing', attackDamage: 12, initiative: 4 },
// ];

function effectivePower(group) {
	return group.n * group.attackDamage;
}

	/* 
		The attacking group chooses to target the group in the enemy army to which it would deal the most damage (after accounting for weaknesses and immunities, but not accounting for whether the defending group has enough units to actually receive all of that damage).
	*/

function damageCalculation(attacker, defender) {
	var damage = effectivePower(attacker);
	if(defender.immune.indexOf(attacker.attackType) > -1) {
		return 0;
	}
	if(defender.weak.indexOf(attacker.attackType) > -1) {
		return damage * 2;
	}
	return damage;
}

function damage(defender, damage) {
	var losses = Math.min(Math.floor(damage / defender.hp), defender.n);
	defender.n -= losses;
	return losses;
}

function selectTargets() {
	// use initiative as an id
	var targeted = {};

	/*
		In decreasing order of effective power, groups choose their targets; in a tie, the group with the higher initiative chooses first
	*/

	immuneSystem.sort(function(a, b) {
		if(effectivePower(a) == effectivePower(b)) {
			return b.initiative - a.initiative;
		}
		return effectivePower(b) - effectivePower(a)
	}).forEach(function(g) {
		g.target = null;
		var targets = infection.filter(function(t) {
			return !targeted[t.initiative];
		}).sort(function(a, b) {
			if(damageCalculation(g, b) == damageCalculation(g, a)) {
				if(effectivePower(b) == effectivePower(a)) {
					return b.initiative - a.initiative;
				}
				return effectivePower(b) - effectivePower(a);
			}
			return damageCalculation(g, b) - damageCalculation(g, a);
		});
		var target = targets[0];

		if(target && damageCalculation(g, target) > 0) {
			g.target = target;
			targeted[target.initiative] = true;
		}
	});

	infection.sort(function(a, b) {
		if(effectivePower(a) == effectivePower(b)) {
			return b.initiative - a.initiative;
		}
		return effectivePower(b) - effectivePower(a)
	}).forEach(function(g) {
		g.target = null;
		var targets = immuneSystem.filter(function(t) {
			return !targeted[t.initiative];
		}).sort(function(a, b) {
			if(damageCalculation(g, b) == damageCalculation(g, a)) {
				if(effectivePower(b) == effectivePower(a)) {
					return b.initiative - a.initiative;
				}
				return effectivePower(b) - effectivePower(a);
			}
			return damageCalculation(g, b) - damageCalculation(g, a);
		});
		var target = targets[0];

		if(target && damageCalculation(g, target) > 0) {
			g.target = target;
			targeted[target.initiative] = true;
		}
	});
}

function attack() {
	var losses = 0;
	var allGroups = immuneSystem.concat(infection);

	allGroups.sort(function(a, b) {
		return b.initiative - a.initiative;
	}).forEach(function(g) {
		if(g.n > 0) {
			if (g.target) {
				//console.log(g.initiative + ' attacks ' + g.target.initiative);
				losses += damage(g.target, damageCalculation(g, g.target));
			}
		}
	});

	immuneSystem = immuneSystem.filter(function (g) {
		return g.n > 0;
	});

	infection = infection.filter(function (g) {
		return g.n > 0;
	});
	return losses;
}


var boost = 0;
var terminate = false;
outer: while(!terminate) {
	boost++;
	init(boost);
	console.log('boost: ' + boost);
	while(immuneSystem.length > 0 && infection.length > 0) {
		selectTargets();
		var losses = attack();
		if(losses == 0) {
			continue outer;
		}
	}
	if(immuneSystem.length > 0) {
		terminate = true;
	}
}

//console.log(immuneSystem);
console.log('immune System Sum:' + 
	immuneSystem.reduce(function(a, b) {
		return { n: a.n + b.n };
	}, { n: 0 }).n
);
//console.log(infection);
console.log('infection:' + 
	infection.reduce(function(a, b) {
		return { n: a.n + b.n };
	}, {n: 0}).n
);
