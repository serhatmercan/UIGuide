/*global location */
sap.ui.define([
	"serhatmercan/controller/BaseController",
	"serhatmercan/model/models",
	"serhatmercan/model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, models, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("spro.sm.people.controller.CreateCollectivePeople", {

		formatter: formatter,

		onInit: function () {},

		onExit: function () {
			this.getModel().resetChanges();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		_onObjectMatched: function () {
			this._clearView();

			this.getModel().setSizeLimit(1000);

			this.getModel().metadataLoaded().then(function () {
				const oNewEntry = this.getModel().createEntry("/...Set");
				this.byId("idSF").bindElement(oNewEntry.sPath);
			}.bind(this));
		},

		_bindView: function () {
			const oView = this.getView();
			const oViewModel = this.getModel("viewModel");
			const oTable = this.byId("idTable");
			const oExpand = {
				"$expand": "to_Header,to_Items"
			};

			this._sPath = oEvent.getSource().getParent().getBindingContext("viewModel").getPath();

			oViewModel.setProperty(this._sPath + "/Data", sMaterial);

			oView.bindElement({
				path: sPath,
				parameters: oExpand,
				events: {
					dataReceived: this._onDataReceived.bind(this)
				}
			});

			oTable.rebindTable();
		},

		_clearView: function () {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		_onDataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		}

	});

});