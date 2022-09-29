sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Items: [],
					Value: ""
				}), "model"
			);
		},

		onGenerateFB: function () {
			const oFlexBox = this.byId("FlexBox");

			this.getModel("model").getProperty("/Items").forEach(oSkill => {
				oFlexBox.addItem(new sap.m.GenericTag({
					design: "StatusIconHidden",
					text: oSkill.Skill,
					status: oSkill.Statu
				}));
			});
		}

	});

});