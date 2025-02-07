sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageBox, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			this.getView().setModel(new JSONModel({
				Document: {
					FunctionalLocation: "",
					EquipmentNo: "",
					NotificationNo: "",
					OrderNo: ""
				}
			}), "model");
		},

		onACDocumentDialog() {
			this.oDocumentDialog.close();
			this.oDocumentDialog.destroy();
			this.oDocumentDialog = null;
			this.oAttach = null;
		},

		onSaveDocument() {
			const oMBAction = MessageBox.Action;

			MessageBox.confirm(this.getText("infoDMS"), {
				actions: [oMBAction.OK, oMBAction.CANCEL],
				emphasizedAction: oMBAction.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: sAction => {
					if (sAction === oMBAction.OK) {
						this.oAttach.save(true);
						this.onACDocumentDialog();
					}
				}
			});
		},

		async onShowDocument(sType) {
			const oDocument = this.getModel("model").getProperty("/Document");
			let sObjectKey = "";
			let sObjectType = "";
			let sTitle = "";

			if (!oDocument) {
				MessageToast.show(this.getText("infoChooseRow"));
				return;
			}

			switch (sType) {
				case "E":
					sObjectKey = oDocument.EquipmentNo;
					sObjectType = "EQUI";
					sTitle = "equipmentDMS";
					break;
				case "F":
					sObjectKey = oDocument.FunctionalLocation;
					sObjectType = "IFLOT";
					sTitle = "functLocDMS";
					break;
				case "N":
					sObjectKey = oDocument.NotificationNo;
					sObjectType = "PMQMEL";
					sTitle = "notificationDMS";
					break;
				case "O":
					sObjectKey = oDocument.OrderNo;
					sObjectType = "PMAUFK";
					sTitle = "orderDMS";
					break;
				default:
					MessageToast.show(this.getText("errorDMSProcess"));
					return;
			}

			if (!sObjectKey) {
				MessageToast.show(this.getText("errorDMSProcess"));
				return;
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();

			try {
				const oAttachmentComponent = await this.getOwnerComponent().createComponent({
					usage: "attachmentReuseComponent",
					settings: {
						mode: "C",
						documentType: "YP1",
						objectKey: sObjectKey,
						objectType: sObjectType
					}
				});

				this.oAttach = oAttachmentComponent;
				this.byId("attachmentComponentContainer").setComponent(oAttachmentComponent);

				const aAttributes = oAttachmentComponent.getAttributes();
				aAttributes._VisibleActions.ADDURL = false;

				oAttachmentComponent.setAttributes(aAttributes);

				this.oDocumentDialog = await this.loadFragment({
					name: "com.serhatmercan.Document",
					controller: this
				});

				this.getView().addDependent(this.oDocumentDialog);

				this.oDocumentDialog.setTitle(this.getText(sTitle));
				this.oDocumentDialog.open();
			} catch (oError) {
				MessageToast.show(this.getText("errorDMSProcess"));
			}
		}

	});
});
