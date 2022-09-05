sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.NavigationList", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({					
					Items: [],
					Value: ""
			}), "model");
		},

        /* ============== */
        /* Event Handlers */
        /* ============== */

		onCollapseExpand: function(oEvent){
			const oNavigationList = this.byId("NavigationList");

			oNavigationList.setExpanded(!oNavigationList.getExpanded());
		}

        /* ================ */
        /* Internal Methods */
        /* ================ */

    });

});