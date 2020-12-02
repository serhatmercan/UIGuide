// VAR 
var sText = "Serhat"; // Global - Changeable

// LET
let sText = "Serhat"; // Local - Changeable

for (let i = 0; i < 10; i++) {
	console.log(i);
}

// CONST
const sText = "Serhat"; // Global - Just Changeable in Array

const aCars = ["Saab", "Volvo", "BMW"];

aCars[0] = "Opel";
aCars.push("Ford");

aCars; // ["Opel", "Volvo", "BMW", "Ford"]

// VARIABLE TYPE
typeof "Serhat"; // String