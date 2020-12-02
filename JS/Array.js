// ARRAY CONTENT
/*
Define Array
Add Data
Length
Add a New Element => PUSH
Remove The Last Element => POP
Loop => FOR
Loop => FOR - EACH - ARROW FUNCTION
Loop => FOR - EACH 
To String
Join
Remove The First Element => SHIFT
Add a New Element At The Beginning of Array => UNSHIFT
Delete Data => DELETE
Add New Items => SPLICE
Remove Items  => SPLICE
Merge Two Arrays => CONCAT
Sort Alphabetically Ascending  => SORT
Sort Alphabetically Descending => REVERSE
Sort Numberic Array Ascending  => w/ FUNCTION
Sort Numberic Array Descending => w/ FUNCTION
Sort & Reduce
MAX & MIN Number in Array
MAP Method	  => MAP
MAP Method	  => Item & Index
MAP Method	  => Change Array Of Objects Attribute
MAP Method	  => Delete Array Of Objects Attribute
MAP Method	  => Split & Upper Case & Slice & Join 
FILTER Method => FILTER
REDUCE Method => REDUCE
EVERY Method  => TRUE || FALSE
SOME Method   => TRUE || FALSE
Get Finding Item Index in Array 	 => INDEXOF
Get Finding Last Item Index in Array => LASTINDEXOF
Find => FIND
Find Index => FIND INDEX
Find Index w/ Parameters => FIND INDEX
Include Data => Include
Spread Operator => [...]
*/

// Define Array 
var aData = [];

// Add Data
aData[0] = "Serhat";
aData[1] = "Mercan";

// Length
aData.length; // => 2

// Add a New Element
aData.push("Selim"); // => aData = ["Serhat","Mercan","Selim"]

// Remove The Last Element
aData.pop(); // => aData = ["Serhat","Mercan"]

// Loop => FOR
for (var i = 0; i < aData.length; i++) {
	console.log(aData[i]);
}

// Loop => FOR - EACH - ARROW FUNCTION
aData.forEach(item => console.log(item.name));
["Serhat", "Mercan"].forEach(item => console.log(item));

// Loop => FOR - EACH 
aData.forEach(function (data) {
	console.log(data);
});

aData.forEach(fnLoop);

function fnLoop(data) {
	console.log(data);
}

// To String
aData.toString(); // => Serhat,Mercan

// Join
aData.join(" * "); // => Serhat * Mercan

// Remove The First Element
aData.shift(); // => Mercan

// Add a New Element At The Beginning of Array
aData.unshift("Serhat"); // => Serhat Mercan

// Delete Data
delete aData[1]; // => aData = ["Serhat", empty]

// Add New Items
aData.splice(1, 0, "Selim", "Elif"); // => aData = ["Serhat", "Selim", "Elif", "Mercan"]

// Remove Items
aData.splice(0, 1); // 0 => Begin Index , 1 => Items Count ; => aData = ["Selim", "Elif", "Mercan"]	

// Merge Two Arrays
var aData2 = ["Selim", "Elif"];
aData = aData.concat(aData2); // => aData = ["Serhat", "Mercan", "Selim", "Elif"]

// Sort Alphabetically Ascending
aData.sort(); // => ["Elif", "Mercan", "Selim", "Serhat"]

// Sort Alphabetically Descending
aData.reverse(); // => ["Serhat", "Selim", "Mercan", "Elif"]

// Sort Numberic Array Ascending
var aNumber = [1, 11, 7, 9];
aNumber.sort(function (a, b) {
	return a - b
}); // => [1, 7, 9, 11]

// Sort Numberic Array Descending
aNumber.sort(function (a, b) {
	return b - a
}); // => [11, 9, 7, 1]

// Array Sort
aNumbers = [1, 5, 99, 3, 4, 7];
aNumbers.sort((a, b) => a - b); // [1, 3, 4, 5, 7, 99]
aNumbers.sort((a, b) => b - a); // [99, 7, 5, 4, 3, 1]
aNumbers.reduce((sum, current) => sum + current); // 119

// MAX & MIN Number in Array
function fnGetMaxValue(aData) {
	return Math.max.apply(null, aData);
}

function fnGetMinValue(aData) {
	return Math.min.apply(null, aData);
}
fnGetMaxValue(aNumber); // => 11
fnGetMinValue(aNumber); // => 1

// MAP Method 
var aNumber2 = [];
aNumber2 = aNumber.map(x => x * 2); // aNumber2 = [2, 22, 14, 18]

// MAP Method: Item & Index
var aData = ["X", "Y", "Z"];
aData.map((item, index) => (index + 1) + ". " + item); // ["1. X", "2. Y", "3. Z"]

// MAP Method: Change Array Of Objects Attribute
var aArrayObj = [{
	Key: "1",
	Value: "10"
}, {
	Key: "2",
	Value: "100"
}];

aArrayObj = aArrayObj.map(item => {
	return {
		ID: item.Key,
		Value: item.Value
	};
});

// MAP Method: Delete Array Of Objects Attribute
aArrayObj = aArrayObj.map(item => {
	delete item.Value;
});

// MAP Method: Split & Upper Case & Slice & Join 
fnCamelize = (sData) => {
	return sData.split('-').map((word, index) => index == 0 ? word : word[0].toUpperCase() + word.slice(1)).join('');
}
console.log(fnCamelize("list-style-image")); // "listStyleImage"

// FILTER Method
aNumber.filter(x => x > 10); // Return the Array => 11 

// REDUCE Method
aNumber.reduce(function (total, x) {
	return total + x; // => 1 + 11 + 7 + 9 = 28
});

aNumber.reduce((total, x) => total + x, 0); // => 1 + 11 + 7 + 9 = 28

function fnSum(total, value) {
	return total + value;
}
aNumber.reduce(fnSum); // => 1 + 11 + 7 + 9 = 28

// EVERY Method
aNumber.every(x => x > 0); // True
aNumber.every(x => x > 10); // False

// SOME Method
aNumber.every(x => x > 10); // True
aNumber.every(x => x > 15); // False

// Get Finding Item Index in Array
aNumber.indexOf(7); // => 2
aNumber.indexOf(2); // => -1 : Does Not Include

// Get Finding Last Item Index in Array
aNumber[4] = 11;
aNumber.lastIndexOf(11); // => 4

// Find
aNumber.find(x => x > 10); // 11

function fnFind(x) {
	return x > 1;
}
aNumber.find(fnFind); // => 11

function fnFindObject(x) {
	return x.Id === 2;
}

// Find Index
aData.findIndex(x => x.Index === 0); // -1 => Does Not Include

// Find Index w/ Parameters
aData.findIndex(x => x.Id === sId || x.Value === sValue); // -1 => Does Not Include

// Include
var aData = ["Hare", "Krishna", "Hare", "Krishna", "Krishna", "Krishna", "Hare", "Hare", ":-O"],
	aResult = [];

for (let oData of aData) {
	if (!aResult.includes(oData)) {
		aResult.push(oData);
	}
}

// Spread Operator => [...]
const aMehmetsFamily = ["Mehmet", "Fatma", "Serhat"];
const aSercansFamily = ["Sercan", "Yeliz", "Elif", "Selim"];

[...aMehmetsFamily, "X", ...aSercansFamily]; // ["Mehmet", "Fatma", "Serhat", "X", "Sercan", "Yeliz", "Elif", "Selim"]