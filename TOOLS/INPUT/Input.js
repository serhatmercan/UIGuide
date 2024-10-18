sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Input",
	"sap/ui/core/CustomData",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Input, CustomData, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Integer: 1,
				Unit: "",
				Value: ""
			});

			this.setModel(oViewModel, "model");

			const oInput = this.byId("Input");

			oInput.focus();
			oInput.setValue("");
			oInput.attachBrowserEvent("mousewheel", oEvent => {
				oEvent.preventDefault();
			});

			sap.ui.getCore().getMessageManager().registerObject(oInput, true);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACVH() {
			this.destroyVHDialog();
		},

		onBRT(oEvent) {
			const oFilterPeriod = new Filter("Key", FilterOperator.EQ, "X");
			oEvent.getParameter("bindingParams")?.filters?.push(oFilterPeriod);
		},

		onCancel() {
			this.destroyVHDialog();
		},

		onChangeInput(oEvent) {
			this.validateField(oEvent);
		},

		onConfirm(oEvent) {
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const { Title: sTitle, Description: sDescription, Info: sInfo } = oSelectedItem;
			const oData = oSelectedItem.getBindingContext().getProperty();

			this.destroyVHDialog();
		},

		onInitST() {
			const oSFB = this.byId("SFB");
			const oID = {
				items: [
					{
						key: "X"
					}
				]
			};
			const oJSONData = { ID: oID };

			oSFB.setFilterData(oJSONData);
		},

		onSearch(oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [new Filter("Title", FilterOperator.Contains, sValue)];
			oEvent.getParameter("itemsBinding")?.filter(aFilters);
		},

		onSelect(oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = this.getModel().getProperty(`${sPath}/ID`);
			const oViewModel = this.getModel("model");

			oViewModel.setProperty("/Value", sID);
			oViewModel.setProperty(`${this.sPath}/Value`, sID);
			oViewModel.setProperty(`${this.sPath}/ID`, sID);

			this.onACVH();
		},

		onSubmit() { },

		onSIS(oEvent) {
			const oSelectedItem = oEvent.getParameters().selectedItem;
			const sKey = oSelectedItem.getProperty("key");
		},

		onVHR(oEvent) {
			this.sPath = oEvent.getSource().getBindingContext("model").getPath();
			this.openVHDialog("com.serhatmercan.SmartSearchHelp");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		destroyVHDialog() {
			if (this.oVHDialog) {
				this.oVHDialog.destroy();
				this.oVHDialog = null;
			}
		},

		generateInput() {
			return new Input({
				fieldGroupIds: "{Fields}",
				maxLength: {
					parts: [{
						path: "model>Type"
					}, {
						path: "model>Length"
					}, {
						path: "model>Value"
					}],
					formatter: this.formatter.calculateInput
				}
			}).applySettings({
				value: {
					path: "model>Value",
					type: "sap.ui.model.type.String"
				}
			}).addAggregation("customData", new CustomData({
				key: "Type",
				value: {
					path: "model>Type"
				}
			})).addAggregation("customData", new CustomData({
				key: "Length",
				value: {
					path: "model>Length"
				}
			})).addAggregation("customData", new CustomData({
				key: "Value",
				value: {
					path: "model>Value"
				}
			})).bind(this);
		},

		getSuggestionItems() {
			const oInput = this.byId("Input");
			const aSuggestionItems = oInput.getSuggestionItems();
			const sItem = aSuggestionItems.find(oItem => oItem.getKey() === "X");
			const { Key: sKey, Text: sText } = sItem;
		},

		async openVHDialog(sFragmentName) {
			if (!this.oVHDialog) {
				this.oVHDialog = await this.loadFragment({
					id: this.getView().getId(),
					name: sFragmentName,
					controller: this
				});
				this.getView().addDependent(this.oVHDialog);
			}
			this.oVHDialog.open();
		},

		validateField(oEvent) {
			const iValue = +oEvent.getParameter("value");
			const oSource = oEvent.getSource();
			const sProperty = oSource.getBinding("value").getPath();
			const sPath = oSource.getParent().getBindingContext("model").getPath();

			this.getModel("model").setProperty(`${sPath}/${sProperty}`, Math.max(iValue, 0));
		}

	});
});