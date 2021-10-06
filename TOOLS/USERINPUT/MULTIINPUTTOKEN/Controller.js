/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"com/serhatmercan/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter: formatter,

		onInit: function () {

			var oModel = new JSONModel({
				Value: "",
				List: []
			});

			this.setModel(oModel, "model");

		},

		onChange: function (oEvent) {
			var sValue = oEvent.getParameter("newValue"),
				sPath = oEvent.getSource().getBindingInfo("tokens").path,
				sModel = oEvent.getSource().getBindingInfo("tokens").model,
				sKeyField = oEvent.getSource().getBindingInfo("tokens").template.getBindingInfo("key").parts[0].path,
				aList = this.getModel(sModel).getProperty(sPath),
				oObj = {};

			oObj[sKeyField] = formatter.validField(sValue) ? formatter.padLeft(sValue, oEvent.getSource().getMaxLength()) : sValue.toUpperCase();
			aList.push(oObj);
			this.getModel(sModel).setProperty(sPath, aList);
			oEvent.getSource().setValue("");
		},

		onTokenChange: function (oEvent) {

			if (oEvent.getParameter("type") === "removed") {

				var oToken = oEvent.getParameter("token"),
					sKey = oToken.getProperty("key"),
					sKeyField = oToken.getBindingInfo("key").parts[0].path,
					aParts = oToken.getBindingInfo("key").binding.getContext().getPath().split("/"),
					sPath = "/" + aParts[1],
					oModel = this.getModel("model");

				var sIndex = oModel.getProperty(sPath).map(function (obj) {
					return obj[sKeyField];
				}).indexOf(sKey);

				oModel.getProperty(sPath).splice(sIndex, 1);
				oModel.setProperty(sPath, oModel.getProperty(sPath));

			}

		},

		onTokenUpdate: function (oEvent) {
			const oSource = oEvent.getSource();
			const iDeletedTokenRow = oSource.getParent().getIndex();
			const aTokens = oSource.getTokens();
			const aRemovedTokens = oEvent.getParameters("removedTokens").removedTokens;
		},

		onValueHelpRequest: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("serhatmercan.Fragment", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},

		onSearchTSD: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				oTable = sap.ui.getCore().byId(oEvent.getSource().getId()),
				aFilters = [];

			aFilters.push(new Filter("Value", FilterOperator.Contains, sValue.toUpperCase()));
			oTable.getBinding("items").filter(aFilters, "Application");
		},

		onConfirmTSD: function (oEvent) {
			var aSelectedContexts = oEvent.getParameter("selectedContexts"),
				oModel = this.getModel("model")
			sPath = "/List";

			for (var i = 0; i < aSelectedContexts.length; i++) {
				oModel.getProperty(sPath).push(this.getModel().getProperty(aSelectedContexts[i].sPath));
			}

			oModel.setProperty(sPath, oModel.getProperty(sPath));
			oModel.refresh();
			this.onCancelTSD();
		},

		onCancelTSD: function () {
			this._oDialog.destroy();
			this._oDialog = null;
		}

	});

});