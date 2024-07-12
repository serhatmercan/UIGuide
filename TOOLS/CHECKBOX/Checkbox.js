sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oViewModel = new JSONModel({ Value: "" });
			this.setModel(oViewModel, "model");
		},

		onSelectCB(oEvent) {
			const sValue = oEvent.getSource().getSelected();
		},

		getValue() {
			const sValue = this.byId("CheckBox").getSelected();
			return sValue;
		}

	});
});