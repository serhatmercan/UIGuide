sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		onSelectCB: function(oEvent){
			const sValue = oEvent.getSource().getSelected();
		},

		getValue: function () {
			sValue = this.byId("CheckBox").getSelected();
		}

	});

});