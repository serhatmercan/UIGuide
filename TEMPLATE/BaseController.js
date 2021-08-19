sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
	"use strict";

	/* 
				CONTEXT
	-> i18n: Resource Bundle							=> getResourceBundle
	-> Show Messages									=> onShowMessages
	-> JSON Model: Clear Model							=> _clearModel
	-> JSON Model: Add Row To Table 					=> onAddRowToTable
	-> JSON Model: Add Row Between Two Rows To Table	=> onAddRowBetweenTwoRowsToTable
	-> JSON Model: Delete Rows From Table				=> onDeleteRowsFromTable
	-> JSON Model: Sort Rows in Table w/ Property		=> onSortRowsInTable
	-> Table: Get Table ID								=> onGetTableID
	-> Table: Get Table Selected Indices Length			=> onGetTableSelectedIndices
	-> Table: Get All Data From UI Table				=> onGetAllDataFromUITable
	-> Table: Get Selected Single Data From UI Table	=> onGetSelectedSingleDataFromUITable
	-> Table: Get Selected Multi Data From UI Table		=> onGetSelectedMultiDataFromUITable
	-> Operation: READ -> Get Single Data				=> onGetSingleData
	-> Operation: READ -> Get Multi Data				=> onGetMultiData
	-> Operation: READ -> Get Multi Structure & Tables	=> onGetExpandedData
	-> Operation: CREATE -> Send Single Data			=> onSendSingleData
	-> Operation: CREATE -> Send Multi Data				=> onSendMultiData
	-> User Input: Check Fields							=> onCheckFields
	-> Custom Dialog: Confirm							=> _getConfirmDialog
	*/
	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.getView().setModel(new JSONModel({
				Value: "",
				Object: {},
				Table: []
			}), "model");

			this.getRouter().getRoute("baseController").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameter("arguments").id) {
				this._sID = oEvent.getParameter("arguments").id;
			}
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onShowMessages: function (oEvent) {
			const oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				oMessagesButton.addDependent(this._oMessagePopover);
			}
			this._oMessagePopover.toggle(oMessagesButton);
		},

		_clearModel: function () {
			let oModel = this.getModel("model"),
				oCleanModel = {
					Value: "",
					Object: {},
					Table: []
				};
			oModel.setProperty("/", oCleanModel);
			oModel.refresh();
		},

		onAddRowToTable: function () {
			let oRow = {
				Data: ""
			};
			this._addRowToTable("model", "Table", oRow);
		},

		_addRowToTable: function (sModel, sProperty, oRow) {
			let oModel = this.getView().getModel(sModel),
				aTable = oModel.getProperty("/" + sProperty);

			aTable.push(oRow);
			oModel.setProperty(sProperty, aTable);
			oModel.refresh();
		},

		onAddRowBetweenTwoRowsToTable: function (oEvent) {
			let sTableID = this._getTableID(oEvent),
				sTableModel = sTableID === "idTable..." ? "model" : "model...";

			let aData = this._getDataFromUITable(sTableID, sTableModel),
				sId = "",
				oRow = {};

			if (aData.length === 0) {
				sId = "0100";
			} else if (this.byId(sTableID).getSelectedIndices().length !== 1) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseOneRow"));
				return;
			} else {
				let oSelectedData = this._getSelectedIndexDataFromUITable(sTableID, sTableModel),
					iOperasyonId = parseInt(oSelectedData.Id, 10);

				iId += 10;
				sId = "0" + iId;

				for (let i = 0; i < aData.length; i++) {
					if (iId == parseInt(aData[i].Id, 10)) {
						aData[i].Id = "0" + (parseInt(aData[i].Id, 10) + 10);
						iId = aData[i].Id;
					}
				}
			}

			oRow = {
				Id: sId,
				Value: ""
			};

			this._addRowSortTable(sTableModel, "/Table", aData, oRow);
		},

		_addRowSortTable: function (sModel, sProperty, aData, oRow) {
			let oModel = this.getView().getModel(sModel);

			aData.push(oRow);

			aData.sort(function (a, b) {
				return a.Id - b.Id;
			});

			oModel.setProperty(sProperty, aData);
			oModel.refresh();
		},

		onDeleteRowsFromTable: function (oEvent) {
			this._deleteRowsFromTable("idTable", "model", "/Table");
		},

		_deleteRowsFromTable: function (sId, sModel, sProperty) {
			// let oTable = sap.ui.getCore().byId(sId); -> For Fragment Table

			if (this.byId(sId).getSelectedIndices().length === 0) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseRow"));
				return;
			}

			let that = this;

			function fnConfirmDialog() {
				let oTable = that.getView().byId(sId),
					oTableModel = oTable.getModel(sModel),
					oTableData = oTableModel.getProperty(sProperty),
					aReverse = [].concat(oTable.getSelectedIndices()).reverse();

				aReverse.forEach(function (index) {
					oTableData.splice(index, 1);
				});

				oTableModel.refresh();
				oTable.setSelectedIndex(-1);
			}

			this._getConfirmDialog(this, "Message", "Warning", this.getResourceBundle().getText("warning"), this.getResourceBundle().getText(
				"infoDeleteRow"), fnConfirmDialog);
		},

		onSortRowsInTable: function (oEvent) {
			this._sortRowsInTable("idTable", "model", "/Table");
		},

		_sortRowsInTable: function (sId, sModel, sProperty) {
			let oTable = this.getView().byId(sId),
				oTableModel = oTable.getModel(sModel),
				aTableData = oTableModel.getProperty("/" + sProperty);

			aTableData.sort(function (a, b) {
				return a.OperasyonId - b.OperasyonId; // w/ Property
			});

			oTableModel.setProperty(sProperty, aTableData);
			oTableModel.refresh();
		},

		onGetTableID: function (oEvent) {
			let sTableID = this._getTableID(oEvent);
		},

		_getTableID: function (oEvent) {
			let sID = oEvent.getSource().getParent().getParent().getId(),
				iIndex = sID.indexOf("idTable"),
				sTableID = sID.substr(iIndex);

			return sTableID;
		},

		onGetTableSelectedIndices: function () {
			let aIndices = this.byId(sTableID).getSelectedIndices();
			if (aIndices.length === 0) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseRow"));
				return;
			}
		},

		onGetAllDataFromUITable: function () {
			let aTable = this._getAllDataFromUITable("idTable", "model");
		},

		_getAllDataFromUITable: function (sId, sModel) {
			let oTable = this.getView().byId(sId),
				aContexts = oTable.getBinding("rows").getContexts(),
				oModel = this.getModel(sModel),
				aData = [];

			for (var i = 0; i < aContexts.length; i++) {
				aData.push(oModel.getProperty(aContexts[i].getPath()));
			}

			return aData;
		},

		onGetSelectedSingleDataFromUITable: function () {
			let oRow = this._getSelectedSingleDataFromUITable("idTable", "model");
		},

		_getSelectedSingleDataFromUITable: function (sId, sModel) {
			let oTable = this.getView().byId(sId),
				iIndex = oTable.getSelectedIndex(),
				aContexts = oTable.getBinding("rows").getContexts(),
				oModel = this.getModel(sModel),
				oData = {};

			oData = oModel.getProperty(aContexts[iIndex].getPath());

			return oData;
		},

		onGetSelectedMultiDataFromUITable: function () {
			let aData = this._getSelectedMultiDataFromUITable("idTable", "model");
		},

		_getSelectedMultiDataFromUITable: function (sId, sModel) {
			let oTable = this.getView().byId(sId),
				aIndexes = oTable.getSelectedIndices(),
				aContexts = oTable.getBinding("rows").getContexts(),
				oModel = this.getModel(sModel),
				aData = [];

			for (var i = 0; i < aIndexes.length; i++) {
				aData.push(oModel.getProperty(aContexts[aIndexes[i]].getPath()));
			}

			return aData;
		},

		onGetSingleData: function () {
			let sPath = "/...Set(" + "Id='" + this._sID + "'" + ")";
			this._getSingleData(sPath, "model", "/Object");
		},

		_getSingleData: function (sPath, sModel, sProperty) {
			let oModel = this.getView().getModel(sModel);

			this.getView().getModel().read(sPath, {
				success: (oData) => {
					oModel.setProperty(sProperty, oData);
				},
				error: () => {
					// 
				}
			});
		},

		onGetMultiData: function () {
			let aFilters = [new Filter("Id", FilterOperator.Contains, this._sId)];

			/*			let aFilters = [
							new Filter({
								filters: [
									new Filter("Id", FilterOperator.EQ, this._sId),
									new Filter("Value", FilterOperator.EQ, this._sValue)
								],
								and: true
							})
						];*/

			this._getMultiData(aFilters, "/...Set", "model", "/Table");
		},

		_getMultiData: function (aFilters, sSet, sModel, sProperty) {
			let oModel = this.getView().getModel(sModel);

			this.getView().getModel().read(sSet, {
				filters: aFilters,
				success: (oData) => {
					oModel.setProperty(sProperty, oData.results);
				},
				error: () => {
					// 
				}
			});
		},

		onGetExpandedData: function () {
			let aFilters = [new Filter("Id", FilterOperator.Contains, this._sId)];

			this._getExpandedData(aFilters, "/...Set", "model");
		},

		_getExpandedData: function (aFilters, sSet, sModel) {
			this.getView().getModel().read(sSet, {
				filters: aFilters,
				urlParameters: {
					"$expand": "Header,Details" // Header -> Structure Asso , Details -> Table Asso
				},
				success: (oData) => {
					this._setExpandedData(oData.results[0], sModel);
				},
				error: (oError) => {
					let sError = JSON.parse(oError.responseText).error.innererror.errordetails[0];
					MessageBox.error(sError.message);
				}
			});
		},

		_setExpandedData: function (oData, sModel) {
			let oModel = this.getModel(sModel),
				aDetails = [];

			if (oData.Header) {
				oModel.setProperty("/ID", oData.Header.ID);
			}

			// aDetails = oData.Details.results;

			for (let i = 0; i < oData.Details.results.length; i++) {
				aDetails.push({
					Detail: oData.Details.results[i].Detail
				});
			}

			oModel.setProperty("/Details", aDetails);
			oModel.refresh();
		},

		onSendSingleData: function () {
			let oModel = this.getView().getModel("model"),
				oObject = {};

			oObject.Id = "1";
			oObject.Value = oModel.getProperty("/Value");

			this._sendSingleData("/...Set", oObject);
		},

		_sendSingleData: function (sSet, oData) {
			let oParams = {
				success: (oSuccess) => {

				},
				error: (oError) => {
					// 
				}
			};

			this.getView().getModel().create(sSet, oData, oParams);
		},

		onSendMultiData: function () {
			let oModel = this.getView().getModel("model"),
				aTable = oModel.getProperty("/Table"),
				oObject = {};

			oObject.Value = oModel.getProperty("/Value");
			oObject.to_Items = [];

			for (let i = 0; i < aTable.length; i++) {
				oObject.to_Items.push({
					Id: aTable[i].Id,
					No: aTable[i].No
				});
			}

			this._sendMultiData("/...Set", oObject);
		},

		_sendMultiData: function (sSet, oData) {
			let oParams = {
				success: (oSuccess) => {

				},
				error: (oError) => {
					var sError = JSON.parse(oError.responseText).error.innererror.errordetails[0];
					MessageBox.error(sError.message);
				}
			};

			this.getView().getModel().create(sSet, oData, oParams);
		},

		onCheckFields: function () {
			this._getRequiredElements(); // onInit
			if (this._checkFields()) {
				MessageToast.show(this.getResourceBundle().getText("infoObligatoryFields"));
				return;
			}
		},

		_checkFields: function () {
			let that = this,
				bValidationError = false;

			jQuery.each(this._aRequiredElements, function (i, oElement) {
				bValidationError = that._validateElement(oElement) || bValidationError;
			});

			return bValidationError;
		},

		_validateElement: function (oElement) {
			let sName = oElement.getMetadata().getName(),
				sValue,
				sValueState = "None",
				bValidationError = false;

			switch (sName) {
			case "sap.m.DatePicker":
				sValue = oElement.getDateValue();
				break;
			case "sap.m.ComboBox":
				sValue = oElement.getSelectedKey();
				break;
			case "sap.m.MultiComboBox":
				sValue = oElement.getSelectedKeys().length;
				break;
			case "sap.m.Select":
				sValue = oElement.getSelectedKey();
				break;
			case "sap.m.MultiInput":
				sValue = oElement.getTokens().length;
				break;
			default:
				sValue = oElement.getValue();
			}

			if (!sValue) {
				sValueState = "Error";
				bValidationError = true;
			}

			oElement.setValueState(sValueState);

			return bValidationError;
		},

		_getRequiredElements: function () {
			let aElements = this.getView().byId("page").findElements(),
				aContentsPage = aElements[0].getContent(),
				aContentsSF = sap.ui.getCore().byId("idSF").getContent(),
				aClasses = ["sap.m.ComboBox", "sap.m.MultiInput", "sap.m.Select", "sap.m.Input", "sap.m.DatePicker",
					"sap.m.TimePicker", "sap.m.MultiComboBox", "sap.m.TextArea"
				];

			this._aRequiredElements = aContentsPage.filter(function (item) {
				let sName = item.getMetadata().getName();
				if (aClasses.findIndex(x => x === sName) !== -1 && item.getRequired()) {
					return true;
				} else {
					return false;
				}
			});
		},

		_getConfirmDialog: function (that, sType, sState, sTitle, sText, fnConfirm) {
			let oDialog = new Dialog({
				title: that.getResourceBundle().getText(sTitle),
				type: sType,
				state: sState || "None",
				content: new Text({
					text: that.getResourceBundle().getText(sText)
				}),
				beginButton: new Button({
					text: that.getResourceBundle().getText("ok"),
					press: function () {
						oDialog.close();
						fnConfirm();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("cancel"),
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

	});

});