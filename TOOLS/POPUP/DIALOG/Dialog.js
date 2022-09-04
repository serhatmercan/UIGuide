sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Dialog",
	"sap/m/TextArea",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function (BaseController, Button, ButtonType, Dialog, TextArea, JSONModel, Filter, FilterOperator, Fragment) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Values: {
						Value: {}
					}
				}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACConfirmDialog: function () {
			this.oConfirmDialog.close();
			this.oConfirmDialog.destroy();
			this.oConfirmDialog = null;
		},

		onACDialog: function (oEvent) {
			this.oDialog.close();
			this.oDialog.destroy();
			this.oDialog = null;

			oEvent.getSource().destroy();
		},

		onFilterDialogTable: function () {
			this.oDialog = sap.ui.xmlfragment("Dialog", "com.serhatmercan.fragment.Dialog", this);

			var aFilters = [
				new Filter("Key", FilterOperator.EQ, "A"),
				new Filter("Value", FilterOperator.EQ, "X")
			];

			sap.ui.core.Fragment.byId("Dialog", "Table").getBinding("items").filter(aFilters);
		},

		onPressContinue: function (oEvent) {
			const sPath = this.byId("Dialog").getBindingContext("model").getPath();
			const oData = this.getModel("model").getProperty(sPath);

			// Set Input Value
			oEvent.getSource().getParent().setValue(oSelectedItem.getTitle());
		},

		onSaveConfirmDialog: function(){
			const sExplanation = this.getModel("model").getProperty("/Explanation");
			
			this.onACConfirmDialog();
		},		

		onShowConfirmDialog: function () {
			this.getModel("model").setProperty("/Explanation", "");
			this.oConfirmDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.ConfirmDialog", this);
			this.oConfirmDialog.setModel(this.getModel("i18n"), "i18n");
			this.oConfirmDialog.setModel(this.getModel("model"), "model");
			this.getView().addDependent(this.oConfirmDialog);
			this.oConfirmDialog.open();
		},

		onShowDialog: function (oEvent) {
			this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.Dialog", this);
			this.oDialog.setModel(this.getModel("i18n"), "i18n");
			this.oDialog.setModel(this.getModel("model"), "model");
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();
		},

		onShowDialogDetail: function (oEvent) {
			const oControl = oEvent.getSource();

			if (!this.oDialog) {
				// Add Button To Dialog
				this.oDialog.oDialog._header.addContentRight(new sap.m.Button({
					icon: "sap-icon://add",
					tooltip: this.getResourceBundle().getText("save"),
					type: "Emphasized",
					press: this.onSaveButton.bind(this)
				}));

				// Header Visible
				this.oDialog._oSubHeader.setVisible(false);

				// Set Model To Dialog
				this.oDialog.setModel(this.getModel("model"), "model");

				// Add Dialog To View
				oEvent.getSource().addDependent(this.oDialog);
			}

			// Before Show Dialog
			this.oDialog.attachBeforeOpen((oEvent) => {
				// Read Function OR Filter => getData | onFilter
			});

			// Bind Model to Dialog
			this.oDialog.bindElement({
				path: "model>/Values"
			});

			// Bind Model w/ Path to Dialog
			const sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();

			this.oDialog.bindElement({
				model: "model",
				path: "model>" + sPath
			});

			// Set Dialog Height 
			this.oDialog.setContentHeight("250px");

			// Add Input to Dialog
			oControl.addDependent(this.oDialog);
		},

		onShowDialog: function () {
			// Default
			this.openDialog("Dialog", "serhatmercan.Dialog");

			// Default w/ Then
			this.openDialog("Dialog", "serhatmercan.Dialog").then((oDialog) => { });

			// w/ Binding Path
			this.openDialog("Dialog", "serhatmercan.Dialog").then((oDialog) => {
				oDialog.bindElement({
					path: "model>" + sPath
				});
			});

			const oTable = this.byId("Table").getTable();
			const iSelectedIndex = oTable.getSelectedIndex();
			let oBindElement = {};

			oBindElement = this.getModel().createEntry("/...Set").getPath();
			oBindElement = oTable.getContextByIndex(iSelectedIndex).getPath();

			// w/ Binding Element
			this.openDialog("Dialog", "serhatmercan.Dialog").then((oDialog) => {
				oDialog.bindElement(oBindElement);
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addTextAreaInDialog: function () {
			const oResourceBundle = this.getResourceBundle();
			const oTextAreaDialog = new Dialog({
				title: oResourceBundle.getText("title"),
				type: "Message",
				content: [
					new TextArea("TextArea", {
						liveChange: function (oEvent) {
							oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter("value").length > 0);
						},
						placeholder: oResourceBundle.getText("placeholder"),
						width: "100%"
					})
				],
				beginButton: new Button({
					text: "OK",
					type: ButtonType.Emphasized,
					enabled: false,
					press: (oEvent) => {
						const sPath = oTextAreaDialog.getParent().getBindingContext().getPath();
						const oContext = this.getModel().createEntry(sPath);
						// const sPath = oTextAreaDialog.getParent().getBindingContext().getPath();
						// const sID = oTextAreaDialog.getParent().getBindingContext().getProperty("ID");
						// https://openui5.hana.ondemand.com/topic/6c47b2b39db9404582994070ec3d57a2.html#loio6c47b2b39db9404582994070ec3d57a2
						this.addNote(this.byId("TextArea").getValue());
						this.addNote(sap.ui.getCore().byId("TextArea").getValue());
						oTextAreaDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: () => {
						oTextAreaDialog.close();
					}
				}),
				afterClose: () => {
					oTextAreaDialog.destroy();
				}
			});

			oEvent.getSource().addDependent(oTextAreaDialog);

			oTextAreaDialog.open();
		},

		openDialog: function (sDialogID, sFragmentName) {
			return new Promise((fnResolve, fnReject) => {
				const oView = this.getView();
				const oDialog = this.byId(sDialogID);
				const sContentDensityClass = this.getOwnerComponent().getContentDensityClass();

				if (!oDialog) {
					Fragment.load({
						id: oView.getId(),
						name: sFragmentName,
						controller: this
					}).then((oFragment) => {
						jQuery.sap.syncStyleClass(sContentDensityClass, oView, oFragment);
						oView.addDependent(oFragment);
						oFragment.open();
						fnResolve(oFragment);
					});
				} else {
					oDialog.open();
					fnResolve(oDialog);
				}
			});
		}

	});

});