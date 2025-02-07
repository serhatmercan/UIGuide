sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast"
], (BaseController, MessageToast) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		showMessage() {
			MessageToast.show("Message");

			MessageToast.show(this.getText("Message")); // i18n > Message

			MessageToast.show(this.getText("Message", 1907)); // i18n > Message {0}

			MessageToast.show(this.getText("Message", [iValueI, iValueII])); // i18n > Message {0} {1}

			MessageToast.show(this.getText("Message"), {
				at: "center top",				// Message Position of View
				duration: 5000, 				// Show Message Duration ... MSEC
				closeOnBrowserNavigation: false // Show Message Despite Page Change 
			});

		}

	});

});