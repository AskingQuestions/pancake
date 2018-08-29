const Instruction = require("../instruction.js");
const Stack = require("../stack.js");

class PancakeLoop extends Instruction {
	run(caller, stack) {
		let block = stack.readValue(-1);
		let val = stack.readValue(-2);
		stack.collapse();

		for (let i = 0; i < val; i++) {
			block.execute(caller, stack);
		}
	}
}

module.exports = PancakeLoop