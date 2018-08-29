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