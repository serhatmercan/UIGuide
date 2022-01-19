sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Nodes: [{
						ID: "0",
						Lane: "0",
						Children: [1],
						Company: "SPRO Technology",
						Date: "July 2018 - August 2018",
						Photo: jQuery.sap.getModulePath("com.sm.CV.assets") + "/Spro.png",
						Position: "Intern",
						Role: "SAP ABAP Developer"
					}, {
						ID: "1",
						Lane: "1",
						Children: [2],
						Company: "SPRO Technology",
						Date: "September 2018 - February 2020",
						Photo: jQuery.sap.getModulePath("com.sm.CV.assets") + "/Spro.png",
						Position: "SAP Developer",
						Role: "SAP Full-Stack Developer"
					}],
					Lanes: [{
						ID: "0",
						Position: 0,
						Icon: "sap-icon://employee",
						Date: "July '18 - Aug '18"
					}, {
						ID: "1",
						Position: 1,
						Icon: "sap-icon://employee",
						Date: "Sept '18 - Febr '20"
					}]
				}), "model"
			);
		}

	});

});