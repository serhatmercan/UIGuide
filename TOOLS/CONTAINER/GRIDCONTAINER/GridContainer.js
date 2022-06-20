sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/f/dnd/GridDropInfo",
	"sap/ui/core/dnd/DragInfo"
], function (BaseController, JSONModel, GridDropInfo, DragInfo) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({					
					Items: [],
                    ItemSelected: false,
					Layout: "2-3-1",
					Layouts: [{
						"Key": "1",
						"ID": "GCI"
					}, {
						"Key": "2",
						"ID": "GCII"
					}, {
						"Key": "3",
						"ID": "GCIII"
					}],
					Value: ""
			}), "model");

			const oGC = this.byId("GC");

			oGC.addDragDropConfig(new DragInfo({
				sourceAggregation: "items"
			}));

			oGC.addDragDropConfig(new GridDropInfo({
				targetAggregation: "items",
				dropPosition: DropPosition.Between,
				dropLayout: DropLayout.Horizontal,
				drop: this.onDropGC.bind(this)
			}));

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

        /* ============== */
        /* Event Handlers */
        /* ============== */

		onDropGC: function (oInfo) {
			const oDragged = oInfo.getParameter("draggedControl");
			const oDropped = oInfo.getParameter("droppedControl");
			const sInsertPosition = oInfo.getParameter("dropPosition");
			const oGC = oDragged.getParent();
			let	iDragPosition = oGC.indexOfItem(oDragged);
			let	iDropPosition = oGC.indexOfItem(oDropped);

			oGC.removeItem(oDragged);

			if (iDragPosition < iDropPosition) {
				iDropPosition--;
			}

			if (sInsertPosition === "After") {
				iDropPosition++;
			}

			oGC.insertItem(oDragged, iDropPosition);
		},

        /* ================ */
        /* Internal Methods */
        /* ================ */
		
		generateGC: function(){
			const oModel = this.getModel("model");
			const aLayouts = oModel.getProperty("/Layouts");
			const sLayout = oModel.getProperty("/Layout");

			if (sLayout) {
				sLayout.split("-").forEach((sKey, iIndex) => {
					let oItem = aGCItems.find(aGCItem => aGCItem.getId().split("-")[aGCItem.getId().split("-").length - 1] ===
						aLayouts.find(oLayout => oLayout.Key === sKey).ID);

					oGC.removeItem(oItem);
					oGC.insertItem(oItem, iIndex);
				});
			}
		},

		saveLayout: function(){
			const oModel = this.getModel("model");
			const aKeys = [];
			const aLayouts = oModel.getProperty("/Layouts");
			let sLayout = "";

			this.byId("GC").getItems().forEach(oItem => {
				aKeys.push(aLayouts.find(oLayout => oLayout.ID === oItem.getId().split("-")[oItem.getId().split("-").length - 1]).Key);
			});

			sLayout = aKeys.join("-");

			oModel.setProperty("/Layout", sLayout);
		},

		patternMatched: function (oEvent) {
							
		}

    });

});