// Function Context
/* 
The Arguments Object
CALL & APPLY
Function Binding
New Syntax: The Function w/ out Parameters
New Syntax: Declare The Function w/ Parameters
New Syntax: Closure
Default Parameters
*/

// The Arguments Object
function fnSumAll() {
	var i, iSum = 0;
	for (i = 0; i < arguments.length; i++) {
		iSum += arguments[i];
	}
	return iSum;
}
fnSumAll(5, 10, 15, 20); // => 50

// CALL & APPLY
var oPerson = {
	fullName: function (city, country) {
		return this.firstName + " " + this.lastName + "," + city + "," + country;
	}
};

var oPersonX = {
	firstName: "Serhat",
	lastName: "Mercan"
};

oPerson.fullName.call(oPersonX, "İstanbul", "Turkey"); // => "Serhat Mercan,İstanbul,Turkey"
oPerson.fullName.apply(oPersonX, ["İstanbul", "Turkey"]); // => "Serhat Mercan,İstanbul,Turkey"

// Function Binding
let oUser = {
	Name: "Serhat"
};

function fnSayName(sValue) {
	console.log(sValue + " " + this.Name);
}

fnSayName.bind(oUser)("Hello"); // Hello Serhat

// New Syntax: The Function w/ out Parameters
let fnHello = new Function('console.log("Hello")');
fnHello();

// New Syntax: Declare The Function w/ Parameters
let fnSum = new Function('a', 'b', 'return a + b');
fnSum(1, 2); // 3

// New Syntax: Closure
let fnClosure = () => {
	let fnHello = new Function('console.log("Hello")');
	return fnHello;
}
fnClosure()(); // Hello

// Default Parameters
function getPerson(sFirstName, iYearOfBirth, sLastName = "Mercan", sNationality = "Turkey") {
	this.FirstName = sFirstName;
	this.YearOfBirth = iYearOfBirth;
	this.LastName = sLastName;
	this.Nationality = sNationality;
}
let oSerhat = new getPerson("Serhat", 1994); // {FirstName: "Serhat", YearOfBirth: 1994, LastName: "Mercan", Nationality: "Turkey"}
let oFatma = new getPerson("Fatma", 1967, "Tercan"); // {FirstName: "Fatma", YearOfBirth: 1967, LastName: "Tercan", Nationality: "Turkey"}