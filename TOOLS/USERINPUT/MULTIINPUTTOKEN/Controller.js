/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"com/serhatmercan/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter: formatter,

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Value: "",
				List: []
			});

			this.setModel(oModel, "model");

			this.byId("MI").setValueState("Error");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCancelSD: function () {
			this.oDialog.destroy();
			this.oDialog = null;
		},	

		onCancelTSD: function () {
			this.oDialog.destroy();
			this.oDialog = null;
		},

		onChange: function (oEvent) {
			const sValue = oEvent.getParameter("newValue");
			const sPath = oEvent.getSource().getBindingInfo("tokens").path;
			const sModel = oEvent.getSource().getBindingInfo("tokens").model;
			const sKeyField = oEvent.getSource().getBindingInfo("tokens").template.getBindingInfo("key").parts[0].path;
			const aList = this.getModel(sModel).getProperty(sPath);
			const oObj = {};

			oObj[sKeyField] = formatter.validField(sValue) ? formatter.padLeft(sValue, oEvent.getSource().getMaxLength()) : sValue.toUpperCase();
			
			aList.push(oObj);
			
			this.getModel(sModel).setProperty(sPath, aList);
			
			oEvent.getSource().setValue("");
		},

		onConfirmSD: function () {
			this.getModel("model").setProperty("/List", oEvent.getParameter("selectedItems").map(oItem => {
				return {
					ID: oItem.getTitle(),
					Value: oItem.getDescription()
				};
			}));

			this.onCancelSD();
		},

		onConfirmTSD: function (oEvent) {
			const oModel = this.getModel();
			const aItems = [];

			oEvent.getParameter("selectedContexts").forEach(oContext => {
				aItems.push(oModel.getProperty(oContext.getPath()));
			});

			this.getModel("viewModel").setProperty("/List", aItems);
			
			this.onCancelTSD();
		},

		onSearchSD: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([
				new Filter("ID", FilterOperator.Contains, oEvent.getParameter("value"))
			]);
		},

		onSearchTSD: function (oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, sValue.toUpperCase())
			];

			sap.ui.getCore().byId(oEvent.getSource().getId()).getBinding("items").filter(aFilters, "Application");
		},

		onTC: function (oEvent) {
			if (oEvent.getParameter("type") === "removed") {
				const oToken = oEvent.getParameter("token");
				const sKey = oToken.getProperty("key");
				const sKeyField = oToken.getBindingInfo("key").parts[0].path;
				const aParts = oToken.getBindingInfo("key").binding.getContext().getPath().split("/");
				const sPath = "/" + aParts[1];
				const oModel = this.getModel("model");
				const sIndex = oModel.getProperty(sPath).map((oData) => {
					return oData[sKeyField];		
				}).indexOf(sKey);

				oModel.getProperty(sPath).splice(sIndex, 1);
				oModel.setProperty(sPath, oModel.getProperty(sPath));
			}
		},

		onTU: function (oEvent) {
			const oSource = oEvent.getSource();
			const iDeletedTokenRow = oSource.getParent().getIndex();
			const aTokens = oSource.getTokens();
			const aRemovedTokens = oEvent.getParameters("removedTokens").removedTokens;
			const oModel = this.getModel("model");

			oModel.setProperty("/List", oModel.getProperty("/List").filter(oToken => oToken.ID !== oEvent.getParameter("removedTokens")[0].getKey()));
		},

		onVHR: function (oEvent) {
			this.oDialog = sap.ui.xmlfragment("com.serhatmercan.Fragment", this);
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});