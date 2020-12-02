// Create Multi Data From Binding Table

// Create Function
var aContext = this.getView().byId("table").getSelectedContexts();

if (aContext.length < 1) {
	return;
}

var oData = {},
	oParams = {};

oParams.error = function (oError) {

}.bind(this);

oParams.success = function (oSuccess) {

}.bind(this);

oData.Values = [];

// 1- Add All Data to Array 
for (var i in aContext) {
	var oValue = jQuery.extend(true, {}, aContext[i].getObject());
	delete oValue.__metadata;
	oData.Values.push(oValue);
}

this.getModel().create("/DataSet", oData, oParams);

// EXTRA //

// 2- Add Extra Data 
for (var i in aContext) {
	var oValue = jQuery.extend(true, {}, aContext[i].getObject());
	delete oValue.__metadata;

	oData.Values.push({
		Key: oValue.Key,
		Value: oValue.Value,
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