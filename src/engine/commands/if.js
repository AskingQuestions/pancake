const Instruction = require("../instruction.js");
const Stack = require("../stack.js");

class PancakeIf extends Instruction {
	run(caller, stack) {
		let ifBlock = stack.readValue(-2);
		let elseBlock = stack.readValue(-1);
		let val = stack.readValue(-3);

		if (val) {
			ifBlock.execute(caller, stack);
		}else{
			elseBlock.execute(caller, stack);
		}
	}
}

module.exports = PancakeIf