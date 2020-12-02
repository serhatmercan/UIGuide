// Create Multiple Data From Model

// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Create Function
var aData = this.getModel("model").getData(),
	oData = {},
	oParams = {};

if (aData.length < 1) {
	return;
}

oParams.error = function (oError) {

}.bind(this);

oParams.success = function (oSuccess) {

}.bind(this);

oData.Values = [];

// 1- Add All Data to Array 
for (var i = 0; i < aData.length; i++) {
	oData.Values.push(aData[i]);
}

this.getModel().create("/DataSet", oData, oParams);

// EXTRA //

// Clear Cache => Single
var oData = jQuery.extend(true, {}, this.getView().getModel("model").getData());

// 2- Add Extra Data
for (i = 0; i < aData.length; i++) {
	oData.Values.push({
		Key: aData[i].Key,
		Value: aData[i].Value,
		Note: "Extra"
	});
}

// w/ Return Message
oData.Return = [];

oParams.success = function (oSuccess) {

	if (oSuccess.Return.results.length > 0) {
		MessageToast.show(oSuccess.Return.results[0].Message, {
			duration: 5000
		});
	}

}.bind(this);