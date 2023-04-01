sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					ChartType: "",
					ChartVisible: false,
					Items: [],
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onInitSFB: function (oEvent) {
			oEvent.getSource().setFilterContainerWidth("15rem");
		},

		onSearchSFB: function (oEvent) {
			const oFilterData = oEvent.getSource().getFilterData();

			if (oFilterData) {
				this.getModel("model").setProperty("/ChartType", oFilterData.Tgrup);
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			this.setChartProperties("SmartChart");
		},

		setChartProperties: function (sID) {
			const oSmartChart = this.byId(sID);

			oSmartChart.getToolbar().getContent().find(oItem => oItem.getId().includes("btnNavigation")).setVisible(false);

			oSmartChart.attachInitialized(() => {
				oSmartChart.getChartAsync().then((oInnerChartEvent) => {
					oInnerChartEvent.setVizProperties({
						plotArea: {
							dataLabel: {
								visible: true
							},
							title: {
								visible: false
							}
						}
					});
				});
			});

			oSmartChart.attachDataReceived(() => {
				this.getModel("model").setProperty("/ChartVisible", true);
			});
		}

	});

});