sap.ui.define([
		"com/controller/BaseController",
		"sap/ui/model/json/JSONModel"
	], function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("com.serhatmercan.controller.App", {

			onInit : function () {
				const oComponent = this.getOwnerComponent();

				const oModel = new JSONModel({
					Busy : true,
					Delay : 0
				});

				this.setModel(oModel, "model");

				const fnSetAppNotBusy = function() {
					oModel.setProperty("/Busy", false);
					oModel.setProperty("/Delay", this.getView().getBusyIndicatorDelay());
				};

				oComponent.getModel().metadataLoaded().then(fnSetAppNotBusy);

				oComponent.oListSelector.attachListSelectionChange((oEvent) => {
					this.byId("SplitApp").hideMaster();
				}); 
				
				this.getView().addStyleClass(oComponent.getContentDensityClass());
			}

		});

	}
);