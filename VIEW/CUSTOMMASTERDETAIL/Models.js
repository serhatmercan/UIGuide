sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (JSONModel, Device, Button, Dialog, Text, Filter, FilterOperator) {
	"use strict";

	return {

		getPendingChangesDialog: function (that, fnConfirm, fnCancel) {
			this.approveDialog(that, "Message", "Warning", that.getResourceBundle().getText("warning"), that.getResourceBundle().getText(
				"lostEntries"), fnConfirm, fnCancel);
		},

		approveDialog: function (that, sType, sState, sTitle, sText, fnConfirm, fnCancel) {
			var oDialog = new Dialog({
				title: that.getResourceBundle().getText(sTitle),
				type: sType,
				state: sState || "None",
				content: new Text({
					text: that.getResourceBundle().getText(sText)
				}),
				beginButton: new Button({
					text: that.getResourceBundle().getText("ok"),
					press: function () {
						oDialog.close();
						fnConfirm();
					}.bind(that)
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("cancel"),
					press: function () {
						oDialog.close();
						if (fnCancel) {
							fnCancel();
						}
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}.bind(that)
			});
			oDialog.open();
		}

	};
});