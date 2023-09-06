sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/richtexteditor/library",
	"sap/ui/richtexteditor/RichTextEditor"
], function (BaseController, JSONModel, library, RichTextEditor) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Edit: true,
					Items: [],
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addRTEToSmartForm: function (sSmartFormID) {
			if (!this.byId("MessageRTE")) {
				this.byId(sSmartFormID).getGroups()[0].getGroupElements()[0].addElement(
					new RichTextEditor("MessageRTE", {
						editorType: library.EditorType.TinyMCE6,
						height: "10rem",
						width: "100%",
						customToolbar: true,
						required: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true
					})
				);
			}
		},

		getValue: function () {
			const sMessageX = sap.ui.getCore().byId("MessageRTE").getValue();
			const sMessageY = this.byId("MessageRTE").getValue();
		},

		patternMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(() => {
				const oMessageRTE = sap.ui.getCore().byId("MessageRTE");

				if (oMessageRTE) {
					oMessageRTE.setVisible(false);
				} else {
					this.addRTEToSmartForm("RTESF");
				}
			});
		},

		setValue: function () {
			sap.ui.getCore().byId("MessageRTE").setValue("");
			this.byId("MessageRTE").setValue("");
		}

	});

});