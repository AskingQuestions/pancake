const Instruction = require("../instruction.js");

class PancakeSum extends Instruction {
	run(caller, stack) {
		let vals = stack.popValues(2);
		stack.pushValue(vals[1] + vals[0]);
	}
}

module.exports = PancakeSum;