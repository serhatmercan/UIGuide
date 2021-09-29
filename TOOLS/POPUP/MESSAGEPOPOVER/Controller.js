/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		addDialog: function () {
			this._oDialog.setModel(this.getModel("message"), "message");
		},

		onCheckMessages: function () {
			const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

			aMessages.forEach(oMessage => oMessage.setPersistent(true));

			if (aMessages.some(oMessage => oMessage.type === "Error")) {
				MessageToast.show(oResourceBundle.getText("errorOccured"));
			} else {}
		},

		onClearMessages: function () {
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		onShowMessages: function () {
			const oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});

				oMessagesButton.addDependent(this._oMessagePopover);
			}

			this._oMessagePopover.toggle(oMessagesButton);
		},

		_onViewMatched: function () {
			this.onClearMessages();
		}

	});

});