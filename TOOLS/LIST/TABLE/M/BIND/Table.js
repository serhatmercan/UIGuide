sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		getTableData: function () {

			var aContext = this.getView().byId("idTable").getSelectedContexts();

		},

		getData: function () {
			const oContext = this.getView().getBindingContext();
			const oData = oContext.getObject();
			const aItems = [];

			oData.to_Items.__list.forEach((Item) => {
				aItems.push(oContext.getProperty("/" + Item));
			});
		},

		_bindView: function () {
			const oView = this.getView();
			const oViewModel = this.getModel("viewModel");
			const oTable = this.byId("idTable");
			const oExpand = {
				"$expand": "to_Header,to_Items"
			};

			this._sPath = oEvent.getSource().getParent().getBindingContext("viewModel").getPath();

			oViewModel.setProperty(this._sPath + "/Data", sMaterial);

			oView.bindElement({
				path: sPath,
				parameters: oExpand
			});

			oTable.rebindTable();
		},

		_clearView: function () {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		}

	});

});