sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oViewModel, "model");

			this.getRouter().getRoute("objectPageLayout").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		async patternMatched(oEvent) {
			const { id: sID, value: sValue } = oEvent.getParameter("arguments");

			this.sID = sID;
			this.sValue = sValue;

			await this.getOwnerComponent().getModel().metadataLoaded();

			if (!this.sID) {
				const oNewEntry = this.getModel().createEntry("/...Set");
				this.getView().bindElement(oNewEntry.sPath);
			} else {
				this.getView().bindElement(this.getRequestPath());
			}

			setTimeout(() => {
				const oOPL = this.byId("OPL"); // preserveHeaderStateOnScroll="true"

				if (!oOPL) return;

				oOPL.setSelectedSection(oOPL.getSections()[0]?.getId());
				oOPL._handleExpandButtonPress();
				oOPL._scrollTo(0);
			}, 200);
		},

		getRequestPath() {
			return this.getModel().createKey("/...Set", {
				ID: this.sID,
				Value: this.sValue
			});
		},

		setInitialSubSection() {
			this.byId("OPL").setSelectedSection(this.byId("OPS").getId());
		},

		triggerExpandButton() {
			this.byId("OPL")._handleExpandButtonPress();
		}

	});

});