// --> MATH FUNCTION <--

// ROUND
var fRoundUp = 2.8,
	fRoundDown = 2.3;
Math.round(fRoundUp); // 3
Math.round(fRoundDown); // 2

// POW
var iPow = Math.pow(5, 2);
console.log("5 ^ 2 = " + iPow); // => 5 ^ 2 = 25

// SQUARE ROOT => SQRT
Math.sqrt(64); // 8

// ABSOLUTE => ABS
Math.abs(-4.5); // 4.5

// UP NEAREST INTEGER => CEIL
Math.ceil(2.8); // 3

// DOWN NEAREST INTEGER => FLOOR
Math.floor(2.8); // 2

// MIN VALUE IN LIST
Math.min(0, 150, 30, 20, -8, -200); // -200

// MAX VALUE IN LIST
Math.max(0, 150, 30, 20, -8, -200); // 150

// RANDOM NUMBER
Math.random(); // Between 0 And 1
Math.floor(Math.random() * 10) + 1 // Between 1 And 10