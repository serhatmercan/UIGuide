sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onPress: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.serhatmercan.Fragment", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},

		onConfirm: function (oEvent) {
			var oTable = this.byId("table"),
				oParams = oEvent.getParameters(),
				oItems = oTable.getBinding("items"),
				sPath = oParams.sortItem.getKey(),
				sDescending = oParams.sortDescending,
				aSorters = [];

			aSorters.push(new Sorter(sPath, sDescending));
			oItems.sort(aSorters);
		}

	});

});