sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"com/serhatmercan/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter: formatter,

		onInit: function () {

			this._aPaths = [];
			this.createTile("/screens");

		},

		createTile: function (sPath) {

			var oTileContainer = this.byId("idTileContainer"),
				oStandardTile = new sap.m.StandardTile({
					title: {
						path: "menu>title",
						formatter: this.formatter.getActionText.bind(this)
					},
					press: this.onPressTile.bind(this),
					icon: "{menu>icon}",
					number: "{menu>number}",
					info: {
						path: "menu>info",
						formatter: this.formatter.getActionText.bind(this)
					},
					infoState: "Error"
				});

			oTileContainer.unbindAggregation();
			oTileContainer.bindAggregation("tiles", "menu>" + sPath, oStandardTile);

		},

		onPressTile: function (oEvent) {

			var oMenuData = oEvent.getSource().getBindingContext("menu").getObject();

			switch (oMenuData.type) {
			case "menu":

				var sPath = oEvent.getSource().getBindingContext("menu").getPath(),
					aSplit = sPath.split("/"),
					sBackPath;

				aSplit.splice(aSplit.length - 1);

				if (oMenuData.screens) {
					sBackPath = aSplit.join("/");
					this._aPaths.push(sBackPath);
					this.createTile(sPath + "/screens");
				}

				break;

			case "view":
				this.getRouter().navTo(oMenuData.view);
				break;
			}

		},

		onNavBack: function () {

			var sBackPath;

			if (this._aPaths.length > 0) {
				sBackPath = this._aPaths[this._aPaths.length - 1];
				this.createTile(sBackPath);
				this._aPaths.pop();
			} else {
				this._navBack();
			}

		},

		_navBack: function () {
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
		}

	});

});