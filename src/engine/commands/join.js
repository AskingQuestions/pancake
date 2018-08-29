const Instruction = require("../instruction.js");

class PancakeJoin extends Instruction {
	run(caller, stack) {
		let val = stack.popValues(2);
		stack.pushValue(val[1].join(val[0]));
	}
}

module.exports = PancakeJoin;