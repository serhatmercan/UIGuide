const aMercans = [{
	ID: 1,
	Name: "Serhat",
	Surname: "Mercan",
	Score: 75
}, {
	ID: 2,
	Name: "Elif",
	Surname: "Mercan",
	Score: 100
}, {
	ID: 3,
	Name: "Selim",
	Surname: "Mercan",
	Score: 100
}];

aMercans.filter(oMercan => oMercan.Surname === "Mercan").map(oItem => oItem.ID += 1).reduce((iTotal, iID) => iTotal + iID, 0); // Return 9