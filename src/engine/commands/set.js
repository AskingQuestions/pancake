const Instruction = require("../instruction.js");

class PancakeSet extends Instruction {
	run(caller, stack) {
		let name = stack.stack[stack.unit - 1];
		stack.popValue();
		stack.references[name.name].unit = stack.unit - 1;
	}
}

module.exports = PancakeSet;