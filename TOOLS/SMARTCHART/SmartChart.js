sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				ChartType: "",
				ChartVisible: false,
				Items: [],
				Value: ""
			});
			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onInitSFB(oEvent) {
			oEvent.setFilterContainerWidth("15rem");
		},

		onSearchSFB() {
			const oFilterData = oEvent.getSource().getFilterData();

			if (oFilterData) {
				this.getModel("model").setProperty("/ChartType", oFilterData.Tgrup);
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setChartProperties(sID) {
			const oSmartChart = this.byId(sID);
			const aSCContents = oSmartChart?.getToolbar()?.getContent();

			aSCContents?.find(oItem => oItem.getId()?.includes("btnNavigation"))?.setVisible(false);

			oSmartChart.attachInitialized(() => {
				oSmartChart.getChartAsync()?.then(oInnerChartEvent => {
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
		},

		patternMatched() {
			this.setChartProperties("SmartChart");
		}

	});

});