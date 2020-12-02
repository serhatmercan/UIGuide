let aValues = ["Hare", "Krishna", "Hare", "Krishna", "Krishna", "Krishna", "Hare", "Hare", ":-O"];

fnUnique = (aData) => {
	return Array.from(new Set(aData));
}

console.log(fnUnique(aValues)); // ["Hare", "Krishna", ":-O"]