sap.ui.controller("com.serhatmercan.ext.controller.ObjectPageExt", {

	onGoToExternalPage(oEvent) {
		const oService = sap.ushell.Container.getService("CrossApplicationNavigation");
		const sID = oEvent.getSource().getBindingContext().getProperty("ID");

		oService.toExternal({
			target: {
				semanticObject: "SM_FIORI_APP",
				action: "display"
			},
			params: { sID }
		});
	}

});