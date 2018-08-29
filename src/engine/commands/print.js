const Instruction = require("../instruction.js");

class PancakePrint extends Instruction {
	run(caller, stack) {
		console.log(stack.readValue(-1));
	}
}

module.exports = PancakePrint;