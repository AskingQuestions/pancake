const Types = require("./types");

class PancakeEngine {
	constructor(opts) {
		
	}

	build(tokens) {
		let block = new Types.Block(tokens.length);
		block.fill(tokens);
		return block;
	}

	buildInstructionSet() {

	}
}

module.exports = PancakeEngine;