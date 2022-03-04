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

			this._setVizProperties();
		},

		_setVizProperties: function () {
			const oVizFrame = this.byId("idVizFrame");
			const oPopOver = this.getView().byId("idPopOver");

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

		_getTotalChartData: function () {
			const oModel = this.getModel("model");
			const aChart = [];
			const oChart = {
				Ntgew: 100,
				Brgew: 250,
				BrgewMt: 500,
				PartiId: 1
			};

			aChart.push(oChart);
			oModel.setProperty("/Chart", oChart);
		},

	});

});