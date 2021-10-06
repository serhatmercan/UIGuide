sap.ui.controller("com.serhatmercan.controller.ListReportExt", {

	onBeforeRendering: function () {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "yyyy-MM-dd"
		});

		var oToday = new Date(),
			oFormattedToday = oDateFormat.format(oToday),
			// oFormattedOneMonthAgo = oDateFormat.format(new Date(oToday.getFullYear(), oToday.getMonth() - 1, oToday.getDate())),
			oFormattedTwoWeeksAgo = oDateFormat.format(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 14));

		var oDefaultFilter = {
			Erdat: {
				// low: oFormattedOneMonthAgo,
				low: oFormattedTwoWeeksAgo,
				high: oFormattedToday
			}
		};

		var sAppIdentifier = "com.itelligence.pm.orderreport::sap.suite.ui.generic.template.ListReport.view.ListReport",
			oSmartFilter = this.byId(sAppIdentifier + "::OrderSet--listReportFilter");

		oSmartFilter.attachInitialise(function () {
			oSmartFilter.setFilterData(oDefaultFilter);
		});
	},

	onBeforeRebindTableExtension: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartTable = oEvent.getSource(),
			oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId()),
			aCollectiveEquipment = [];

		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			var oCustomControl = oSmartFilterBar.getControlByKey("collectiveEquipment");
			if (oCustomControl instanceof sap.m.MultiComboBox) {
				aCollectiveEquipment = oCustomControl.getSelectedKeys();

				aCollectiveEquipment.forEach(function (sCollectiveEquipment) {
					oBindingParams.filters.push(new sap.ui.model.Filter("Equnr", "EQ", sCollectiveEquipment));
				});
			}
		}
	},

	onShowPopup: function (oEvent) {
		if (!this._oLegendPopover) {
			this._oLegendPopover = sap.ui.xmlfragment("com.itelligence.pm.orderreport.ext.fragment.LegendPopover", this);
			this.getView().addDependent(this._oLegendPopover);
		}

		this._oLegendPopover.openBy(oEvent.getSource());
	}

});