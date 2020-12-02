sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		showMessage: function () {

			MessageToast.show("Message");
			
			MessageToast.show(this.getResourceBundle("Message"));    // i18n > Message
			
			MessageToast.show(this.getResourceBundle("Message", 1907)); // i18n > Message {0}
			
			MessageToast.show(this.getResourceBundle("Message"), {
				duration: 5000,						// Show Message Duration ... MSEC
				closeOnBrowserNavigation: false		// Show Message Despite Page Change 
			});
			
		}

	});

});