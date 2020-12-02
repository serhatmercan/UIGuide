sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		_onObjectMatched: function(oEvent) { 
			var sId = oEvent.getParameter("arguments").id;
		} 

	});

});