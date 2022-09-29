sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Filter, FilterOperator, JSONModel) {
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

			this.byId("VizFrame").attachRenderComplete((oEvent) => {
				const oDOMElement = oEvent.getSource().getDomRef();
				const aTitles = oDOMElement ? oDOMElement.querySelectorAll("title") : [];
				const oElement = oDOMElement ? oDOMElement.getElementsByClassName("ui5-viz-controls-viz-description")[0] : null;

				if (aTitles.length > 0) {
					aTitles[0].remove();
				}

				if (oElement && oElement.textContent === "No data") {
					oElement.textContent = "No Data";
				}

				if (oDOMElement.getElementsByClassName("v-m-legendGroup").length > 0) {
					oDOMElement.getElementsByClassName("v-m-legendGroup")[0].ontouchmove = (oEvt) => {
						e.preventDefault();
					};
				}
			});

			this.byId("VizFrame").attachSelectData((oEvent) => {
				const sPath = oEvent.getSource().getAggregation("dataset").getBindingPath("data");
				const aChartData = this.getModel("model").getProperty(sPath);
				const aSelectedData = oEvent.getParameter("data");
				const sProperty = oEvent.getSource().getAggregation("dataset").getAggregation("dimensions")[0].getName();
				const sData = aSelectedData[0].data[sProperty];
			});
		},

		onDeselectData: function (oEvent) {

		},

		onSelectData: function (oEvent) {
			const sID = oEvent.getSource().getId();
			const oSource = this.byId(sID);
			const oElement = document.getElementById(this.createId(sID));
			const aSelected = oElement.getElementsByClassName("v-datapoint-selected");
			const oFeed = oSource.getAggregation("feeds").find(xFeed => xFeed.getProperty("uid") === "color");
			const sKey = oFeed.getProperty("values")[0];
			const sPath = oSource.getAggregation("dataset").getBindingPath("data");
			const aChartData = this.getModel("model").getProperty(sPath);
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, aSelected[0].ID)
			];

			this.byId("VizFrame").getDataset().getBinding("data").filter(aFilters);
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
			const oViewModel = this.getModel("model");
			const aChart = [];
			const oChart = {
				Brgew: 250,
				BrgewMt: 500,
				ID: 1
			};

			aChart.push(oChart);
			oViewModel.setProperty("/Chart", oChart);
		}

	});

});