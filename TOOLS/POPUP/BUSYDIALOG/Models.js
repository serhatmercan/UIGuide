sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		
		createGlobalModel: function () {
			
			var oGlobalModel = new JSONModel({
				GlobalBusy: false
			});
			
			return oGlobalModel;
			
		}
	
	};
});