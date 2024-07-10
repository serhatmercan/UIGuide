sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Dialog",
	"sap/m/TextArea",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Button, ButtonType, Dialog, TextArea, Fragment, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Values: {
					Value: {}
				}
			}), "model");
		},

		onExit() {
			this.destroyDialog(this.oConfirmDialog);
			this.destroyDialog(this.oDialog);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACConfirmDialog() {
			this.oConfirmDialog.close();
		},

		onACDialog() {
			this.oDialog.close();
		},

		onEHDialog(oEvent) {
			oEvent.reject();
		},

		onFilterDialogTable() {
			this.createDialog("Dialog", "com.serhatmercan.fragment.Dialog").then(oDialog => {
				const aFilters = [
					new Filter("Key", FilterOperator.EQ, "A"),
					new Filter("Value", FilterOperator.EQ, "X")
				];

				Fragment.byId("Dialog", "Table").getBinding("items").filter(aFilters);
			});
		},

		onGetToolWithID() {
			return Fragment.byId("Dialog", "Table");
		},

		onPressContinue(oEvent) {
			const sPath = this.byId("Dialog").getBindingContext("model").getPath();
			const oData = this.getModel("model").getProperty(sPath);

			oEvent.getSource().getParent().setValue(oData.Title);
		},

		onSaveConfirmDialog() {
			const sExplanation = this.getModel("model").getProperty("/Explanation");

			this.onACConfirmDialog();
		},

		onShowConfirmDialog() {
			this.showDialog("ConfirmDialog", "com.serhatmercan.fragment.ConfirmDialog");
		},

		onShowDialog() {
			this.showDialog("Dialog", "com.serhatmercan.fragment.Dialog");
		},

		onShowSFDialog(sType, oEvent) {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const sPath = oModel.createEntry("/...Set").getPath();

			this.createDialog("Dialog", "com.sm.application.fragments.dialog.Dialog").then(oDialog => {
				oDialog.bindElement(sPath);

				if (sType === "U") {
					const sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
					const oData = oViewModel.getProperty(sBindingPath);

					oModel.setProperty(`${sPath}/Value`, oData.Value);
				}

				oDialog.open();
			});
		},

		onShowDialogDetail(oEvent) {
			const oControl = oEvent.getSource();
			const sDialogPath = this.getModel().createEntry("/...Set").getPath();
			const oKey = this.getModel().createKey("/...Set", { ID: "X" });

			this.createDialog("Dialog", "com.serhatmercan.fragment.Dialog").then(oDialog => {
				oDialog._header.addContentRight(new Button({
					icon: "sap-icon://add",
					tooltip: this.getText("save"),
					type: "Emphasized",
					press: this.onSaveButton.bind(this)
				}));

				oDialog._oSubHeader.setVisible(false);

				oDialog.setModel(this.getModel("model"), "model");

				oControl.addDependent(oDialog);

				oDialog.attachBeforeOpen(() => { });
				oDialog.setEscapeHandler(oEvent => oEvent.reject());
				oDialog.bindElement(sDialogPath);
				oDialog.bindElement({ path: "model>/Values" });

				const sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();

				oDialog.bindElement({ model: "model", path: `model>${sPath}` });
				oDialog.bindElement({ path: oKey });
				oDialog.setContentHeight("250px");

				oControl.addDependent(oDialog);

				oDialog.open();
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addTextAreaInDialog() {
			const oTextAreaDialog = new Dialog({
				title: this.getText("title"),
				type: "Message",
				content: [
					new TextArea("TextArea", {
						liveChange: oEvent => {
							oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter("value").length > 0);
						},
						placeholder: this.getText("placeholder"),
						width: "100%"
					})
				],
				beginButton: new Button({
					text: "OK",
					type: ButtonType.Emphasized,
					enabled: false,
					press: () => {
						const oTextArea = sap.ui.getCore().byId("TextArea");

						this.addNote(oTextArea.getValue());

						oTextArea.setValue("");
						oTextAreaDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: () => {
						sap.ui.getCore().byId("TextArea").setValue("");
						oTextAreaDialog.close();
					}
				}),
				afterClose: () => {
					oTextAreaDialog.destroy();
				}
			});

			this.getView().addDependent(oTextAreaDialog);
			oTextAreaDialog.open();
		},

		createDialog(sDialogID, sFragmentName) {
			return new Promise((fnResolve) => {
				const oView = this.getView();
				const oDialog = this.byId(sDialogID);
				const sContentDensityClass = this.getOwnerComponent().getContentDensityClass();

				if (!oDialog) {
					Fragment.load({
						id: oView.getId(),
						name: sFragmentName,
						controller: this
					}).then(oFragment => {
						jQuery.sap.syncStyleClass(sContentDensityClass, oView, oFragment);
						oView.addDependent(oFragment);
						fnResolve(oFragment);
					});
				} else {
					fnResolve(oDialog);
				}
			});
		},

		destroyDialog(oDialog) {
			if (oDialog) {
				oDialog.destroy();
				oDialog = null;
			}
		},

		showDialog(sDialogID, sFragmentName) {
			this.createDialog(sDialogID, sFragmentName).then(oDialog => oDialog.open());
		}

	});
});