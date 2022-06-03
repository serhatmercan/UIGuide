const aData = [{
	ID: 1,
	Material: "X",
	Amount: 75
}, {
	ID: 1,
	Material: "X",
	Amount: 100
}, {
	ID: 1,
	Material: "Y",
	Amount: 150
}, {
	ID: 2,
	Material: "Y",
	Amount: 100
}, {
	ID: 2,
	Material: "Z",
	Amount: 10
}, {
	ID: 3,
	Material: "Z",
	Amount: 25
}];
const xData = aData.reduce((aItems, oValue) => {	
	let oData = oItem.filter(xItem => {
		return xItem.ID == oValue.ID && xItem.Material == oValue.Material;
	}).pop() || {
		ID: oValue.ID,
		Material: oValue.Material,
		Amount: 0
	};

	oData.Amount += oValue.Amount;
	aItems.push(oData);

	return aItems;
}, []);
const oXData = xData.map(oItem => {
	return {
		ID: oItem.ID,
		Material: oItem.Material,
		Amount: oItem.Amount
	};
}).filter((v, i, a) => a.findIndex(t => (t.ID === v.ID) && (t.Material === v.Material)) === i);