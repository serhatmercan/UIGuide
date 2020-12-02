// ARROW FUNCTION 

// Using w/out Parameters
var fnArrow = () => "Hello World!";
fnArrow(); // "Hello World!"

// Using w/ Parameter
var fnArrow = val => "Hello " + val;
fnArrow("Serhat"); // "Hello Serhat"

// Using w/ Parameters
var fnArrow = (sVal1, sVal2) => "Hello " + sVal1 + " " + sVal2;
fnArrow("Serhat", "Mercan"); // "Hello Serhat Mercan"

// Loop => FOR - EACH - ARROW FUNCTION
var aData = [];
aData.forEach(item => console.log(item.name));

// Return Array Object
getObject = () => {
	return {
		id: "",
		name: ""
	}
};