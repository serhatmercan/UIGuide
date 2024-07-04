sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Image",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Image, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: [
						"../assets/PartQueryCockpit.png"
					],
					Value: ""
				}), "model"
			);

			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGenerateCarousel: function () {
			const oCarousel = this.byId("Carousel");

			this.getModel("model").getProperty("/Items").forEach(oItem => {
				oCarousel.addPage(new Image({
					src: oItem
				}));
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function () {
			this.onGenerateCarousel();

			setInterval(() => {
				this.byId("Carousel").next();
			}, 5000);
		}

	});

});