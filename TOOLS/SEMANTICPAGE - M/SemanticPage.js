sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"	
], function (BaseController, JSONModel) {
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

        onNavBack: function(){
            const sPreviousHash = History.getInstance().getPreviousHash();
			const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
        }

	});

});