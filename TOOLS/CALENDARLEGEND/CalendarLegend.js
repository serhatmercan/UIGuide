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
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		async onShowExplanations(oEvent) {
			if (!this.oCalendarLegend) {
				this.oCalendarLegend = await this.loadFragment({
					name: "com.serhatmercan.view.fragments.CalendarLegend",
					controller: this
				});

				this.getView().addDependent(this.oCalendarLegend);
			}

			if (this.oCalendarLegend.isOpen()) {
				this.oCalendarLegend.close();
			} else {
				this.oCalendarLegend.openBy(oEvent.getSource());
			}

			this.oCalendarLegend.openBy(oEvent.getSource());
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});
});