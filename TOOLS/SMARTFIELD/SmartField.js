sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], (BaseController, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChangeID: async function (oEvent) {
			const sID = oEvent.getParameter("value");
			const sPath = this.getView().getBindingContext().getPath();
			const oModel = this.getModel();

			oEvent.getSource().setValue(sID);
			oModel.setProperty(`${sPath}/ID`, oModel.getProperty(`/VHSet('${sID}')/Value`));

			if (sID) {
				const oKey = oModel.createKey("/...VHSet", { ID: sID });

				try {
					const oData = await this.onRead(oKey, oModel);
					const sTxt = oData.Txt;
				} catch (oError) {
				} finally {
					sap.ui.getCore().getMessageManager().removeAllMessages();
				}
			}
		},

		onChangeIDWithDescription: async function (oEvent) {
			const oModel = this.getModel();
			const sID = oEvent.getParameter("newValue");
			const sPath = this.getView().getBindingContext().getPath();

			oModel.setProperty(`${sPath}/Description`, "");

			if (sID) {
				try {
					const oIDVHKey = oModel.createKey("/IDVHSet", { ID: sID });
					const oData = await this.onRead(oIDVHKey, oModel);

					oModel.setProperty(`${sPath}/Description`, oData.Description);
				} catch (oError) {
				} finally {
					sap.ui.getCore().getMessageManager().removeAllMessages();
				}

				try {
					const aFilters = [
						new Filter("ID", FilterOperator.EQ, sID)
					];
					const oData = await this.onReadQuery("/IDVHSet", aFilters, oModel);
					const sDescription = oData?.results?.length ? oData.results[0].Description : "";

					oModel.setProperty(`${sPath}/Description`, sDescription);
				} catch (oError) {
				} finally {
					sap.ui.getCore().getMessageManager().removeAllMessages();
				}
			} else {
				oModel.setProperty(`${sPath}/Description`, "");
				oModel.setProperty(`${sPath}/ID`, "");
			}
		},

		onFilterContent() {
			const oFilter = new Filter("Statu", FilterOperator.EQ, sValue);
			this.byId("SmartField")?.getContent()?.getBindingInfo("items")?.binding?.filter(oFilter);
		},

		onFilterDDL() {
			const oBinding = this.byId("ID").getInnerControls()[0].getBinding("items");
			const oModel = this.getModel();
			const sPath = this.getView().getBindingContext().getPath();
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X"),
				new Filter("ID", FilterOperator.EQ, oModel.getProperty(`${sPath}/Value`))
			];

			oBinding.filter(aFilters);
		},

		onICC(oEvent) {
			this.setSmartFieldValueHelpOnly(oEvent.getParameters()[0]);
		},

		onVLC(oEvent) {
			const sPath = oEvent.getSource().getBindingContext().getPath();
			const oData = this.getModel().getProperty(sPath);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		controlExplanationValueState(oEvent) {
			const oContainer = oEvent.getSource();
			const sExplanationID = oContainer.getId();
			const aSmartFields = [];
			// const aSmartFields = this.byId("SFData").getSmartFields();
			// const aSmartFields = oContainer.getParent().getParent().getParent().getParent().getSmartFields();

			while (aSmartFields.length === 0) {
				const bCheckSmartForm = sExplanationID?.split("--")?.pop()?.startsWith("idSF");

				if (bCheckSmartForm) {
					aSmartFields = oContainer?.getSmartFields();
				} else {
					oContainer = oContainer?.getParent();
				}
			}

			const iIndex = aSmartFields?.findIndex(oSF => oSF.getId() === sExplanationID);
			const oKeyField = aSmartFields[iIndex - 1];
			const oExplanationField = oEvent.getSource();
			const xValue = oKeyField?.getValue();

			if (xValue) {
				const bValidValue = ["N", "No", "None", "Y"].includes(xValue) || +xValue <= 0 || oExplanationField?.getValue() !== "";
				oExplanationField?.setValueState(bValidValue ? "None" : "Error");
			} else {
				oExplanationField?.setValueState("None");
			}
		},

		controlKeyValueState(oEvent) {
			let oContainer = oEvent.getSource();
			let aSmartFields = [];
			// const aSmartFields = this.byId("SFData").getSmartFields();
			// const aSmartFields = oContainer.getParent().getParent().getParent().getParent().getSmartFields();

			while (aSmartFields.length === 0) {
				const sIdSuffix = oContainer?.getId()?.split("--")?.pop();

				if (sIdSuffix?.startsWith("idSF")) {
					aSmartFields = oContainer?.getSmartFields();
				} else {
					oContainer = oContainer?.getParent();
				}
			}
			const sKeyID = oEvent?.getSource()?.getId();
			const iIndex = aSmartFields?.findIndex(oSF => oSF.getId() === sKeyID);
			const oExplanationField = aSmartFields[iIndex + 1];
			const xValue = oEvent?.getSource()?.getValue();
			const bValidValue = ["N", "No", "None", "Y"].includes(xValue) || +xValue <= 0 || oExplanationField.getValue() !== "";

			oExplanationField.setValueState(xValue ? (bValidValue ? "None" : "Error") : "None");
		},

		getData() {
			const sPath = this.getView().getBindingContext().getPath();
			return this.getModel().getProperty(`${sPath}/ID`);
		},

		getValue() {
			const oSmartField = this.byId("SmartField");
			const sValue = oSmartField?.getProperty("value") || oSmartField?.getValue();
			const sText = oSmartField?.getContent()?.getSelectedItem()?.getProperty("text");

			return { sValue, sText };
		},

		patternMatched() {
			const oModel = this.getOwnerComponent().getModel();
			const sSimpleFormPath = this.getModel().createEntry("/...Set").getPath();
			const sKeyPath = this.getModel().createKey("/SFSet", { ID: "X" });

			oModel.metadataLoaded().then(() => {
				this.byId("SimpleForm").bindElement(sSimpleFormPath);

				this.getView().bindElement({
					path: sKeyPath,
					parameters: { expand: "Header,Items" }
				});

				setTimeout(() => {
					const oSmartField = this.byId("SmartField");
					const oInnerControl = oSmartField?.getInnerControls()[0];

					oInnerControl?.getBinding("items")?.filter([new Filter("Value", FilterOperator.EQ, "X")]);
				}, 200);
			});
		},

		setData() {
			const sPath = `${this.byId("SimpleForm").getBindingContext().getPath()}/ID`;
			this.getModel().setProperty(sPath, "XYZ");
		},

		setSmartFieldValueHelpOnly(oItem) {
			if (oItem?.getMetadata()?.getElementName() === "sap.m.Input") {
				oItem?.setValueHelpOnly(true);
			}
		}

	});

});