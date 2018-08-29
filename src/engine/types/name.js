const Instruction = require("../instruction.js");

class PancakeName extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		let found = stack.getReference(this.value.name);
		if (found) {
			stack.pushValue(found);
		}else
			stack.pushValue(this.value.name);
	}
}

module.exports = PancakeName;