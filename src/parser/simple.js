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