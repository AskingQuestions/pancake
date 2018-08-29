const Instruction = require("../instruction.js");
const Stack = require("../stack.js");

class PancakeRun extends Instruction {
	run(caller, stack) {
		let block = stack.readValue(-1);
		if (block.closure) {
			block.execute(caller, stack);
		}else{
			let args = stack.popValues(block.arguments + 1);
			args.shift();
			let fresh = new Stack(stack.size);
			fresh.parent = block.parentStack;
			fresh.pushValues(args);
			block.execute(stack, fresh);
			let returns = fresh.popValue();
			let vals = fresh.popValues(returns);
			stack.pushValues(vals);
		}
	}
}

module.exports = PancakeRun;