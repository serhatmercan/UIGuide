sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/Fragment",
	"sap/ui/core/Messaging",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], (MessageToast, MessagePopover, MessagePopoverItem, Fragment, Messaging, Controller, UIComponent, History) => {
	"use strict";

	const createPromise = (oModelMethod, sSet, oData, oModel) => new Promise((fnResolve, fnReject) => {
		const mParameters = {
			success: fnResolve,
			error: fnReject
		};
		oModelMethod.call(oModel, sSet, oData, mParameters);
	});

	const mCollectionConfig = {
		Items: []
	};

	return Controller.extend("xxx.controller.BaseController", {

		addModelCollectionItem(sCollectionName, oItem) {
			const oViewModel = this.getModel("model");
			const aItems = [...(oViewModel.getProperty(`/${sCollectionName}`) || []), oItem];

			this.setModelCollection(sCollectionName, aItems);
		},

		createDialog(sFragmentName) {
			return Fragment.load({
				id: this.getView().getId(),
				name: `xxx.fragments.dialog.${sFragmentName}`,
				controller: this
			}).then(oFragment => {
				this.getView().addDependent(oFragment);
				return oFragment;
			});
		},

		getCollectionIndexFromEvent(oEvent) {
			const oListItem = oEvent.getParameter("listItem");
			const sPath = oListItem?.getBindingContext("model")?.getPath() || oListItem?.getBindingContextPath("model");
			const iIndex = Number(sPath?.split("/").pop());

			return Number.isInteger(iIndex) ? iIndex : -1;
		},

		getErrorMessage(oError) {
			return new DOMParser()
				.parseFromString(oError?.responseText || "", "text/xml")
				?.querySelector("message")
				?.textContent || "";
		},

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

		removeModelCollectionItem(sCollectionName, oEvent, sMessageKey) {
			const iIndex = this.getCollectionIndexFromEvent(oEvent);
			const oViewModel = this.getModel("model");
			const aItems = [...(oViewModel.getProperty(`/${sCollectionName}`) || [])];

			if (iIndex < 0 || iIndex >= aItems.length) {
				MessageToast.show(this.getText(sMessageKey));
				return;
			}

			aItems.splice(iIndex, 1);

			this.setModelCollection(sCollectionName, aItems);
		},


		setModel(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		setModelCollection(sCollectionName, aItems) {
			const oCollectionConfig = mCollectionConfig[sCollectionName];
			const oViewModel = this.getModel("model");
			const aSafeItems = Array.isArray(aItems) ? aItems : [];

			if (!oCollectionConfig) {
				return;
			}

			oViewModel.setProperty(`/${sCollectionName}`, aSafeItems);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onClearModel() {
			const oViewModel = this.getModel("model");

			oViewModel.setProperty("/", {
				"ItemFound": false
			});

			Messaging.removeAllMessages();
		},

		onFireToShowMessages() {
			const oMessageModel = this.getOwnerComponent().getModel("message");

			if (oMessageModel.getData().length) {
				setTimeout(() => this.byId("MessagePO").firePress(), 100);
			}
		},

		onNavBack() {
			const sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("Main", {}, true);
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

		onReadQueryParameters(sSet, aFilters, oModel, oURLParameters) {
			return new Promise((fnSuccess, fnReject) => {
				const mParameters = {
					filters: aFilters,
					urlParameters: oURLParameters,
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