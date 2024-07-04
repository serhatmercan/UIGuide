sap.ui.define([
	"com/serhatmercan/controller/BaseController",
<<<<<<< HEAD
	"sap/m/MessageToast"
], function (BaseController, MessageToast) {
=======
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		showMessage: function () {
<<<<<<< HEAD
			MessageToast.show("Message");

			MessageToast.show(this.getText("Message")); // i18n > Message

			MessageToast.show(this.getText("Message", 1907)); // i18n > Message {0}

			MessageToast.show(this.getText("Message", [iValueI, iValueII])); // i18n > Message {0} {1}

			MessageToast.show(this.getText("Message"), {
=======
			const oResourceBundle = this.getResourceBundle();			

			MessageToast.show("Message");

			MessageToast.show(this.getResourceBundle().getText("Message")); // i18n > Message

			MessageToast.show(this.getResourceBundle().getText("Message", 1907)); // i18n > Message {0}

			MessageToast.show(this.getResourceBundle().getText("Message"), {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				duration: 5000, // Show Message Duration ... MSEC
				closeOnBrowserNavigation: false // Show Message Despite Page Change 
			});

		}

	});

});