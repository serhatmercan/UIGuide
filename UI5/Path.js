// From Binding Data
var oObject = this.getView().getBindingContext().getObject();
// From Input Model
var sPath = oEvent.getSource().getBindingInfo("value").binding.getPath();
// From Model
var sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
// From View
var oView = this.getView();
var sBindingPath = oView.getBindingContext().getPath();
var sData = oView.getModel().getProperty(sPath + "/Data");