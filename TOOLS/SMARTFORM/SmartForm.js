sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oViewModel = new JSONModel({
				Value: ""
			});

			this.setModel(oViewModel, "model");

			this.resetSmartFormElementsValueStates("SmartForm");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onScanBarcode: function () {
			const fnSuccess = function (oScan) {
				if (!oScan.cancelled) {
					this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/Key", oScan.text);
				}
			}.bind(this);

			BarcodeScanner.scan(fnSuccess);
		},

		onSSID: function (oEvent) {
			if (!oEvent.getParameter("cancelled")) {
				this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/ID", oEvent.getParameter("text"));
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		bindDialog: function () {
			const oModel = this.getModel();
			const oCreateEntry = oModel.createEntry("/...Set");

			sap.ui.core.Fragment.byId(this.getView().getId(), "SmartForm").bindElement(oCreateEntry.getPath());
			oModel.setProperty(oCreateEntry.getPath() + "/Value", "X");

			// From Smart Table To Smart Form
			const oTable = this.byId("SmartTable").getTable();
			const iSelectedIndex = oTable.getSelectedIndex();
			const oBindElement = oTable.getContextByIndex(iSelectedIndex).getPath();

			this.onOpenDialog("Dialog", "serhatmercan.SmartForm").then((oDialog) => {
				oDialog.bindElement(oBindElement);
			});
		},

		check: function () {
			if (this.byId("SmartField").check().length) {
				return;
			}
		},

		getData: function () {
			const oSFData = this.byId("SmartForm").getBindingContext().getProperty();
		},

		patternMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				const sPath = this.getModel().createEntry("/ValueSet").getPath();

				this.byId("SmartForm").bindElement(sPath);
				this.getModel().setProperty(sPath + "/Value", "X");
			}.bind(this));
		},

		resetSmartFormElementsValueStates: function (sSmartFormID) {
			this.byId(sSmartFormID).getGroups().forEach(oSFGroup => {
				oSFGroup.getGroupElements().forEach(oSFGroupElement => {
					oSFGroupElement.getElements().forEach(oSmartField => {
						oSmartField.setValueState("None");
					});
				});
			});
		},

		setData: function () {
			this.getModel().setProperty(this.byId("SmartForm").getBindingContext().getPath() + "/ID", "X");
		}

	});

});