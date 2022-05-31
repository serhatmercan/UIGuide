sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Chart: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			this.setVizProperties();
		},

		setVizProperties: function () {
			const oVizFrame = this.byId("VizFrame");
			const oPopOver = this.byId("PopOver");

			oVizFrame.setAutoAdjustHeight(true);
			oVizFrame.setShowFullScreen(true);

			oVizFrame.setVizProperties({
				title: {
					visible: false
				},
				dataLabel: {
					visible: true
				}
			});

			oPopOver.connect(oVizFrame.getVizUid());
		},

		getTotalChartData: function () {
			const oModel = this.getModel("model");
			const aChart = [];
			const oChart = {				
				Brgew: 250,
				BrgewMt: 500,
				ID: 1
			};

			aChart.push(oChart);
			oModel.setProperty("/Chart", oChart);
		}

	});

});