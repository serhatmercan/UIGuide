sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oViewModel = new JSONModel({
				Value: new Date()
			});

			this.setModel(oViewModel, "model");

			const sPath = this.getView()?.getBindingContext()?.getPath();
			const oTime = new Date().getTime();

			oViewModel.setProperty(`${sPath}/Value`, {
				__edmType: "Edm.Time",
				ms: oTime
			});
		}

	});
});