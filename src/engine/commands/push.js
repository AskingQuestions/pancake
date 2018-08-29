const Instruction = require("../instruction.js");

class PancakePush extends Instruction {
	run(caller, stack) {
		let val = stack.popValue();
		stack.readValue(-1).push(val);
	}
}

module.exports = PancakePush;