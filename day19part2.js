var input = '#ip 2\r\naddi 2 16 2\r\nseti 1 0 4\r\nseti 1 5 5\r\nmulr 4 5 1\r\neqrr 1 3 1\r\naddr 1 2 2\r\naddi 2 1 2\r\naddr 4 0 0\r\naddi 5 1 5\r\ngtrr 5 3 1\r\naddr 2 1 2\r\nseti 2 6 2\r\naddi 4 1 4\r\ngtrr 4 3 1\r\naddr 1 2 2\r\nseti 1 7 2\r\nmulr 2 2 2\r\naddi 3 2 3\r\nmulr 3 3 3\r\nmulr 2 3 3\r\nmuli 3 11 3\r\naddi 1 6 1\r\nmulr 1 2 1\r\naddi 1 6 1\r\naddr 3 1 3\r\naddr 2 0 2\r\nseti 0 3 2\r\nsetr 2 3 1\r\nmulr 1 2 1\r\naddr 2 1 1\r\nmulr 2 1 1\r\nmuli 1 14 1\r\nmulr 1 2 1\r\naddr 3 1 3\r\nseti 0 9 0\r\nseti 0 5 2';

var instructionPointerRegister = 0;
var instructions = [];
var registers = [1, 0, 0, 0, 0, 0];
var instructionPointer = 0;

var inputLines = input.split('\r\n');

inputLines.forEach(function(line) {
	var parts = line.split(' ');
		
	if(parts[0] == '#ip') {
		instructionPointerRegister = parseInt(parts[1]);
	} else {
		var instruction = {
			op: '',
			params: []
		};
		parts.forEach((p, i) => {
			if (i == 0) {
				instruction.op = p;
			} else {
				instruction.params.push(parseInt(p));
			}
		})
		
		instructions.push(instruction);
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

var instructionsExecuted = 0;
var last0 = 1;
var last1 = 0
var last2 = 0;
var last4 = 0;

while(instructionPointer >= 0 && instructionPointer < instructions.length && instructionsExecuted < 10000000) {
	// write instruction pointer to register
	registers[instructionPointerRegister] = instructionPointer;
	
	var instruction = instructions[instructionPointer];
	
	allOperations[instruction.op](instruction.params);
	
	instructionsExecuted++;
	
	if(instructionsExecuted > (10000000-20)) {
		console.log(instructionsExecuted);
		console.log('ip: ' + instructionPointer);
		console.log(instruction);
		console.log(registers);
	}
	
	// found core instructions by running this loop
	
	// program finds the factors of a number and sums them into register 0
	// sum of factors of register 4 is answer
	
	// write register to instruction pointer
	instructionPointer = registers[instructionPointerRegister];
	
	
	/*
	if(last4 != registers[4]) { //last0 != registers[0] || last1 != registers[1] || last2 != registers[2] || 
		//last0 = registers[0];
		//last1 = registers[1];
		//last2 = registers[2];
		last4 = registers[4];
		
		console.log('exe: ' + instructionsExecuted);
		console.log(registers);
	}
	*/
	/*
	if(last0 != registers[0]) { // || last1 != registers[1] || last2 != registers[2] || 
		last0 = registers[0];
		//last1 = registers[1];
		//last2 = registers[2];
		//last4 = registers[4];
		
		console.log(instructionsExecuted);
		console.log('ip: ' + instructionPointer);
		console.log(instruction);
		console.log(registers);
	}
	*/
	
	instructionPointer++;
}

console.log(registers);

