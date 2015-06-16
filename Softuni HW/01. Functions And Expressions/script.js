function info(args) {
	var value,
		type = typeof(args);

	if (Array.isArray(args)) {
		type = 'array';
	};

	value = args;

	console.log(value + ' (' + type + ')');
}

info(25);
info("Pesho");
info(true);
info({
	name: 'pesho'
});
info(null);
info(undefined);
info([1, 2, 3]);

//Task2

info.call("", 100);

// Task 3
function testContext(){
	console.log(this);
}

console.log("Global context: " + testContext());

function Test(){
	console.log("Global context: " + testContext());
}

console.log(testContext());