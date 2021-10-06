sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"serhatmercan/Util"
], function (BaseController, JSONModel, Util) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			const sID = Util.getID();
		}

	});

});