// One or Double Quotes
var sNameOdd = "I am called 'Serhat'",
	sNameEven = 'I am called "Serhat"';
console.log(sNameOdd); // I am called 'Serhat'
console.log(sNameEven); // I am called "Serhat"

// Escape Character
console.log("We are the so-called \"Vikings\" from the north."); // We are the so-called "Vikings" from the north.
console.log("It\'s alright."); // It's alright.
console.log("The character \\ is called backslash."); // The character \ is called backslash.		

// Finding a String in a String 
var sSentence = "Serhat Mercan locates in Serhat Mercan";

console.log(sSentence.indexOf("Mercan")); // 7	=> First Index Of	  
console.log(sSentence.lastIndexOf("Mercan")); // 32	=> Last Index Of
console.log(sSentence.search("Serhat")); // 0	=> Search Index Of

console.log(sSentence.substring(7, 13)); // Mercan			=> From 7 to 13
console.log(sSentence.substr(7, 6)); // Mercan			=> From 7 Forward To 6 
console.log(sSentence.substr(25)); // Serhat Mercan	=> From 25 Forward To End String
console.log(sSentence.substr(-13)); // Serhat Mercan	=> From Ending 13 to End String

console.log(sSentence.replace("Serhat", "Selim")); // Selim Mercan locates in Serhat Mercan	=> Replace
console.log(sSentence.replace("/SERHAT/i", "Selim")); // Serhat Mercan locates in Serhat Mercan	=> Replace Ignore Case Sensitive
console.log(sSentence.replace(/Serhat/g, "Selim")); // Selim Mercan locates in Selim Mercan		=> Replace ALL

// Concatenate String
var sText1 = "Serhat",
	sText2 = "Mercan";
console.log(sText1.concat(" ", sText2)); // Serhat Mercan

var sName = "Serhat";
sName += " Mercan";
console.log(sName); // Serhat Mercan

// Remove Space
var sTrim = "   Serhat Mercan   ";
console.log(sTrim.trim()); // Serhat Mercan

// Find Index of Character
var sChar = "Serhat";
console.log(sText1.charAt(4)); // a

// To Upper & Lower Case
var sCase = "Serhat";
console.log(sCase.toUpperCase()); // SERHAT
console.log(sCase.toLowerCase()); // serhat

// Split String
var sSplit = "Serhat,Mercan,26",
	aSplit = sSplit.split(","); // aSplit = ["Serhat", "Mercan", "26"]

// Split String By Character Length
let sComplexData = "123456789012345678901234567890",
	aSplits = sComplexData.match(/.{1,10}/g); // aSplits[0] = ["1234567890"]

// Change Value Type to String
var iValue = 5;
console.log(iValue.toString()); // "5"

// Remove Last Character
var sText = "Serhat,";
sText.slice(0, -1); // Serhat

// Convert String To Integer
var sNumber = "10";
let iNumber = parseInt(sNumber, 10); // 10

// Add Number To String
var sNumber = "10";
sNumber.padStart(10, 0); // "0000000010"