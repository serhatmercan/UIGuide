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

		_onObjectMatched: function () {},

	});

});