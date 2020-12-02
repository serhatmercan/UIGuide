// Add Row in Table w/ Model

// Init
var oModel = new JSONModel({
	Key: "",
	Value: ""
});

this.setModel(oModel, "model");

// Add Function
var oModel = this.getView().byId("table").getModel("model"),
	aData = oModel.getData();

var sRow = {
	Key: "",
	Value: ""
};

aData.push(sRow);
oModel.setData(aData);

// Delete Function
var oModel = this.getView().byId("table").getModel("model"),
	aData = oModel.getData();

aData.pop();
oModel.setData(aData);