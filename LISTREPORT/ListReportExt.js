	sap.ui.define([
		"sap/m/MessageBox",
		"sap/m/MessageToast",
	], function (MessageBox, MessageToast) {
		"use strict";
		return sap.ui.controller("com.serhatmercan.ext.controller.ListReportExt", {

			adaptTransientMessageExtension: function () {
				sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
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

			modifyStartupExtension: function (oStartupObject) {
				const oSelectionVariant = oStartupObject.selectionVariant;

				if (oSelectionVariant) {
					oSelectionVariant.getSelectOption("ID").forEach(oID => oSelectionVariant.addSelectOption("ID", "I", "EQ", oID.Low));
				}
			},

			onAfterRendering: function () {
				// Component ID: com.serhatmercan.listreport
				const oTableModel = this.getView().byId(
					"com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--GridTable").getModel();

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

			onBeforeRebindTableExtension: function (oEvent) {
				const oBindingParams = oEvent.getParameter("bindingParams");
				const aIDs = location.href.split("ID=").slice(1);

				if (oBindingParams) {
					aIDs.forEach(sID => oBindingParams.filters.push(new Filter("ID", FilterOperator.EQ, parseInt(sID))));
				}
			},

			onGoToDetail: function () {},

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
				this.byId("com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport::MainSet--listReport")
					.rebindTable(true);
			},

			onShowErrorMessages: function (oError) {
				const oResponseText = JSON.parse(oError.responseText);
				const oMessage = oResponseText.error.message;
				const sMessage = oMessage ? oMessage.value : oError.message;

				MessageBox.error(sMessage, {
					details: oResponseText,
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {}.bind(this)
				});
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