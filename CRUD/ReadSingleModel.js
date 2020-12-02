// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Search
var oModel = this.getModel("model"),
	sKey,
	oParams = {};

if (oModel.getProperty("/Key") === "") {
	return;
}

sKey = oModel.getProperty("/Key");

oParams.success = function (oSuccess) {
	oModel.setProperty("/", oSuccess);
}.bind(this);

oParams.error = function (oError) {

}.bind(this);

this.getModel().read("/ReadSet('" + sKey + "')", oParams);

// EXTRA //
// w/ More Than One Key 
sKey = this.getModel().createKey("ReadSet", {
	Key: oModel.getProperty("/Key"),
	Value: oModel.getProperty("/Value")
});

this.getModel().read("/" + sKey, oParams);

// NEW 
sPath = "/ReadSet(" + "Key='" + sKey + "'," + "Item='" + sItem + "'," + "No='" + sNo + "'" + ")";

this.getView().getModel().read(sPath, {
	success: (oData) => {
		oModel.setProperty("/", oData);
	},
	error: () => {
		// 
	}
});