// Delete
var oItem = oEvent.getParameter("item").getBindingContext().getObject(),
	sKey,
	oParams = {};

if (!oItem) {
	return;
}

sKey = oItem.Key;

oParams.error = function (oError) {

}.bind(this);

oParams.success = function (oSuccess) {

}.bind(this);

this.getModel().remove("/DeleteSet('" + sKey + "')", oParams);

// EXTRA //
// w/ More Than One Key
var oKey = this.getModel().createKey("DeleteSet", {
	Key: oItem.Key,
	Value: oItem.Value
});

this.getModel().remove("/" + oKey, oParams);