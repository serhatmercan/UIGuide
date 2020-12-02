sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onFunction: function () {

			function onConfirmDialog() {
				// 
			}

			this.getConfirmDialog(this, "Message", "Warning", "Title", "Text", onConfirmDialog);

		},

		getConfirmDialog: function (that, sType, sState, sTitle, sText, fnConfirm) {
			var oDialog = new Dialog({
				title: that.getResourceBundle().getText(sTitle),
				type: sType,
				state: sState || "None",
				content: new Text({
					text: that.getResourceBundle().getText(sText)
				}),
				beginButton: new Button({
					text: that.getResourceBundle().getText("Ok"),
					press: function () {
						oDialog.close();
						fnConfirm();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("No"),
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
			oDialog.open();
		}

	});

});