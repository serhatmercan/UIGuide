sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onPress: function (oEvent) {
			const oData = oEvent.getSource().getBindingContext().getObject();
			const sID = oData.ID;
			const sURL = this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/Url");

			if (!sURL || sURL === "") {
				MessageToast.show(this.getText("checkURL"));
				return;
			}

			window.open(sURL, "_blank");
		}

	});

});