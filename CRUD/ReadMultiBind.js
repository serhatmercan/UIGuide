// Init
var oSearchModel = new JSONModel({
	Key: "",
	Keys: [],
	Value: "",
	Date1: "",
	Date2: ""
});

this.setModel(oSearchModel, "searchModel");

// Search
var oTable = this.byId("table"),
	oSearchModel = this.getModel("searchModel"),
	aFilters = [];

if (oSearchModel.getProperty("/Keys").length !== 0) {

	aKeys = oSearchModel.getProperty("/Keys");

	for (var i = 0; i < aKeys.length; i++) {
		aFilters.push(new Filter("Key", FilterOperator.EQ, aKeys[i].Key));
	}

} else if (oSearchModel.getProperty("/Key")) {
	aFilters.push(new Filter("Key", FilterOperator.EQ, oSearchModel.getProperty("/Key")));
}

if (oSearchModel.getProperty("/Value")) {
	aFilters.push(new Filter("Value", FilterOperator.EQ, oSearchModel.getProperty("/Value")));
}

if (oSearchModel.getProperty("/Date1") && oSearchModel.getProperty("/Date2")) {
	aFilters.push(new Filter("Date", FilterOperator.BT,
		this.getLocaleDate(oSearchModel.getProperty("/Date1")),
		this.getLocaleDate(oSearchModel.getProperty("/Date2"))));
}

oTable.getBinding("rows").filter(aFilters);  // sap.ui.table
oTable.getBinding("items").filter(aFilters); // sap.m.table