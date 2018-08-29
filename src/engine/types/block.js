const Instruction = require("../instruction.js");
const PString = require("./string.js");
const PNumber = require("./number.js");
const PBoolean = require("./boolean.js");
const PArray = require("./array.js");
const PMap = require("./map.js");
const PName = require("./name.js");
const Commands = require("../commands");

function buildToken(block, token) {
	let type = typeof token;
	if (type == "string") {
		return new PString(block, token);
	}else if (type == "boolean") {
		return new PBoolean(block, token);
	}else if (type == "number") {
		return new PNumber(block, token);
	}else if (type == "object") {
		if (Array.isArray(token)) {
			return new PArray(block, token);
		}else if (token._parserName) {
			if (token.name in Commands)
				return new (Commands[token.name])(block, token);
			else
				return new PName(block, token);
		}else if (token._parserBlock) {
			let block = new PancakeBlock(token.tokens.length);
			block.arguments = token.arguments;
			block.closure = token.closure;
			block.fill(token.tokens);
			return block;
		}else{
			return new PMap(block, token);
		}
	}
}

class PancakeBlock extends Instruction {
	constructor(size) {
		super();
		this._blockInstruction = true;

		this.size = size;
		this.closure = false;
		this.instructions = new Array(size);
		this.arguments = 0;
	}

	fill(tokens) {
		for (let i = 0; i < tokens.length; i++) {
			let token = tokens[i];

			this.instructions[i] = buildToken(this, token);
		}
	}

	run(caller, stack) {
		this.parentStack = stack;
		stack.pushValue(this);
	}

	execute(caller, stack) {
		let stck = stack || caller;
		
		for (let i = 0; i < this.size; i++) {
			this.instructions[i].run(this, stck);
		}
	}
}

module.exports = PancakeBlock;