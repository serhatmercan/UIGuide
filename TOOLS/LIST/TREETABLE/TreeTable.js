sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		showTreeTable: function (oEvent) {
			if (!this._oTreeTable) {
				this._oTreeTable = sap.ui.xmlfragment("com.serhatmercan.fragment.TreeTable", this);
				oEvent.getSource().addDependent(this._oTreeTable);
			}
			this._oTreeTable.open();
		},

		onConfirm: function () {
			var oTable = sap.ui.getCore().byId("idTreeTable"),
				sIndex = oTable.getSelectedIndex(),
				oTableObject,
				sNode,
				sParent;

			if (sIndex === -1) {
				MessageToast.show(this.getResourceBundle().getText("chooseRow"));
				return;
			}

			oTableObject = oTable.getContextByIndex(sIndex).getObject();
			sNode = oTableObject.Node;
			sParent = oTableObject.Parent;
		},

		onAfterClose: function () {
			this._oTreeTable.destroy();
			this._oTreeTable = null;
		}

	});

});