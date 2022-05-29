sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter"
], function (BaseController, JSONModel, Sorter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Items: [],
					Value: ""
				}), "model"
			);
		},        

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onConfirm: function (oEvent) {
			const oParams = oEvent.getParameters();							
			const aSorters = [
                new Sorter(oParams.sortItem.getKey(), oParams.sortDescending)
            ];

			this.byId("Table").getBinding("items").sort(aSorters);
		},

        onShowSort: function(){
            this.oSortDialog = sap.ui.xmlfragment("com.serhatmercan.fragment.ViewSettingsDialog", this);
			this.getView().addDependent(this.oSortDialog);			
			this.oSortDialog.open();
        }

	});

});