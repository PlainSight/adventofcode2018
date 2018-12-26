var fs = require('fs');

var input = fs.readFileSync('./day21input.txt', { encoding: 'utf-8' });

var inputLines = input.split('\n');

var registers = [0, 0, 0, 0, 0, 0];
var instructions = [];
var instructionPointerRegister = 0;
var instructionPointer = 0;

inputLines.forEach(function(i) {
	var parts = i.split(' ');
	var op = parts[0];

	if(op == '#ip') {
		instructionPointerRegister = parseInt(parts[1]);
	} else {
		var a = parseInt(parts[1]);
		var b = parseInt(parts[2]);
		var c = parseInt(parts[3]);

		instructions.push({
			op: op,
			params: [a, b, c]
		});
	}
});

function addr(params) {
	registers[params[2]] = registers[params[0]] +  registers[params[1]];
}
function addi(params) {
	registers[params[2]] = registers[params[0]] +  params[1];
}
function mulr(params) {
	registers[params[2]] = registers[params[0]] *  registers[params[1]];
}
function muli(params) {
	registers[params[2]] = registers[params[0]] *  params[1];
}
function banr(params) {
	registers[params[2]] = registers[params[0]] &  registers[params[1]];
}
function bani(params) {
	registers[params[2]] = registers[params[0]] & params[1];
}
function borr(params) {
	registers[params[2]] = registers[params[0]] |  registers[params[1]];
}
function bori(params) {
	registers[params[2]] = registers[params[0]] | params[1];
}
function setr(params) {
	registers[params[2]] = registers[params[0]];
}
function seti(params) {
	registers[params[2]] = params[0];
}
function gtir(params) {
	if (params[0] > registers[params[1]]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}
function gtri(params) {
	if (registers[params[0]] > params[1]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}
function gtrr(params) {
	if (registers[params[0]] > registers[params[1]]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}
function eqir(params) {
	if (params[0] == registers[params[1]]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}
function eqri(params) {
	if (registers[params[0]] == params[1]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}
function eqrr(params) {
	if (registers[params[0]] == registers[params[1]]) {
		registers[params[2]] = 1;
	} else {
		registers[params[2]] = 0
	}
}

var allOperations = {
	'addr': addr, 'addi': addi, 'mulr': mulr, 'muli': muli, 'banr': banr, 'bani': bani, 
	'borr': borr, 'bori': bori, 'setr': setr, 'seti': seti, 'gtir': gtir, 'gtri': gtri, 
	'gtrr': gtrr, 'eqir': eqir, 'eqri': eqri, 'eqrr': eqrr
};

var twentyEightValues = {};

var instructionsExecuted = 0;
var lastHalter = 0;

while(instructionPointer >= 0 && instructionPointer < instructions.length) {
	// write instruction pointer to register
	registers[instructionPointerRegister] = instructionPointer;
	
	var instruction = instructions[instructionPointer];

	allOperations[instruction.op](instruction.params);

	instructionsExecuted++;

	if(instructionPointer == 28) {
		if(twentyEightValues[registers[5]]) {
			break;
		} else {
			twentyEightValues[registers[5]] = registers[5];
		}
		lastHalter = registers[5];
	}

	// write register to instruction pointer
	instructionPointer = registers[instructionPointerRegister];
	instructionPointer++;
}

console.log('lastHalter: ' + lastHalter);
console.log('halted: ' + instructionsExecuted);
