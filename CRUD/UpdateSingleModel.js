// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Update
var oModel = this.getModel("model"),
	sKey,
	oData = {},
	oParams = {};

if (oModel.getProperty("/Key") === "") {
	return;
}

sKey = oModel.getProperty("/Key");

oData.Key = "Serhat";
oData.Value = 1;

oParams.success = function (oSuccess) {

}.bind(this);

oParams.error = function (oError) {

}.bind(this);

this.getModel().update("/UpdateSet('" + sKey + "')", oData, oParams);

// EXTRA //
// w/ More Than One Key 
var oKey = this.getModel().createKey("ReadSet", {
	Key: oModel.getProperty("/Key"),
	Value: oModel.getProperty("/Value")
});

this.getModel().update("/" + oKey, oData, oParams);