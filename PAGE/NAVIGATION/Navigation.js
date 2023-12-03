// Convert Parameters
encodeURIComponent("ID");
decodeURIComponent("ID");

// Go To Previous Page
history.go(-1);

// Go To The ... Page
this.getRouter().navTo("ViewName"); // manifest/sap.ui5/routing/targets/ViewName

// Go To The ... Page w/ Extra
this.getRouter().navTo("ViewName", {}, true);

// Go To The ... Page w/ Parameter
this.getRouter().navTo("ViewNameValue", { // manifest/sap.ui5/routing/targets/ViewNameValue
	id: oEvent.getSource().getBindingContext("model").getProperty("Id") // "manifest/sap.ui5/routing/routes/pattern/..."
});

// Go To The ... Page w/ Parameters Which Are Null Or Not
this.getRouter().navTo("manifest/sap.ui5/routing/targets/...", { // manifest/sap.ui5/routing/targets/ViewNameValueNull
	id: oEvent.getSource().getBindingContext("model").getProperty("Id"), // "manifest/sap.ui5/routing/routes/pattern/..."
	null: oEvent.getSource().getBindingContext("model").getProperty("Null"), // "manifest/sap.ui5/routing/routes/pattern/..."
	value: oEvent.getSource().getBindingContext("model").getProperty("Value") // "manifest/sap.ui5/routing/routes/pattern/..."
});

// Go To The Not Found Page
this.getRouter().getTargets().display("objectNotFound");

// Parameter Contains / Character
sValue.replace("/", "%%");

// Go To Launchpad - 1
"sap/m/MessageBox"
MessageBox

MessageBox.error(this.getResourceBundle().getText("checkAuthorization"), {
	actions: [MessageBox.Action.CLOSE],
	emphasizedAction: MessageBox.Action.CLOSE,
	onClose: () => {
		sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
			target: {
				semanticObject: "#"
			}
		});
	}
});
return;

// Go To Launchpad - 2
var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

this.oCrossAppNavigator.toExternal({
	target: {
		semanticObject: "#"
	}
});

// Go To Launchpad - 3
var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

this.oCrossAppNavigator.toExternal({
	target: {
		shellHash: "#Shell-home"
	}
});