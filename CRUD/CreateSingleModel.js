// Create Single Data From Model

// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Create Function
var oModel = this.getModel("model"),
	oData = {},
	oParams = {};

if (oModel.getProperty("/Key") === "") {
	return;
}

oData.Key = oModel.getProperty("/Key");
oData.Value = oModel.getProperty("/Value");

oParams.error = function (oError) {

}.bind(this);

oParams.success = function (oSuccess) {

}.bind(this);

this.getModel().create("/DataSet", oData, oParams);