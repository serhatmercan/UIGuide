sap.ui.define([
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], (MessagePopover, MessagePopoverItem, Controller, UIComponent) => {
	"use strict";

	const createPromise = (oModelMethod, sSet, oData, oModel) => new Promise((fnResolve, fnReject) => {
		const mParameters = {
			success: fnResolve,
			error: fnReject
		};
		oModelMethod.call(oModel, sSet, oData, mParameters);
	});

	return Controller.extend("xxx.controller.BaseController", {

		getModel(sName) {
			return this.getView().getModel(sName);
		},

		getRouter() {
			return UIComponent.getRouterFor(this);
		},

		getText(sText, iNumber) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			return oResourceBundle.getText(sText, iNumber || undefined);
		},

		setModel(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onClearModel() {
			const oViewModel = this.getModel("model");

			oViewModel.setProperty("/", {
				"ItemFound": false
			});

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		onFireToShowMessages() {
			const oMessageModel = this.getOwnerComponent().getModel("message");

			if (oMessageModel.getData().length) {
				setTimeout(() => this.byId("MessagePO").firePress(), 100);
			}
		},

		onShowMessages(oEvent) {
			const oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
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

		onCallFunction(sEntity, sMethod, oModel, oURLParameters) {
			return createPromise(oModel.callFunction, sEntity, { method: sMethod, urlParameters: oURLParameters }, oModel);
		},

		onCreate(sSet, oData, oModel) {
			return createPromise(oModel.create, sSet, oData, oModel);
		},

		onDelete(sSet, oModel) {
			return createPromise(oModel.remove, sSet, undefined, oModel);
		},

		onRead(sSet, oModel) {
			return createPromise(oModel.read, sSet, undefined, oModel);
		},

		onReadAssociation(sSet, oExpand, oModel) {
			return createPromise(oModel.read, sSet, { urlParameters: oExpand }, oModel);
		},

		onReadExpanded(sSet, aFilters, oExpand, oModel) {
			return createPromise(oModel.read, sSet, { filters: aFilters, urlParameters: oExpand }, oModel);
		},

		onReadQuery(sSet, aFilters, oModel) {
			return createPromise(oModel.read, sSet, { filters: aFilters }, oModel);
		},

		onSubmitChanges(oModel) {
			return createPromise(oModel.submitChanges, undefined, undefined, oModel);
		},

		onUpdate(sSet, oData, oModel) {
			return createPromise(oModel.update, sSet, oData, oModel);
		}

	});

});
