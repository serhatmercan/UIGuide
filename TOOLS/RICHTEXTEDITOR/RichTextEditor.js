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
						value: "{Mesaj}",
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

		patternMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(() => {
				this.addRTEToSmartForm("RTESF");
			});
		}

	});

});