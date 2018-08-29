const Instruction = require("../instruction.js");

class PancakeString extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		stack.pushValue(this.value);
	}
}

module.exports = PancakeString;