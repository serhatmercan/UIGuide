sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		setRequestMessages: function (that, sMessage, oError) {

			sap.ui.getCore().getMessageManager().removeAllMessages();

			var aMessages = [];

			if (oError) {
				var aError = JSON.parse(oError.responseText).error.innererror.errordetails;

				for (var i in aError) {
					aMessages.push(new sap.ui.core.message.Message({
						code: aError[i].code,
						message: aError[i].message,
						type: sap.ui.core.MessageType.Error,
						processor: that.getModel(),
						technical: true
					}));
				}
			} else {
				aMessages.push(new sap.ui.core.message.Message({
					message: that.getResourceBundle().getText(sMessage),
					type: sap.ui.core.MessageType.Error,
					processor: that.getModel(),
					technical: true
				}));
			}

			sap.ui.getCore().getMessageManager().addMessages(aMessages);
			sap.m.MessageToast.show(that.getResourceBundle().getText("errorOccurred"));

		}

	});

});