var mMap = new Map([
	["Amount1", 100],
	["Amount2", 250],
	["Amount3", 500]
]);

// Map(3) {"Amount1" => 100, "Amount2" => 250, "Amount3" => 500}

// Iterate Over Keys
for (let amountKey of mMap.keys()) {
	console.log(amountKey); // Amount1 - Amount2 - Amount3
}
// Iterate Over Values
for (let amountValue of mMap.values()) {
	console.log(amountValue); // 100, 250, 500
}
// Iterate Over Entries
for (let entry of mMap) {
	console.log(entry); // ["Amount1", 100] , ["Amount2", 250] , ["Amount3", 500]
}

var mMap = new Map();
mMap.set("Banana", 10);
mMap.set("Orange", 20);
mMap.set("Meat", 50);
// Map(3) {"Banana" => 10, "Orange" => 20, "Meat" => 50}
mMap.get("Banana"); // 10