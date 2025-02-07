sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"com/serhatmercan/formatter",
	"sap/m/MultiInput",
	"sap/m/Token",
	"sap/m/Tokenizer",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (BaseController, formatter, MultiInput, Token, Tokenizer, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter,

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Value: "",
				List: []
			});

			this.setModel(oViewModel, "model");

			this.byId("MI").setEnableMultiLineMode(sap.ui.Device.system.phone);
			this.byId("MI").setValueState("Error");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCancelSD() {
			this.oDialog.destroy();
			this.oDialog = null;
		},

		onCancelTSD() {
			this.oDialog.destroy();
			this.oDialog = null;
		},

		onChange(oEvent) {
			const sValue = oEvent.getParameter("newValue");
			const { path: sPath, model: sModel } = oEvent.getSource()?.getBindingInfo("tokens");
			const sKeyField = oEvent.getSource()?.getBindingInfo("tokens")?.template.getBindingInfo("key")?.parts[0]?.path;
			const aList = this.getModel(sModel).getProperty(sPath);
			const oObj = {};

			oObj[sKeyField] = formatter.validField(sValue) ? formatter.padLeft(sValue, oEvent.getSource().getMaxLength()) : sValue.toUpperCase();

			oEvent.getSource().setValue("");
			aList.push(oObj);

			this.getModel(sModel).setProperty(sPath, aList);
		},

		onClearMI() {
			this.byId("MI").destroyTokens();
		},

		onConfirmSD(oEvent) {
			const aSelectedItems = oEvent.getParameter("selectedItems").map(oItem => ({
				ID: oItem.getTitle(),
				Value: oItem.getDescription()
			}));

			this.getModel("model").setProperty("/List", aSelectedItems);
			this.onCancelSD();
		},

		onConfirmTSD(oEvent) {
			const oModel = this.getModel();
			const aItems = oEvent.getParameter("selectedContexts").map(oContext => oModel.getProperty(oContext.getPath()));

			this.getModel("viewModel").setProperty("/List", aItems);
			this.onCancelTSD();
		},

		onLiveChangeTSD(oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [new Filter("Value", FilterOperator.Contains, sValue.toUpperCase())];

			sap.ui.getCore().byId(oEvent.getSource().getId()).getBinding("items").filter(aFilters, "Application");
		},

		onSearchSD(oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [new Filter("ID", FilterOperator.Contains, sValue)];

			oEvent.getSource().getBinding("items").filter(aFilters);
		},

		onSearchTSD(oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [new Filter("Value", FilterOperator.Contains, sValue.toUpperCase())];

			sap.ui.getCore().byId(oEvent.getSource().getId()).getBinding("items").filter(aFilters, "Application");
		},

		onTC(oEvent) {
			if (oEvent.getParameter("type") === "removed") {
				const oToken = oEvent.getParameter("token");
				const sKey = oToken.getProperty("key");
				const sKeyField = oToken.getBindingInfo("key").parts[0].path;
				const aParts = oToken.getBindingInfo("key").binding.getContext().getPath().split("/");
				const sPath = `/${aParts[1]}`;
				const oViewModel = this.getModel("model");
				const sIndex = oViewModel.getProperty(sPath).findIndex(oData => oData[sKeyField] === sKey);
				const aList = oViewModel.getProperty(sPath).filter((_, iIndex) => iIndex !== sIndex);

				oViewModel.setProperty(sPath, aList);
			}
		},

		onTU(oEvent) {
			const oSource = oEvent.getSource();
			const iDeletedTokenRow = oSource.getParent().getIndex();
			const aRemovedTokens = oEvent.getParameters("removedTokens").removedTokens;
			const oViewModel = this.getModel("model");
			const updatedList = oViewModel.getProperty("/List").filter(oToken => oToken.ID !== aRemovedTokens[0].getKey());

			oViewModel.setProperty("/List", updatedList);
		},

		async onVHR() {
			this.oDialog = await this.loadFragment({
				name: "com.serhatmercan.Fragment",
				controller: this
			});
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		generateMultiInput() {
			return new MultiInput("MI", {
				value: "{model>/List}",
				enabled: "{= ${model>/Editable} && ${model>/Visible} ? true : false }",
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: (oEvent) => this.onVHR(oEvent).bind(this) // -> Value Help Dialog
			});
		},

		getTokens() {
			return this.byId("MI").getTokens().map(oToken => oToken.getKey());
		},

		setTokens() {
			const oTokenizer = new Tokenizer();
			const oToken = new Token({
				key: "X",
				text: "Value"
			});

			oTokenizer.addToken(oToken);

			this.byId("MI").setTokens(oTokenizer.getTokens());
		}

	});

});