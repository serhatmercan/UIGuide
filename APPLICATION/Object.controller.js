sap.ui.define([
    "./BaseController",
    "xxx/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (BaseController, formatter, MessageBox, MessageToast) => {
    "use strict";

    return BaseController.extend("xxx.controller.Object", {

        formatter,

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            this.getRouter().getRoute("Object").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onACInformationItemDialog() {
            this.oInformationItemDialog.close();
            this.oInformationItemDialog.destroy();
            this.oInformationItemDialog = null;
        },

        onAddInformationItem() {
            const oInformationItemSF = this.byId("InformationItemSF");
            const oInformationItem = oInformationItemSF.getBindingContext().getProperty();
            const oViewModel = this.getModel("model");
            const aInformationItems = oViewModel.getProperty("/InformationItems");

            if (oInformationItemSF.check().length) {
                MessageToast.show(this.getText("checkMandatoryFields"));
                return;
            }

            aInformationItems.push(oInformationItem);
        },

        onDeleteInformationItem(oEvent) {
            const sPath = oEvent.getSource().getBindingContext("model").getPath();
            const iIndex = parseInt(sPath.split("/").pop(), 10);
            const oViewModel = this.getModel("model");
            const aInformationItems = oViewModel.getProperty("/InformationItems");
            const oMBAction = MessageBox.Action;

            MessageBox.confirm(this.getText("checkInformationItem"), {
                actions: [oMBAction.OK, oMBAction.CANCEL],
                emphasizedAction: oMBAction.OK,
                styleClass: this.getOwnerComponent().getContentDensityClass(),
                onClose: sAction => {
                    if (sAction === oMBAction.OK) {
                        aInformationItems.splice(iIndex, 1);
                        oViewModel.setProperty("/InformationItems", aInformationItems);
                    }
                }
            });
        },

        onProcess(sType, oEvent) {
            const oData = this.getModel().getProperty(this.getView().getBindingContext().getPath());

            if (this.byId("InformationSF").check().length) {
                MessageToast.show(this.getText("checkMandatoryFields"));
                return;
            }

            delete oData.__metadata;
            delete oData.Items;
        },

        async onShowInformationItem(sType, oEvent) {
            const oModel = this.getModel();
            const oViewModel = this.getModel("model");
            const sPath = oModel.createEntry("/InformationItemSet").getPath();
            let oInformationItemData = {};
            let sBindingPath = "";

            this.oInformationItemDialog = await this.loadFragment({
                name: "com.sm.application.fragments.dialog.InformationItem",
                controller: this
            });
            this.oInformationItemDialog.setModel(this.getModel("i18n"), "i18n");
            this.oInformationItemDialog.setModel(oViewModel, "model");

            this.getView().addDependent(this.oInformationItemDialog);

            this.oInformationItemDialog.bindElement(sPath);

            if (sType === "U") {
                sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
                oInformationItemData = oViewModel.getProperty(sBindingPath);

                oModel.setProperty(`${sPath}/Value`, oInformationItemData.Value);
            }

            this.oInformationItemDialog.open();
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        async patternMatched() {
            const oModel = this.getModel();
            const oViewModel = this.getModel("model");
            const sID = oViewModel.getProperty("/ID");
            const sMode = oViewModel.getProperty("/Mode");

            this.refreshView();

            await this.getOwnerComponent().getModel().metadataLoaded();

            let sPath = "";
            let oExpand = {};

            if (sMode === "C") {
                sPath = oModel.createEntry("/...Set").getPath();
                this.getView().bindElement(sPath);
                oModel.setProperty(`${sPath}/Value`, "0");
            } else if (sMode === "U") {
                sPath = oModel.createKey("/...Set", {
                    ID: sID
                });
                oExpand = {
                    "$expand": "Documents,InformationItems"
                };

                try {
                    const oData = await this.onReadAssociation(sPath, oExpand, oModel);
                    this.setViewData(sPath, oData, oViewModel);
                } catch (oError) {
                    // Handle Error
                } finally {
                    this.onFireToShowMessages();
                }
            }
        },

        refreshView() {
            const oView = this.getView();
            const oBindingContext = oView.getBindingContext();
            const oModel = this.getModel();

            if (oBindingContext) {
                oView.unbindElement();
                oModel.deleteCreatedEntry(oBindingContext);
                oModel.resetChanges();
                oModel.refresh(true, true);
            }

            sap.ui.getCore().getMessageManager().removeAllMessages();
        },

        setViewData(sPath, oData, oViewModel) {
            this.getView().bindElement({
                path: sPath
            });
            oViewModel.setProperty("/Documents", oData.Documents.results);
            oViewModel.setProperty("/InformationItems", oData.InformationItems.results);
        }

    });
});
