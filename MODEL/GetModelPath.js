// From Model
let sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
// From Input Model
let sValuePath = oEvent.getSource().getBindingInfo("value").binding.getPath();
// From View
let oView = this.getView(),
	sBindingPath = oView.getBindingContext().getPath(),
	sData = oView.getModel().getProperty(sPath + "/Data");
// Get Binding Data From View
let oObject = this.getView().getBindingContext().getObject();