sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("xxx.controller.BaseController", {

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onShowMessages: function (oEvent) {
			let oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});

				oMessagesButton.addDependent(this._oMessagePopover);
			}

			this._oMessagePopover.toggle(oMessagesButton);
		},

		/* ==== */
		/* CRUD */
		/* ==== */

		onCallFunction: function (sEntity, sMethod, oModel, oURLParameters) {
			return new Promise((fnResolve, fnReject) => {
				const mParameters = {
					method: sMethod,
					urlParameters: oURLParameters,
					success: fnResolve,
					error: fnReject
				};

				oModel.callFunction(sEntity, mParameters);
			});
		},

		onCreate: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, mParameters);
			});
		},

		onDelete: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, mParameters);
			});
		},

		onRead: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadAssociation: function (sSet, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadExpanded: function (sSet, aFilters, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadQuery: function (sSet, aFilters, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onSubmitChanges: function (oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.submitChanges(mParameters);
			});
		},

		onUpdate: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.update(sSet, oData, mParameters);
			});
		}

	});

});