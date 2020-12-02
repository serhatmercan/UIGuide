// From Model
var sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
// From Input Model
var sPath = oEvent.getSource().getBindingInfo("value").binding.getPath();
// From View
var oView = this.getView(),
	sBindingPath = oView.getBindingContext().getPath(),
	sData = oView.getModel().getProperty(sPath + "/Data");
// Get Binding Data From View
var oObject = this.getView().getBindingContext().getObject();