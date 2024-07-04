sap.ui.define([
<<<<<<< HEAD
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], (MessagePopover, MessagePopoverItem, Controller, UIComponent) => {
=======
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";

	return Controller.extend("xxx.controller.BaseController", {

<<<<<<< HEAD
		getModel(sName) {
			return this.getView().getModel(sName);
		},

		getRouter() {
			return UIComponent.getRouterFor(this);
		},

		getText(sText, iNumber) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			return iNumber ? oResourceBundle.getText(sText, iNumber) : oResourceBundle.getText(sText);
		},

		setModel(oModel, sName) {
=======
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		getText: function (sText, iNumber) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			return iNumber ? oResourceBundle.getText(sText, iNumber) : oResourceBundle.getText(sText);
		},

		setModel: function (oModel, sName) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			return this.getView().setModel(oModel, sName);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

<<<<<<< HEAD
		onClearModel() {
			const oViewModel = this.getModel("model");
			const oData = {
				"ItemFound": false
=======
		onClearModel: function () {
			const oViewModel = this.getModel("model");
			const oData = {
				ItemFound: false
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			};

			oViewModel.setProperty("/", oData);
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

<<<<<<< HEAD
		onFireToShowMessages() {
=======
		onFireToShowMessages: function () {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			if (this.getOwnerComponent().getModel("message").getData().length) {
				setTimeout(() => {
					this.byId("MessagePO").firePress();
				}, 100);
			}
		},

<<<<<<< HEAD
		onShowMessages(oEvent) {
			const oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
=======
		onShowMessages: function (oEvent) {
			let oMessagesButton = oEvent.getSource();

			if (!this._oMessagePopover) {
				this._oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
<<<<<<< HEAD
=======

>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				oMessagesButton.addDependent(this._oMessagePopover);
			}

			this._oMessagePopover.toggle(oMessagesButton);
		},

		/* ==== */
		/* CRUD */
		/* ==== */

<<<<<<< HEAD
		onCallFunction(sEntity, sMethod, oModel, oURLParameters) {
=======
		onCallFunction: function (sEntity, sMethod, oModel, oURLParameters) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			return new Promise((fnResolve, fnReject) => {
				const mParameters = {
					method: sMethod,
					urlParameters: oURLParameters,
					success: fnResolve,
					error: fnReject
				};
<<<<<<< HEAD
=======

>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				oModel.callFunction(sEntity, mParameters);
			});
		},

<<<<<<< HEAD
		onCreate(sSet, oData, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onCreate: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, mParameters);
			});
		},

<<<<<<< HEAD
		onDelete(sSet, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onDelete: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, mParameters);
			});
		},

<<<<<<< HEAD
		onRead(sSet, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onRead: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

<<<<<<< HEAD
		onReadAssociation(sSet, oExpand, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onReadAssociation: function (sSet, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

<<<<<<< HEAD
		onReadExpanded(sSet, aFilters, oExpand, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onReadExpanded: function (sSet, aFilters, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

<<<<<<< HEAD
		onReadQuery(sSet, aFilters, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onReadQuery: function (sSet, aFilters, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

<<<<<<< HEAD
		onSubmitChanges(oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onSubmitChanges: function (oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.submitChanges(mParameters);
			});
		},

<<<<<<< HEAD
		onUpdate(sSet, oData, oModel) {
			return new Promise((fnSuccess, fnReject) => {
=======
		onUpdate: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.update(sSet, oData, mParameters);
			});
		}

	});

});