sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({					
					Integer: 1,
					Unit: "",
					Value: ""
			}), "model");

			this.byId("Input").focus();
			this.byId("Input").setValue("");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACVH: function () {
			this.oVHDialog.close();
			this.oVHDialog.destroy();
			this.oVHDialog = null;
			this.sPath = "";
		},

		onBRT: function (oEvent) {			
			const oFilterPeriod = new Filter("Key", FilterOperator.EQ, "X");
			const oFilterPeriodX = new Filter("Key", FilterOperator.CP, "*");

			oEvent.getParameter("bindingParams").filters.push(oFilterPeriod);
		},	

		onCancel: function () {
			this.oVHDialog.destroy();
			this.oVHDialog = null;
		},

		onChangeInput: function (oEvent) {
			const sValue = oEvent.getParameter("newValue");

			this.validateField(oEvent);
		},

		onConfirm: function (oEvent) {
			const oData = oEvent.getParameter("selectedItem").getBindingContext().getProperty();
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const sTitle = oSelectedItem.getTitle();
			const sDescription = oSelectedItem.getDescription();
			const sInfo = oSelectedItem.getInfo();

			this.oVHDialog.close();
		},

		onInitST: function () {
			const oSFB = this.byId("SFB");
			let oJSONData = {};
			let oID = {};

			this.sID = "X";

			if (oSFB && this.sID) {
				oID = {
					items: [{
						key: this.sID
					}]
				};
				oJSONData.ID = oID;
			}

			oSFB.setFilterData(oJSONData);
		},

		onSearch: function (oEvent) {
			const aFilters = [
				new Filter("Title", FilterOperator.Contains, oEvent.getParameter("value"))
			];

			oEvent.getParameter("itemsBinding").filter(aFilters);
		},

		onSelect: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = this.getModel().getProperty(sPath + "/ID");
			const oModel = this.getModel("model");

			oModel.setProperty("/Value", sID);
			oModel.setProperty(this.sPath + "/Value", sID);
			oModel.setProperty(this.sPath + "/ID", this.getModel().getProperty(oEvent.getSource().getBindingContextPath() + "/ID"));

			this.onACVH();
		},

		onVHR: function(oEvent){
			this.sPath = oEvent.getSource().getBindingContext("model").getPath();

			this.oVHDialog = sap.ui.xmlfragment("VH", "com.serhatmercan.SmartSearchHelp", this);

			sap.ui.core.Fragment.byId("VH", "ST").setSmartFilterId(sap.ui.core.Fragment.byId("VH", "SFB").getId());

			this.getView().addDependent(this.oVHDialog);

			this.oVHDialog.open();
		},

		onVHR: function () {
			if (!this.oVHDialog) {
				this.oVHDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.InputSHList", this);				
				this.getView().addDependent(this.oVHDialog);			
			}

			this.oVHDialog.open();
		},
		
		onVHR: function () {
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, "X")
			];

			if (!this.oVHDialog) {
				this.oVHDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.InputSHList", this);
				this.oVHDialog._oSubHeader.setVisible(false);
				this.getView().addDependent(this.oVHDialog);
			}

			this.oVHDialog._oDialog.attachBeforeOpen((oEvent) => {
				const aFilters = [
					new Filter("Value", FilterOperator.EQ, this.getModel("model").getProperty("/Value"))
				];	

				this.byId("SD").getBinding("items").filter(aFilters);
			});

			sap.ui.core.Fragment.byId(this.getView().getId(), "SD").getBinding("items").filter(aFilters);
		},	

		/* ================ */
		/* Internal Methods */
		/* ================ */

		validateField: function (oEvent) {
			const iValue = +oEvent.getParameter("value");
			const oSource = oEvent.getSource();
			const sProperty = oSource.getBinding("value").getPath();
			const sPath = oSource.getParent().getBindingContext("model").getPath();

			this.getModel("model").setProperty(sPath + "/" + sProperty, iValue > 0 ? iValue : 0);
		}

	});

});