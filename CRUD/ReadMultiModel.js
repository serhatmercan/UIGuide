// Init
var oTableModel = new JSONModel({
	Key: "",
	Value: "",
	Date: ""
});

this.setModel(oTableModel, "tableModel");

var oSearchModel = new JSONModel({
	Key: "",
	Keys: [],
	Value: "",
	Date1: "",
	Date2: ""
});

this.setModel(oSearchModel, "searchModel");

// Search
var oSearchModel = this.getModel("searchModel"),
	aFilters = [],
	oParams = {};

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

oParams.filters = aFilters;

oParams.success = function (oSuccess) {

	var oTableModel = new JSONModel();

	oTableModel.setData(oSuccess.results);

	this.getView().setModel(oTableModel, "tableModel");

}.bind(this);

oParams.error = function (oError) {

}.bind(this);

this.getModel().read("/ReadSet", oParams);

// EXTRA //

// Contains
aFilters.push(new Filter("Key", FilterOperator.Contains, oSearchModel.getProperty("/Key")));

// Set Size Limit 
oTableModel.setSizeLimit(5000);


