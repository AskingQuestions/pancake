(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeGreater extends Instruction {
	run(caller, stack) {
		let val = stack.popValues(2);
		stack.pushValue(val[1] > val[0]);
	}
}

module.exports = PancakeGreater;
},{"../instruction.js":15}],2:[function(require,module,exports){
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
},{"../instruction.js":15,"../stack.js":16}],3:[function(require,module,exports){
module.exports = {
	sum: require("./sum.js"),
	print: require("./print.js"),
	push: require("./push.js"),
	join: require("./join.js"),
	let: require("./let.js"),
	set: require("./set.js"),
	run: require("./run.js"),
	if: require("./if.js"),
	loop: require("./loop.js"),
	">": require("./greater.js"),
	"*": require("./multiply.js"),
	"-": require("./subtract.js")
};
},{"./greater.js":1,"./if.js":2,"./join.js":4,"./let.js":5,"./loop.js":6,"./multiply.js":7,"./print.js":8,"./push.js":9,"./run.js":10,"./set.js":11,"./subtract.js":12,"./sum.js":13}],4:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeJoin extends Instruction {
	run(caller, stack) {
		let val = stack.popValues(2);
		stack.pushValue(val[1].join(val[0]));
	}
}

module.exports = PancakeJoin;
},{"../instruction.js":15}],5:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeLet extends Instruction {
	run(caller, stack) {
		let name = stack.popValue();
		stack.addReference(name, stack.unit - 1);
	}
}

module.exports = PancakeLet;
},{"../instruction.js":15}],6:[function(require,module,exports){
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
},{"../instruction.js":15,"../stack.js":16}],7:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeMultiply extends Instruction {
	run(caller, stack) {
		let vals = stack.popValues(2);
		stack.pushValue(vals[1] * vals[0]);
	}
}

module.exports = PancakeMultiply;
},{"../instruction.js":15}],8:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakePrint extends Instruction {
	run(caller, stack) {
		console.log(stack.readValue(-1));
	}
}

module.exports = PancakePrint;
},{"../instruction.js":15}],9:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakePush extends Instruction {
	run(caller, stack) {
		let val = stack.popValue();
		stack.readValue(-1).push(val);
	}
}

module.exports = PancakePush;
},{"../instruction.js":15}],10:[function(require,module,exports){
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
},{"../instruction.js":15,"../stack.js":16}],11:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeSet extends Instruction {
	run(caller, stack) {
		let name = stack.stack[stack.unit - 1];
		stack.popValue();
		stack.references[name.name].unit = stack.unit - 1;
	}
}

module.exports = PancakeSet;
},{"../instruction.js":15}],12:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeSubtract extends Instruction {
	run(caller, stack) {
		let vals = stack.popValues(2);
		stack.pushValue(vals[1] - vals[0]);
	}
}

module.exports = PancakeSubtract;
},{"../instruction.js":15}],13:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeSum extends Instruction {
	run(caller, stack) {
		let vals = stack.popValues(2);
		stack.pushValue(vals[1] + vals[0]);
	}
}

module.exports = PancakeSum;
},{"../instruction.js":15}],14:[function(require,module,exports){
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
},{"./types":20}],15:[function(require,module,exports){
class PancakeInstruction {
	run(block, stack) {

	}
}

module.exports = PancakeInstruction;
},{}],16:[function(require,module,exports){
class PancakeReference {
	constructor(name, unit, stack) {
		this.name = name;
		this.unit = unit;
		this.stack = stack;
	}
}

class PancakeStack {
	constructor(size) {
		this.unit = 0;
		this.stack = new Array(size);
		this.references = {};
		this.parent = null;
	}

	getReference(name) {
		return this.references[name] || (this.parent != null ? this.parent.getReference(name) : null);
	}

	addReference(name, unit) {
		this.references[name] = new PancakeReference(name, unit, this);
	}

	popValues(amount) {
		let arr = new Array(amount);
		
		for (let i = 1; i <= amount; i++) {
			arr[i - 1] = this.filterValue(this.stack[this.unit - i]);
			this.stack[this.unit - i] = null;
		}

		this.unit -= amount;

		return arr;
	}

	filterValue(val) {
		if (val instanceof PancakeReference) {
			return val.stack.stack[val.unit];
		}else
			return val;
	}

	collapse() {
		this.stack[this.unit - 2] = this.stack[this.unit - 1];
		this.stack[this.unit - 1] = null;
		this.unit--;
	}

	readValue(at) {
		return this.filterValue(this.stack[this.unit + at]);
	}

	pushValue(val) {
		this.stack[this.unit] = val;
		this.unit++;
	}

	pushValues(vals) {
		for (let i = 0; i < vals.length; i++) {
			this.stack[this.unit + i] = vals[i];
		}

		this.unit += vals.length;
	}

	popValue() {
		let rtn = null;
		
		if (this.unit > 0) {
			rtn = this.filterValue(this.stack[this.unit - 1]);
			this.stack[this.unit - 1] = null;
		}
		
		this.unit--;

		return rtn;
	}
}

module.exports = PancakeStack;
},{}],17:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeArray extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		stack.pushValue(this.value);
	}
}

module.exports = PancakeArray;
},{"../instruction.js":15}],18:[function(require,module,exports){
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
},{"../commands":3,"../instruction.js":15,"./array.js":17,"./boolean.js":19,"./map.js":21,"./name.js":22,"./number.js":23,"./string.js":24}],19:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeBoolean extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		stack.pushValue(this.value);
	}
}

module.exports = PancakeBoolean;
},{"../instruction.js":15}],20:[function(require,module,exports){
module.exports = {
	String: require("./string.js"),
	Map: require("./map.js"),
	Number: require("./number.js"),
	Name: require("./name.js"),
	Array: require("./array.js"),
	Boolean: require("./boolean.js"),
	Block: require("./block.js")
};
},{"./array.js":17,"./block.js":18,"./boolean.js":19,"./map.js":21,"./name.js":22,"./number.js":23,"./string.js":24}],21:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeMap extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		stack.pushValue(this.value);
	}
}

module.exports = PancakeMap;
},{"../instruction.js":15}],22:[function(require,module,exports){
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
},{"../instruction.js":15}],23:[function(require,module,exports){
const Instruction = require("../instruction.js");

class PancakeNumber extends Instruction {
	constructor(block, data) {
		super();
		this.value = data;
	}

	run(block, stack) {
		stack.pushValue(this.value);
	}
}

module.exports = PancakeNumber;
},{"../instruction.js":15}],24:[function(require,module,exports){
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
},{"../instruction.js":15}],25:[function(require,module,exports){
module.exports = {
	Engine: require("./engine/engine.js"),
	Stack: require("./engine/stack.js"),
	Parser: require("./parser/simple.js"),
	Instruction: require("./engine/instruction.js"),
	Types: require("./engine/types"),
	Commands: require("./engine/commands")
};
window.Pancake = module.exports;
},{"./engine/commands":3,"./engine/engine.js":14,"./engine/instruction.js":15,"./engine/stack.js":16,"./engine/types":20,"./parser/simple.js":26}],26:[function(require,module,exports){
class PancakeKeyword {
	constructor(str) {
		this._parserName = true;

		this.statement = false;
		this.name = str;
	}
}

class PancakeBlock {
	constructor(tokens, args, closure) {
		this._parserBlock = true;

		this.closure = closure;
		this.arguments = args;
		this.tokens = tokens;
	}
}

class PancakeParser {
	constructor(options) {
		this.strict = false;
		this.version = "1.0";
		this.options = options;

		this.errors = [];
	}

	error(location, msg) {
		this.errors.push([location, msg]);
	}

	parseName(str, offset) {
		const keyword = /[a-zA-Z0-9_><+/*^%!.-]/;
		let value = "";

		for (let i = offset; i < str.length; i++) {
			const char = str[i];

			if (keyword.test(char)) {
				value += char;
			}else{
				if (value == "true" || value == "false") {
					return [i - 1, value == "true"];
				}

				return [i - 1, new PancakeKeyword(value)];
			}
		}

		return [str.length, new PancakeKeyword(value)];
	}

	parseString(str, offset, openChar) {
		const escapeCodes = {t: "\t", n: "\n", r: "\r"};
		let value = "";
		let escape = false;

		for (let i = offset; i < str.length; i++) {
			const char = str[i];
			if (char == "\\" && escape) {
				escape = false;
				value += "\\";
			}else if (char == "\\") {
				escape = true;
			}else if (char != openChar || escape) {
				if (escape) {
					value += escapeCodes[char];
					escape = false;
				}else
					value += char;
			}else
				return [i, value];
		}

		this.error(offset, "Unclosed string");
	}

	parseNumber(str, offset) {
		let value = "";
		const numeric = /[0-9.-]/;
		for (let i = offset; i < str.length; i++) {
			const char = str[i];
			if (numeric.test(char)) {
				value += char;
			}else{
				return [i - 1, parseFloat(value)];
			}
		}

		return [str.length, parseFloat(value)];
	}

	parseBlock(str, offset, openChar, args) {
		const numeric = /[0-9]/;
		const keyword = /[a-zA-Z><+/*^%!_.-]/;
		const openBlock = "{";
		const closeBlock = "}";
		const openClosureBlock = "(";
		const closeClosureBlock = ")";
		const openArray = "[";
		const closeArray = "]";
		const openString = '"';
		const closeString = '"';
		const seg = ",";

		let closeChar = closeBlock;
		if (openChar == openClosureBlock)
			closeChar = closeClosureBlock;

		let lines = [];
		let tokens = []; // Array that we put each command in
		
		for (let i = offset; i < str.length; i++) {
			const char = str[i];

			if (this.space(char)) {
				// Skip white space
				lines.push(i);
			}else if (char == openString || char == "'") {
				let out = this.parseString(str, i + 1, char);
				if (out) {
					i = out[0];
					tokens.push(out[1]);
				}
			}else if (char == openArray) {
				let out = this.parseObject(str, i + 1);
				if (out) {
					i = out[0];
					tokens.push(out[1]);
				}
			}else if (char == openBlock || char == openClosureBlock) {
				let arg = 0;
				if (numeric.test(str[i + 1]))
					arg = parseInt(str[i + 1]);
				
				let out = this.parseBlock(str, i + (arg ? 2 : 1), char, arg);
				if (out) {
					i = out[0];
					tokens.push(out[1]);
				}
			}else if (char == closeChar) {
				return [i, new PancakeBlock(tokens, args, closeChar == closeClosureBlock)];
			}else if (keyword.test(char)) {
				let out = this.parseName(str, i);
				i = out[0];
				tokens.push(out[1]);
			}else{
				let out = this.parseNumber(str, i);
				i = out[0];
				tokens.push(out[1]);
			}
		}

		if (!openChar)
			return tokens;
		else
			this.error(offset, "Unclosed block");
	}

	parseObject(str, offset) {
		const keyword = /[a-zA-Z_.-]/;
		let array = true;
		let arrayValue = [];
		let mapValue = {};
		let key = null;
		let value = null;

		for (let i = offset; i < str.length; i++) {
			const char = str[i];

			if (char == '"' || char == "'") {
				key = this.parseString(str, i + 1, char);
				i = key[0];
				key = key[1];
			}else if (this.space(char)) {

			}else if (char == "," || char == ":") {
				if (char == ",") {
					if (value == null && key != null) {
						arrayValue.push(key);
						key = null;
					}else if (key == null && value != null) {
						arrayValue.push(value);
						value = null;
					}else if (key != null && value != null) {
						mapValue[key] = value;
						key = value = null;
					}
				}else{
					array = false;
				}
			}else if (keyword.test(char)) {
				key = this.parseName(str, i);
				i = key[0];
				key = key[1];
			}else if (char != "]") {
				value = this.parseNumber(str, i);
				i = value[0];
				value = value[1];
			}else{
				if (value == null && key != null) {
					arrayValue.push(key);
				}else if (key == null && value != null) {
					arrayValue.push(value);
				}else if (key != null && value != null) {
					mapValue[key] = value;
				}
				return [i, array ? arrayValue : mapValue];
			}
		}

		this.error(str.length, "Unclosed array");
	}

	space(char) {
		return char == " " || char == "\t" || char == "\n" || char == "\r";
	}

	parse(str) {
		let lines = [];
		for (let i = 0; i < str.length; i++)
			if (str[i] == "\n")
				lines.push(i);

		let tokens = this.parseBlock(str, 0);

		let outputLog = "";

		for (let error of this.errors) {
			let line = 0;
			let column = 0;
			for (let i = 0; i < lines.length; i++)
				if (error[0] > lines[i]) {
					line = i;
					column = error[0] - lines[i];
				}

			outputLog += "Error: " + error[1] + " at " + line + ":" + column;
		}

		if (outputLog.length > 0)
			console.log(outputLog);
		
		return tokens;
	}
}

module.exports = PancakeParser;
},{}]},{},[25]);
