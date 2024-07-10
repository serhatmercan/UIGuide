sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Image",
	"sap/ui/model/json/JSONModel"
], (BaseController, Image, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Items: ["../assets/PartQueryCockpit.png"],
				Value: ""
			});
			this.setModel(oModel, "model");
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGenerateCarousel() {
			const oCarousel = this.byId("Carousel");
			const aItems = this.getModel("model").getProperty("/Items");

			aItems.forEach((sItem) => {
				oCarousel.addPage(new Image({ src: sItem }));
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() {
			this.onGenerateCarousel();

			setInterval(() => this.byId("Carousel").next(), 5000);
		}

	});

});
