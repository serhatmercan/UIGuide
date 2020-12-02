// OBJECT
/* 
Inner Object
Loop => IN
Call Method
Define an Object => Default - Get - Set
Constructor
Prototypes - 1
Prototypes - 2
Return Array Object
Computed Properties
Assign
Method: Changing a Property Value			=> .defineProperty
Method: Adding a Property					=> .defineProperty
Method: Adding Getters & Setters			=> .defineProperty 
Method: Get Values To Array 				=> .values
Method: Returns all properties as an array	=> .getOwnPropertyNames
Method: Accessing the prototype 			=> .getPrototypeOf
Method: Entries					 			=> .entries
*/
// Inner Object
var oPerson = {
	firstName: "Serhat",
	lastName: "Mercan",
	age: function (iYear) {
		return iYear - 1994;
	}
};
console.log(oPerson.firstName + " " + oPerson.lastName + " age is " + oPerson.age(2020)); // Serhat Mercan age is 26

// Loop 
var oPerson = {
	fname: "Serhat",
	lname: "Mercan",
	age: 25
};
var sText = "";
for (var i in oPerson) {
	sText += person[i] + " "; // "John Doe 25 "
}

// Call Method
var oPerson1 = {
	fullName: function () {
		return this.firstName + " " + this.lastName;
	}
}
var oPerson2 = {
	firstName: "Serhat",
	lastName: "Mercan"
}
oPerson1.fullName.call(oPerson2); // "Serhat Mercan"

// Define an Object => Default - Get - Set
var oObj = {
	counter: 0
};
Object.defineProperty(oObj, "reset", {
	get: function () {
		this.counter = 0;
	}
});
Object.defineProperty(oObj, "increment", {
	get: function () {
		this.counter++;
	}
});
Object.defineProperty(oObj, "add", {
	set: function (value) {
		this.counter += value;
	}
});

oObj.add = 10; // obj.counter = 10
oObj.increment; // obj.counter = 11
oObj.reset; // obj.counter = 0

// Constructor
function fnPerson(first, last, age, eye) {
	this.firstName = first;
	this.lastName = last;
	this.age = age;
	this.eyeColor = eye;
}

var myFather = new fnPerson("Mehmet", "Mercan", 62, "brown"),
	myMother = new fnPerson("Fatma", "Mercan", 53, "brown");

// Prototypes - 1
fnPerson.prototype.nationality = "Turkey"; // myFather.nationality => "Turkey"
fnPerson.prototype.fullname = function () {
	return this.firstName + " " + this.lastName // myMother.fullname() => Fatma Mercan
};

// Prototypes - 2
let user = {
	name: "Serhat",
	surname: "Mercan",
	set fullName(value) {
		[this.name, this.surname] = value.split(" ");
	},
	get fullName() {
		return console.log(this.name + " " + this.surname);
	}
};

let admin = {
	__proto__: user,
	isAdmin: true
};

console.log(admin.fullName);

// Return Array Object
getObject = () => {
	return {
		id: "",
		name: ""
	}
};

// Computed Properties
var oProp = "Name";
var oObj = {
	[oProp]: "Serhat"
};
oObj.Name; // Serhat

// Assign
let oUser = {
	Name: "Serhat"
};

Object.assign(oUser, {
	Surname: "Mercan"
}); // {Name: "Serhat", Surname: "Mercan"}

// METHODS
var oPerson = {
	firstName: "Serhat",
	lastName: "Mercan",
	language: "TR"
};

// Method: Changing a Property Value
Object.defineProperty(oPerson, "language", {
	value: "EN"
}); // oPerson => {firstName: "Serhat", lastName: "Mercan", language: "EN"}

// Method: Adding a Property
Object.defineProperty(oPerson, "country", {
	value: "Turkey"
}); // oPerson => {firstName: "Serhat", lastName: "Mercan", language: "EN", country: "Turkey"}

// Method: Adding Getters & Setters
Object.defineProperty(oPerson, "fullName", {
	get: function () {
		return this.firstName + " " + this.lastName;
	}
}); // oPerson.fullname => Serhat Mercan

// Method: Get Values To Array 
Object.values(oPerson); // ["Serhat", "Mercan", "TR"]

// Method: Returns all properties as an array
Object.getOwnPropertyNames(oPerson); // ["firstName", "lastName", "language", "country", "fullName"]

// Method: Accessing the prototype
Object.getPrototypeOf(oPerson); // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, ...}

// Method: Entries
let aPrices = {
	Banana: 1,
	Orange: 2,
	Meat: 4,
};

let aDoublePrices = Object.fromEntries(
	Object.entries(aPrices).map(([key, value]) => [key, value * 2])
);
/* 
aDoublePrices => {
	Banana: 2,
	Orange: 4,
	Meat: 8
}
*/