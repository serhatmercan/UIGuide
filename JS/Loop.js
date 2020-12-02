// Array Loop
var aData = [];

// For Each
aData.forEach(item => console.log(item)); // Array
aData.forEach(item => console.log(item.id)); // Array Object

// FOR
for (var i = 0; i < aData.length; i++) {
	aData[i]
}

// FOR => IN
for (var i in aData) {
	aData[i]
}

// FOR => OF - 1
for (var x of aData) {
	x
}
// FOR => OF - 2
var sText = "Serhat";
for (var x of sText) {
	console.log(x); // S e r h a t
}

// WHILE
var i = 0;
while (aData[i]) {
	console.log(aData[i]);
	i++;
}

// DO - WHILE
var i = 0;
do {
	console.log(i)
	i++;
}
while (i < 10);