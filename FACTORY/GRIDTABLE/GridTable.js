sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Columns: [],
					Rows: [],
					Value: ""
				}), "model"
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
						model: "model",
						path: oContext.getProperty("valuePath")
					},
					editable: false
				}),
				autoResizable: true,
				hAlign: sap.ui.core.TextAlign.Center,
				minWidth: 100				
			});
		}

	});

});