sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Items: [],
					Value: ""
				}), "model"
			);

			this.onGenerateCarousel();
		},

		onGenerateCarousel: function () {
			const oCarousel = this.byId("Carousel");

			this.getModel("model").getProperty("/Items").forEach(oItem => {
				oCarousel.addPage(new sap.m.Image({
					src: oItem
				}));
			});
		}

	});

});