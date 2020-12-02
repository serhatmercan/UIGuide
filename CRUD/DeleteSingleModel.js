// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Delete
var oModel = this.getModel("model"),
	sKey,
	oParams = {};

if (oModel.getProperty("/Key") === "") {
	return;
}

sKey = oModel.getProperty("/Key");

oParams.success = function (oSuccess) {

}.bind(this);

oParams.error = function (oError) {

}.bind(this);

this.getModel().remove("/DeleteSet('" + sKey + "')", oParams);

// EXTRA //
// w/ More Than One Key 
var oKey = this.getModel().createKey("ReadSet", {
	Key: oModel.getProperty("/Key"),
	Value: oModel.getProperty("/Value")
});

this.getModel().remove("/" + oKey, oParams);