sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("objectPageLayout").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			let oNewEntry;

			if (oEvent.getParameter("arguments").id) {
				this._sId = oEvent.getParameter("arguments").id;
			}

			if (oEvent.getParameter("arguments").value) {
				this._sValue = oEvent.getParameter("arguments").value;
			}

			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				if (!this._sOrderNo) {
					oNewEntry = this.getModel().createEntry("/...Set");
					this.getView().bindElement(oNewEntry.sPath);
				} else {
					this.getView().bindElement(this._getRequestPath());
				}

				setTimeout(() => {
					const oOPL = this.byId("OPL"); // preserveHeaderStateOnScroll="true"

					oOPL.setSelectedSection(oOPL.getSections()[0].getId());
					oOPL._handleExpandButtonPress();
					oOPL._scrollTo(0);
				}, 200);
			}.bind(this));
		},

		_getRequestPath: function () {
			return this.getModel().createKey("/...Set", {
				Id: this._sId,
				Value: this._sValue
			});
		},

		_setInitialSubSection: function () {
			this.byId("OPL").setSelectedSection(this.byId("OPS").getId());
		},

		_triggerExpandButton: function () {
			this.byId("OPL")._handleExpandButtonPress();
		}

	});

});