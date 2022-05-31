sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
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

			this.onGenerateSlideTile();
		},

		onGenerateSlideTile: function () {
			const oSlideTile = this.byId("SlideTile");

			this.getModel("model").getProperty("/Items").forEach(oItem => {
				let oTC = new sap.m.TileContent({});

				oTC.setContent(new sap.m.ImageContent({
					src: oItem.Logo
				}));

				let oGT = new sap.m.GenericTile({
					header: oItem.Title,
					subheader: oItem.Description,
					press: () => window.open(oItem.URL, "_blank")
				});

				oGT.addTileContent(oTC);

				oSlideTile.addTile(oGT);
			});
		},

	});

});