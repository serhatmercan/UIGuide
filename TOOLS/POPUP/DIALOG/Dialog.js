sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, Fragment) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Values: {
					Value: {}
				}
			});

			this.setModel(oModel, "model");

		},

		showDialog: function (oEvent) {

			// var oControl = oEvent.getSource();

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.Dialog", this);

				/*
				// Add Button to Dialog
				this._oDialog._oDialog._header.addContentRight(new sap.m.Button({
					icon: "sap-icon://add",
					type: "Emphasized",
					tooltip: this._oResourceBundle.getText("createSample"),
					press: this.onSaveButton.bind(this)
				}));
				
				// Dialog Object's Visible
				this._oDialog._oSubHeader.setVisible(false);
				*/

				// Set Model to Dialog
				// this._oDialog.setModel(this.getModel("model"), "model");

				this.getView().addDependent(this._oDialog);
				// oEvent.getSource().addDependent(this._oDialog);
			}

			/*
			// Before Show Dialog
			this._oDialog.attachBeforeOpen(function() {
				// Read Function OR Filter => getData | onFilter
			}.bind(this));

			// Bind Model to Dialog
			this._oDialog.bindElement({
				path: "model>/Values"
			});
				
			// Bind Model w/ Path to Dialog
			var sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
			this._oDialog.bindElement({
				model: "viewModel",
				path: "model>" + sPath
			});
			
			// Set Dialog Height 
			this._oDialog.setContentHeight("250px");
			
			// Add Input to Dialog
			oControl.addDependent(this._oDialog);
				
			*/

			this._oDialog.open();

		},

		onPressContinue: function () {
			var sPath = this.byId("idDialog").getBindingContext("model").getPath(),
				oData = this.getModel("model").getProperty(sPath);

			// Set Input Value
			// oEvent.getSource().getParent().setValue(oSelectedItem.getTitle());
		},

		onAfterCloseDialog: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
			this.clearModel();
		},

		onPressCancel: function () {
			this._oDialog.close();
		},

		onFilterDialogTable: function () {
			// this._oDialog = sap.ui.xmlfragment("idDialog","com.serhatmercan.fragment.Dialog", this);

			var aFilters = [
				new Filter("Key", FilterOperator.EQ, "A"),
				new Filter("Value", FilterOperator.EQ, "X")
			];

			sap.ui.core.Fragment.byId("idDialog", "idTable").getBinding("items").filter(aFilters);
		},

		addTextAreaInDialog: function () {

			var that = this;

			var oTextAreaDialog = new Dialog({
				title: this.getResourceBundle().getText("dialogTitle"),
				type: "Message",
				content: [
					new TextArea("idTextArea", {
						liveChange: function (oEvent) {
							var sText = oEvent.getParameter("value"),
								oParent = oEvent.getSource().getParent();
							oParent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Add Text"
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "OK",
					enabled: false,
					press: function (oEvent) {
						var sText = sap.ui.getCore().byId("idTextArea").getValue(),
							sPath = oTextAreaDialog.getParent().getBindingContext().getPath(),
							oContext = this.getView().getModel().createEntry(sPath);
						// var sPath = oTextAreaDialog.getParent().getBindingContext().getPath();
						// var sCarrid = oTextAreaDialog.getParent().getBindingContext().getProperty().Carrid;
						// https://openui5.hana.ondemand.com/topic/6c47b2b39db9404582994070ec3d57a2.html#loio6c47b2b39db9404582994070ec3d57a2
						this.addNote(sText);
						oTextAreaDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function () {
						oTextAreaDialog.close();
					}
				}),
				afterClose: function () {
					oTextAreaDialog.destroy();
				}
			});

			oEvent.getSource().addDependent(oTextAreaDialog);

			oTextAreaDialog.open();

		},

		onShowDialog: function () {
			// Default
			this.onOpenDialog("idDialog", "serhatmercan.Dialog");

			// Default w/ Then
			this.onOpenDialog("idDialog", "serhatmercan.Dialog").then((oDialog) => {});

			// w/ Binding Path
			this.onOpenDialog("idDialog", "serhatmercan.Dialog").then((oDialog) => {
				oDialog.bindElement({
					path: "viewModel>" + sPath
				});
			});

			const oTable = this.byId("idTable").getTable();
			const iSelectedIndex = oTable.getSelectedIndex();
			let oBindElement = {};

			oBindElement = this.getModel().createEntry("/...Set").getPath();
			oBindElement = oTable.getContextByIndex(iSelectedIndex).getPath();

			// w/ Binding Element
			this.onOpenDialog("idDialog", "serhatmercan.Dialog").then((oDialog) => {
				oDialog.bindElement(oBindElement);
			});
		},

		onOpenDialog: function (sDialogId, sFragmentName) {
			return new Promise((fnResolve, fnReject) => {
				var oView = this.getView(),
					oDialog = this.byId(sDialogId),
					sContentDensityClass = this.getOwnerComponent().getContentDensityClass();

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
		},

		onCloseDialog: function (oEvent) {
			this.onClearMessages();
			oEvent.getSource().getParent().close();
		}

	});

});