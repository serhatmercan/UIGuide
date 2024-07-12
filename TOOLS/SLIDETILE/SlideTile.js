sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GenericTile",
	"sap/m/ImageContent",
	"sap/m/TileContent",
	"sap/ui/model/json/JSONModel"
], (BaseController, GenericTile, ImageContent, TileContent, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});
			this.setModel(oModel, "model");
			this.onGenerateSlideTile();
		},

		onGenerateSlideTile() {
			const oSlideTile = this.byId("SlideTile");
			const aItems = this.getModel("model").getProperty("/Items");

			aItems.forEach(oItem => {
				const oTileContent = new TileContent({
					content: new ImageContent({
						src: oItem.Logo
					})
				});

				const oGenericTile = new GenericTile({
					header: oItem.Title,
					subheader: oItem.Description,
					press: () => window.open(oItem.URL, "_blank")
				});

				oGenericTile.addTileContent(oTileContent);
				oSlideTile.addTile(oGenericTile);
			});
		}

	});
});