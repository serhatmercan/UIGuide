// TRY CATCH
try {
	adddlert("Welcome Serhat!");
} catch (err) {
	console.log(err.message); // => adddlert is not defined
}

// THROW
var x;

fnError(x);

function fnError(x) {
	try {
		if (x == "") throw "empty";
		if (isNaN(x)) throw "not a number";
		x = Number(x);
		if (x < 5) throw "too low";
		if (x > 10) throw "too high";
	} catch (err) {
		console.log(err);
	} finally {
		x = "";
	}
}

// RANGE & REFERENCE & SYNTAX & TYPE & URI ERROR
var iRange = 1;
try {
	iRange.toPrecision(500); // A number cannot have 500 significant digits
} catch (err) {
	console.log(err.name);
}