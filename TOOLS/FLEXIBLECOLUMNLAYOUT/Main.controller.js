sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onClearModel: function () {
			const oViewModel = this.getModel("model");
			const oData = {
				ActionButtonsInfo: {
					EndColumn: {
						FullScreen: false
					},
					MidColumn: {
						FullScreen: false,
						Toolbar: true
					}
				},
				Details: [],
				DetailXs: [],
				ID: "",
				Key: "",
				Layout: "OneColumn",
				PreviousLayout: ""
			};

			oViewModel.setProperty("/", oData);
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		onGoToDetail: function (oEvent) {
			const oData = oEvent.getSource().getBindingContext();
			const oModel = this.getModel("model");

			if (!oData) {
				return;
			}

			oModel.setProperty("/Details", []);
			oModel.setProperty("/Layout", "TwoColumnsMidExpanded");

			this.getRouter().navTo("Detail", {
				ID: oData.getProperty("ID")
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			this.onClearModel();
		}

	});

});