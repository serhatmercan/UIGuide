let aData = [{
	Adres: 1,
	Matnr: "X",
	Miktar: 75
}, {
	Adres: 1,
	Matnr: "X",
	Miktar: 100
}, {
	Adres: 1,
	Matnr: "Y",
	Miktar: 150
}, {
	Adres: 2,
	Matnr: "Y",
	Miktar: 100
}, {
	Adres: 2,
	Matnr: "Z",
	Miktar: 10
}, {
	Adres: 3,
	Matnr: "Z",
	Miktar: 25
}];

let xData = aData.reduce(function (acc, val) {
	let o = acc.filter(function (obj) {
		return obj.Adres == val.Adres && obj.Matnr == val.Matnr;
	}).pop() || {
		Adres: val.Adres,
		Matnr: val.Matnr,
		Miktar: 0
	};
	o.Miktar += val.Miktar;
	acc.push(o);
	return acc;
}, []);

let oData = xData.map(item => {
	return {
		Adres: item.Adres,
		Matnr: item.Matnr,
		Miktar: item.Miktar
	};
}).filter((v, i, a) => a.findIndex(t => (t.Adres === v.Adres) && (t.Matnr === v.Matnr)) === i);