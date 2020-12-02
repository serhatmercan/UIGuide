// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Add Data
var oModel = this.getModel("model"),
	sPath = oEvent.getSource().getBindingContext("model").sPath,
	sValue = 10;
	
oModel.setProperty(sPath + "/Value", sValue);