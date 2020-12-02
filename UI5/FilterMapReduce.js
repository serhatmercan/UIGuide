let aMercans = [{
	id: 1,
	name: "Serhat",
	surname: "Mercan",
	score: 75
}, {
	id: 2,
	name: "Elif",
	surname: "Mercan",
	score: 100
}, {
	id: 3,
	name: "Selim",
	surname: "Mercan",
	score: 100
}];

aMercans.filter(item => item.surname === "Mercan").map(item => item.id += 1).reduce((total, id) => total + id, 0); // Return 9