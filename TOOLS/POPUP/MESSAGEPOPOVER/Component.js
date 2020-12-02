sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";
	return UIComponent.extend("com.serhatmercan.Component", {
		init: function () {
			// Set the Message Model 
			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "messageModel");
		}
	});
});