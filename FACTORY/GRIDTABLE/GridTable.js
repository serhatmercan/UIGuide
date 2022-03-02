sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Columns: [],
					Rows: [],
					Value: ""
				}), "viewModel"
			);
		},

		onGenerateColumns: function (sId, oContext) {
			return new sap.ui.table.Column({
				label: new sap.m.Label({
					text: oContext.getProperty("label"),
					design: sap.m.LabelDesign.Bold
				}),
				template: new sap.m.Text({
					text: {
						model: "viewModel",
						path: oContext.getProperty("valuePath")
					},
					editable: false
				}),
				autoResizable: true,
				minWidth: 100,
				hAlign: sap.ui.core.TextAlign.Center
			});
		}

	});

});