// Go To The ... Page
this.getRouter().navTo("viewName"); // manifest/sap.ui5/routing/targets/viewName

// Go To The ... Page w/ Extra
this.getRouter().navTo("viewName", {}, true);

// Go To The ... Page w/ Parameter
this.getRouter().navTo("viewNameValue", { // manifest/sap.ui5/routing/targets/viewNameValue
	id: oEvent.getSource().getBindingContext("model").getProperty("Id") // "manifest/sap.ui5/routing/routes/pattern/..."
});

// Go To The ... Page w/ Parameters Which Are Null Or Not
this.getRouter().navTo("manifest/sap.ui5/routing/targets/...", { // manifest/sap.ui5/routing/targets/viewNameValueNull
	id: oEvent.getSource().getBindingContext("model").getProperty("Id"), // "manifest/sap.ui5/routing/routes/pattern/..."
	null: oEvent.getSource().getBindingContext("model").getProperty("Null"), // "manifest/sap.ui5/routing/routes/pattern/..."
	value: oEvent.getSource().getBindingContext("model").getProperty("Value") // "manifest/sap.ui5/routing/routes/pattern/..."
});

// Go To The Not Found Page
this.getRouter().getTargets().display("objectNotFound");

// Go To Launchpad - 1
var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

this.oCrossAppNavigator.toExternal({
	target: {
		semanticObject: "#"
	}
});

// Go To Launchpad - 2
var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

this.oCrossAppNavigator.toExternal({
	target: {
		shellHash: "#Shell-home"
	}
});