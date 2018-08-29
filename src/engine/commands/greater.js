const Instruction = require("../instruction.js");

class PancakeGreater extends Instruction {
	run(caller, stack) {
		let val = stack.popValues(2);
		stack.pushValue(val[1] > val[0]);
	}
}

module.exports = PancakeGreater;