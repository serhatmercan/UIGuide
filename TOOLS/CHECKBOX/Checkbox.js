sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

<<<<<<< HEAD
		onSelectCB: function(oEvent){
			const sValue = oEvent.getSource().getSelected();
		},

=======
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
		getValue: function () {
			sValue = this.byId("CheckBox").getSelected();
		}

	});

});