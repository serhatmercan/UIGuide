/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		_onObjectMatched: function (oEvent) {
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		addDialog: function () {
			this._oDialog.setModel(this.getModel("messageModel"), "messageModel");
		},

		onShowMessages: function (oEvent) {
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment("com.serhatmercan.fragment.MessagePopover", this);
				oEvent.getSource().addDependent(this._oMessagePopover);
			}
			this._oMessagePopover.toggle(oEvent.getSource());
		},

		onACMessagePopover: function () {
			this._oMessagePopover.destroy();
			this._oMessagePopover = null;
		}

	});

});