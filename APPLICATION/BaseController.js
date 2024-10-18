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

		onCreate(sSet, oData, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, mParameters);
			});
		},

		onDelete(sSet, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, mParameters);
			});
		},

		onRead(sSet, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadAssociation(sSet, oExpand, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadExpanded(sSet, aFilters, oExpand, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadQuery(sSet, aFilters, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onReadQueryAsyncSorters(sSet, aFilters, bAsync, aSorters, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					async: bAsync,
					filters: aFilters,
					sorters: aSorters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		onSubmitChanges(oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.submitChanges(mParameters);
			});
		},

		onUpdate(sSet, oData, oModel) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.update(sSet, oData, mParameters);
			});
		}

	});

});