sap.ui.define([
    "./BaseController",
    "com/sm/application/model/formatter"
], function (BaseController, formatter) {
    "use strict";

    return BaseController.extend("com.sm.application.controller.Object", {

        formatter: formatter,

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit: function () {
            this.getRouter().getRoute("Object").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onACInformationItemDialog: function () {
            this.oInformationItemDialog.close();
            this.oInformationItemDialog.destroy();
            this.oInformationItemDialog = null;
        },

        onAddInformationItem: function () {
            const oInformationItemSF = this.byId("InformationItemSF");
            const oInformationItem = oInformationItemSF.getBindingContext().getProperty();
            const oResourceBundle = this.getResourceBundle();
            const oViewModel = this.getModel("model");
            const aInformationItems = oViewModel.getProperty("/InformationItems");

            if (oInformationItemSF.check().length) {
                MessageToast.show(oResourceBundle.getText("checkMandatoryFields"));
                return;
            }

            aInformationItems.push(oInformationItem);
        },

        onProcess: function (sType, oEvent) {
            const oData = this.getModel().getProperty(this.getView().getBindingContext().getPath());

            delete oData.__metadata;
        },

        onShowInformationItem: async function (sType, oEvent) {
            const oModel = this.getModel();
            const oViewModel = this.getModel("model");
            const sPath = oModel.createEntry("/InformationItemSet").getPath();
            let oInformationItemData = {};
            let sBindingPath = "";

            this.oInformationItemDialog = sap.ui.xmlfragment(this.getView().getId(), "com.sm.application.fragment.dialog.InformationItem", this);
            this.oInformationItemDialog.setModel(this.getModel("i18n"), "i18n");
            this.oInformationItemDialog.setModel(oViewModel, "model");

            this.getView().addDependent(this.oInformationItemDialog);

            this.oInformationItemDialog.bindElement(sPath);

            if (sType === "U") {
                sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
                oInformationItemData = oViewModel.getProperty(sBindingPath);

                oModel.setProperty(sPath + "/Value", oInformationItemData.Value);
            }

            this.oInformationItemDialog.open();
        },


        /* ================ */
        /* Internal Methods */
        /* ================ */

        patternMatched: function () {
            this.getOwnerComponent().getModel().metadataLoaded().then(async () => {
                this.getView().bindElement(this.getModel().createEntry("/...Set").getPath());
            });
        }

    });
});