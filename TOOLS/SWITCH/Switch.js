sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oViewModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		onChange: function (oEvent) {
			const bState = oEvent.getParameter("state");
			const oSelectedObject = oEvent.getSource().getBindingContext().getObject();
			const sPath = oEvent.getSource().getBindingContext().getPath();

			this.getModel("model").setProperty(sPath + "/Value", bState);
		}

	});

});