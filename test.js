const Pancake = require("./src/pancake.js");

let input = `
{1
	n let
	n 0 > (
		n n 1 - factorial run *
	) (
		1
	) if
1} factorial let

0 i let
10
(
	i 1 sum i set
	i factorial run print
) loop
`;

let engine = new Pancake.Engine();
let parser = new Pancake.Parser();
let tokens = parser.parse(input);

let block = engine.build(tokens);

let stack = new Pancake.Stack(50);
block.execute(stack);

//console.log(stack);