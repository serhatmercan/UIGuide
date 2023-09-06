sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/data/MeasureDefinition"
], function (BaseController, Filter, FilterOperator, JSONModel, FeedItem, DimensionDefinition, FlattenedDataset, MeasureDefinition) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Chart: [],
				Data: [
					{
						"Count": 5,
						"Level": "L0",
						"Year": "2022"
					},
					{
						"Count": 10,
						"Level": "L1",
						"Year": "2022"
					},
					{
						"Count": 23,
						"Level": "L2",
						"Year": "2023"
					}
				],
				PieChart: [{
					Cause: "Salary",
					Value: 13
				}, {
					Cause: "Freelance",
					Value: 5
				}, {
					Cause: "Lack of Management",
					Value: 3
				}, {
					Cause: "Moving Abroad",
					Value: 5
				}, {
					Cause: "Performance",
					Value: 4
				}],
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

		onAfterRendering: function () {
			this.setPieVizProperties();
			this.setVizProperties();
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

		setPieVizProperties: function () {
			const oPieVizFrame = this.byId("PieVizFrame");
			const oFlattenedDataset = new FlattenedDataset({
				data: "{model>/PieChart}"
			});
			const oDimension = new DimensionDefinition({
				name: "Cause",
				value: "{model>Cause}"
			});
			const oMeasure = new MeasureDefinition({
				name: "Value",
				value: "{model>Value}"
			});
			const oFeedItemI = new FeedItem({
				uid: "size",
				type: "Measure",
				values: ["Value"]
			});
			const oFeedItemII = new FeedItem({
				uid: "color",
				type: "Dimension",
				values: ["Cause"]
			});

			oFlattenedDataset.addDimension(oDimension);
			oFlattenedDataset.addMeasure(oMeasure);

			oPieVizFrame.destroyDataset();
			oPieVizFrame.destroyFeeds();
			oPieVizFrame.setVizProperties({
				legend: {
					title: {
						visible: false
					}
				},
				plotArea: {
					dataLabel: {
						visible: true
					}
				},
				title: {
					visible: false
				}
			});
			oPieVizFrame.setModel(this.getModel("model"));
			oPieVizFrame.setDataset(oFlattenedDataset);
			oPieVizFrame.addFeed(oFeedItemI);
			oPieVizFrame.addFeed(oFeedItemII);
		},

		setVizProperties: function () {
			const oVizFrame = this.byId("VizFrame");
			const oPopover = this.byId("Popover");

			oVizFrame.setAutoAdjustHeight(true);
			oVizFrame.setShowFullScreen(true);

			oVizFrame.setVizProperties({
				dataLabel: {
					visible: true
				},
				plotArea: {
					dataPointStyle: {
						"rules": [
							{
								"dataContext": {
									"Year": "2022"
								},
								"displayName": "2022",
								"properties": {
									"color": "#e76500"
								}
							},
							{
								"dataContext": {
									"Year": "2023"
								},
								"displayName": "2023",
								"properties": {
									"color": "#1b90ff"
								}
							}
						]
					}
				},
				title: {
					text: "Organization",
					visible: true
				}
			});

			oPopover.connect(oVizFrame.getVizUid());
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