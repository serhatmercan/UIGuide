sap.ui.controller("com.ittr.pmm.equipmentlist.ext.controller.ObjectPageExt", {

	onGoToExternalPage: function (oEvent) {
		sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
			target: {
				semanticObject: "SM_FIORI_APP",
				action: "display"
			},
			params: {
				ID: oEvent.getSource().getBindingContext().getProperty("ID")
			}
		});
	}
});