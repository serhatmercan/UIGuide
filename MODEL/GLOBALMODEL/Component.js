sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";
	return UIComponent.extend("com.serhatmercan.Component", {
		init: function () {
			this.setModel(Models.createGlobalModel(), "globalModel"); // Add
		}
	});
});