sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button"
], function (BaseController, JSONModel, Dialog, Text, Button) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Value: "",
				ValueList: [],
				Count: 0
			});

			this.setModel(oModel, "model");

		},

		onPressButton: function (oEvent) {
			if (!this._oValueList) {
				this._oValueList = sap.ui.xmlfragment("com.spro.serhatmercan.ButtonList", this);
				this.getView().addDependent(this._oValueList);
			}
			this._oValueList.open();
		},

		onAfterCloseDialog: function () {
			this._oValueList.destroy();
			this._oValueList = null;
		},

		onPressClose: function () {
			this.onAfterCloseDialog();
		},

		onChangeInput: function (oEvent) {

			var oModel = this.getModel("model"),
				sCount = oModel.getProperty("Count"),
				sValue = oModel.getProperty("/Value"),
				aValueList = oModel.getProperty("/ValueList"),
				sIndex = aValueList.findIndex(x => x.Value === sValue);

			if (sIndex == -1) {

				aValueList.push({
					Value: sValue
				});
				oModel.setProperty("/ValueList", aValueList);

				sCount++;
				oModel.setProperty("/Count", sCount);

			}

		},

		onScanSuccessButton: function (oEvent) {

			if (!oEvent.getParameter("cancelled")) {

				var oModel = this.getModel("model"),
					sCount = oModel.getProperty("Count"),
					sValue = oEvent.getParameter("text"),
					aValueList = oModel.getProperty("/ValueList"),
					sIndex = aValueList.findIndex(x => x.Value === sValue);

				if (sIndex == -1) {

					aValueList.push({
						Value: sValue
					});
					oModel.setProperty("/ValueList", aValueList);

					sCount++;
					oModel.setProperty("/Count", sCount);

				}

			}

		},

		onDeleteList: function (oEvent) {

			var oListItem = oEvent.getParameter("listItem"),
				sPathItem = oListItem.getBindingContext("model").getPath(),
				aIndexItem = sPathItem.split("/"),
				sPathModel = "/" + aIndexItem[aIndexItem.length - 2],
				sIndexModel = parseInt(aIndexItem[aIndexItem.length - 1]),
				oModel = this.getModel("model"),
				aValueList = oModel.getProperty("/ValueList"),
				sCount = oModel.getProperty("/Count");

			function deleteSelectedItem() {

				aValueList.splice(sIndexModel, 1);
				oModel.setProperty("/ValueList", aValueList);

				sCount--;
				oModel.setProperty("/Count", sCount);

			}

			this.getConfirmDialog("Button List Title", "Message", "Warning", "Confirm Message", deleteSelectedItem);

		},

		getConfirmDialog: function (sTitle, sType, sState, sText, fConfirm) {

			var oDialog = new Dialog({
				title: sTitle,
				type: sType,
				state: sState || "None",
				content: new Text({
					text: sText
				}),
				beginButton: new Button({
					text: "Ok",
					press: function () {
						oDialog.close();
						fConfirm();
					}
				}),
				endButton: new Button({
					text: "No",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
			oDialog.open();

		}

	});

});