const Instruction = require("../instruction.js");

class PancakeLet extends Instruction {
	run(caller, stack) {
		let name = stack.popValue();
		stack.addReference(name, stack.unit - 1);
	}
}

module.exports = PancakeLet;