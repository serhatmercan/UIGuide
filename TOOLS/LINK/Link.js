sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onPress(oEvent) {
			const { ID: sID } = oEvent.getSource().getBindingContext().getObject();
			const sPath = this.getView().getBindingContext()?.getPath();
			const sURL = this.getModel().getProperty(`${sPath}/Url`);

			if (!sURL) {
				MessageToast.show(this.getText("checkURL"));
				return;
			}

			window.open(sURL, "_blank");
		}

	});

});