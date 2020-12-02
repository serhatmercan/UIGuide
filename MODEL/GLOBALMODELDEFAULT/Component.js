sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";
	return UIComponent.extend("com.serhatmercan.Component", {
		init: function () {
			this.setModel(Models.createGlobalModel(), "globalModel");
			this.getDefaultData();
		},

		getDefaultData: function () {
			this.getModel().metadataLoaded().then(function () {
				
				var sUsername = sap.ushell.Container.getUser().getId(),
					oGlobalModel = this.getModel("globalModel"),
					oParams = {};
					
				oParams.success = function (oSuccess) {
					oGlobalModel.setProperty("/GlobalObject", oSuccess);
				}.bind(this);
				
				this.getModel().read("/UserDefaultsSet('" + sUsername + "')", oParams);
				
			}.bind(this));
		}

	});
});