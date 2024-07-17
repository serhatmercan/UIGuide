sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
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

		onScanBarcode() {
			BarcodeScanner?.scan(oScan => {
				if (!oScan?.cancelled) {
					const oModel = this.getModel();
					const sPath = this.getView()?.getBindingContext()?.getPath();

					oModel.setProperty(sPath + "/Key", oScan?.text);
				}
			});
		},

		onSSID(oEvent) {
			if (!oEvent.getParameter("cancelled")) {
				const oModel = this.getModel();
				const sPath = this.getView()?.getBindingContext()?.getPath();

				oModel.setProperty(sPath + "/ID", oEvent.getParameter("text"));
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		bindDialog() {
			const oModel = this.getModel();
			const oCreateEntry = oModel.createEntry("/...Set");
			const sSmartFormID = this.getView().getId() + "--SmartForm";
			const sPath = oCreateEntry.getPath();

			sap.ui.core.Fragment.byId(sSmartFormID, "SmartForm").bindElement(sPath);

			oModel.setProperty(sPath + "/Value", "X");

			const oTable = this.byId("SmartTable")?.getTable();
			const iSelectedIndex = oTable?.getSelectedIndex();
			const sBindElement = oTable?.getContextByIndex(iSelectedIndex)?.getPath();

			this.onOpenDialog("Dialog", "serhatmercan.SmartForm").then(oDialog => {
				oDialog.bindElement(sBindElement);
			});
		},

		check() {
			if (this.byId("SmartField")?.check()?.length) {
				return;
			}
		},

		getData() {
			return this.byId("SmartForm")?.getBindingContext()?.getProperty();
		},

		patternMatched() {
			this.getOwnerComponent()?.getModel()?.metadataLoaded()?.then(() => {
				const oModel = this.getModel();
				const sPath = oModel?.createEntry("/ValueSet")?.getPath();

				this.byId("SmartForm").bindElement(sPath);

				oModel.setProperty(sPath + "/Value", "X");
			});
		},

		resetSmartFormElementsValueStates(sSmartFormID) {
			this.byId(sSmartFormID)?.getGroups()?.forEach(oSFGroup => {
				oSFGroup?.getGroupElements()?.forEach(oSFGroupElement => {
					oSFGroupElement?.getElements()?.forEach(oSmartField => {
						oSmartField?.setValueState("None");
					});
				});
			});
		},

		setData() {
			const oModel = this.getModel();
			const sPath = this.byId("SmartForm")?.getBindingContext()?.getPath();

			oModel.setProperty(sPath + "/ID", "X");
		}

	});

});