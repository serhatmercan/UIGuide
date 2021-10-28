	sap.ui.define([], function () {
		"use strict";
		return sap.ui.controller("com.sun.serhatmercan.ext.controller.ListReportExt", {

			onBeforeRebindTableExtension: function (oEvent) {
				const oBindingParams = oEvent.getParameter("bindingParams");
				const aNTFs = location.href.split("ID=").slice(1);

				if (oBindingParams) {
					aNTFs.forEach(sID => oBindingParams.filters.push(new Filter("ID", FilterOperator.EQ, parseInt(sID))));
				}
			},

			onGoToDetail: function () {}

		});
	});