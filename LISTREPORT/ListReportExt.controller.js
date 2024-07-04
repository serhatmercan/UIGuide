sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
<<<<<<< HEAD
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (MessageBox, MessageToast, Spreadsheet, Filter, FilterOperator) {
=======
	'sap/ui/export/Spreadsheet'
], function (MessageBox, MessageToast, Spreadsheet) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";
	return sap.ui.controller("com.serhatmercan.ext.controller.ListReportExt", {

		adaptTransientMessageExtension: function () {
			sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));

			this.extensionAPI.rebindTable();
		},

		getFilterBarData: function () {
			const sID = this.byId("listReportFilter").getFilterData().ID;
		},

		getSelectedContext: function () {
			const aSelectedItems = this.extensionAPI.getSelectedContexts();
			const aSelectedData = this.extensionAPI.getSelectedContexts().map(oItem => {
				return oItem.getObject();
			});
			const oView = this.getView();
			const oModel = oView.getModel();
			const oResourceBundle = oView.getModel("@i18n").getResourceBundle();
		},

		getTableID: function () {
			this.getView().getContent()[0].getContent().getTable().getId();
		},

		modifyStartupExtension: function (oStartupObject) {
			const oSelectionVariant = oStartupObject.selectionVariant;

			if (oSelectionVariant) {
				oSelectionVariant.getSelectOption("ID").forEach(oID => oSelectionVariant.addSelectOption("ID", "I", "EQ", oID.Low));
			}
		},

		onAfterRendering: function () {
			// Component ID: com.serhatmercan.listreport
			const oTable = this.getView().byId(
				"com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--GridTable");
			const oTableModel = this.getView().byId(
				"com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--GridTable").getModel();
			const oSmartFilter = this.getView().byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReportFilter");


			oTableModel.attachRequestCompleted((oEvent) => {
				setTimeout(() => {
					const oTable = this.getView().byId(
						"com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--GridTable");
					const aColumns = oTable.getTable().getColumns();

					for (let i = aColumns.length - 1; i > -1; i--) {
						aColumns[i].getParent().autoResizeColumn(i);
					}

					for (let i = 0; k < oTable.getColumns().length; k++) {
						aColumns[i].setProperty("width", "13rem");
						aColumns[i].getLabel().setWrapping(true);
					}
				});
			});

			oTable.getToolbar().addContent(
				new sap.m.Button({
					text: "{i18n>button}",
					type: sap.m.ButtonType.Reject,
					press: () => {
						this.onShowButton();
					}

				})
			);

			this.getView().byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--template::IconTabBar").attachSelect((oEvent) => {
				const oListReportFilter = this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReportFilter")
				const aListReportFilterItems = oListReportFilter.getAllFilterItems();
				const sIconTabBarKey = oEvent.getSource().getSelectedKey();
				const oID = aListReportFilterItems.find(oItem => oItem.getName() === "ID");

				if (oID) {
					oID.setHiddenFilter(sIconTabBarKey !== "Main");
					oID.setMandatory(sIconTabBarKey === "Main");
					oID.setVisibleInFilterBar(sIconTabBarKey === "Main");
				}

				oListReportFilter.fireClear();
			});

			oSmartFilter.setFilterData({
				ID: {
					ranges: [{
						"exclude": false,
						"operation": "EQ",
						"keyField": "ID",
						"value1": "X",
						"value2": null
					}]
				}
			});

			oSmartFilter.setEnabled(false);

			this.getOwnerComponent().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		},

		onBeforeRebindTableExtension: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oSmartTable = this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReport");
			const oTable = this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--responsiveTable");
			const aContexts = oSmartTable.getToolbar().getContent();
			const aIDs = location.href.split("ID=").slice(1);
			const aItems = oTable.getItems();
			const sValue = aItems[0].getBindingContext().getObject().Value;

			if (oBindingParams) {
				aIDs.forEach(sID => oBindingParams.filters.push(new Filter("ID", FilterOperator.EQ, parseInt(sID))));
			}

			oSmartTable.getToolbar().addContent(
				new sap.m.Text({
					text: ("X")
				})
			);

			oSmartTable.setRequestAtLeastFields("ID,Value");
			oSmartTable.setUseExportToExcel(true);
		},

		onBeforeRendering: function () {
			const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			const oToday = new Date();
			const oFormattedToday = oDateFormat.format(oToday);
			const oFormattedTwoWeeksAgo = oDateFormat.format(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 14));
			const oDefaultFilter = {
				Erdat: {
					low: oFormattedTwoWeeksAgo,
					high: oFormattedToday
				}
			};
			const sAppIdentifier = "com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport";
			const oSmartFilter = this.byId(sAppIdentifier + "::MainSet--listReportFilter");

			oSmartFilter.attachInitialise(function () {
				oSmartFilter.setFilterData(oDefaultFilter);
			});
		},

		onExportToExcel: function (oEvent) {
			const oModel = this.getView().getModel();
			const oTable = this.getView().byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--GridTable");
			const aTableData = oTable.getBinding().aKeys.map(sPath => {
				return oModel.getProperty("/" + sPath);
			});
			const aColumns = oTable.getColumns().map(oColumn => {
				return {
					"label": oColumn.getAggregation("label").getText(),
					"property": oColumn.getAggregation("customData")[0].getProperty("value").columnKey
				};
			});
			const oSettings = {
				dataSource: aTableData,
				fileName: 'Test.xlsx',
				workbook: {
					columns: aColumns
				}
			};

			new Spreadsheet(oSettings).build().finally(() => {
				oSheet.destroy();
			});
		},

		onGoToDetail: function () { },

		onGoToExternalPage: function () {
			const aContexts = this.extensionAPI.getSelectedContexts();
			const oView = this.getView();
			const oModel = oView.getModel();
			const oResourceBundle = oView.getModel("@i18n").getResourceBundle();

			if (aContexts.length === 0) {
				return;
			}

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "SM_FIORI_APP",
					action: "display"
				},
				params: {
					ID: oModel.getProperty(aContexts[0].getPath() + "/ID")
				}
			});
		},

		onInit: function () {
			// HeaderSet: Main Entity
			// Items: Association Name
			const oItemTable = sap.ui.getCore().byId(
				"com.serhatmercan.listreport::sap.suite.ui.generic.template.ObjectPage.view.Details::HeaderSet--Items::com.sap.vocabularies.UI.v1.LineItem::responsiveTable"
			);

			if (oItemTable.getMode() !== "MultiSelect") {
				oItemTable.setMode("MultiSelect");
			}

			this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReport").setIgnoredFields("Text,Value");
		},

		onInitSmartFilterBarExtension: function () {
			this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReport").setRequestAtLeastFields("Text,Value");
			this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--responsiveTable").setGrowingThreshold(250);
		},

		onPressButtonX: function (oEvent) {
			const oContext = oEvent.getSource().getBindingContext().getObject();
			const oModel = this.getView().getModel();
			const sPath = oContext.Items.__list;
			const aItems = [];

			oContext.Items.__list.forEach(sPath => {
				aItems.push(oModel.getProperty("/" + sPath));
			});
		},

		onRebindTable: function () {
			// Component ID: com.serhatmercan.listreport
			this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReport").rebindTable(true);
		},

		onShowErrorMessages: function (oError) {
			const oResponseText = JSON.parse(oError.responseText);
			const oMessage = oResponseText.error.message;
			const sMessage = oMessage ? oMessage.value : oError.message;

			MessageBox.error(sMessage, {
				actions: [MessageBox.Action.CLOSE],
				details: oResponseText,
				onClose: function () { }.bind(this)
			});
		},

		onShowMessages: function (oEvent) {
			let oMessagesButton = oEvent.getSource();

			if (!this.oMessagePopover) {
				this.oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});

				oMessagesButton.addDependent(this.oMessagePopover);
			}

			this.oMessagePopover.toggle(oMessagesButton);
		},

		onSSBarcode: function (sType, oEvent) {
			// Component ID: com.serhatmercan.listreport
			if (!oEvent.getParameter("cancelled")) {
				const oSmartFilter = this.getView().byId(
					"com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReportFilter");
				let oFilter = {};

				switch (sType) {
					case "E":
						oFilter.Equnr = oEvent.getParameter("text");
						break;
					case "F":
						oFilter.Tplnr = oEvent.getParameter("text");
						break;
				}

				oSmartFilter.setFilterData(oFilter);
			}
		}

	});
});