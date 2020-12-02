sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		onChangeValue: function (oEvent) {
			this.getModel("model").setProperty("/Value", oEvent.getSource().getValue());
		},

		onPressSHValue: function () {
			this.getDialog(this, this._oResourceBundle.getText("value"), false, "/ValueSet", "Value", "Description", false, "model",
				"Value", null, null, null, oEvent.getSource());
			/*
			// Add Model's Object
			this.getDialog(this, this._oResourceBundle.getText("value"), false, "/ValueSet", "Value", "Description", false, "model",
				"Values/Value", null, null, null, oEvent.getSource());	
			*/
		},

		onPressSHValueWithParameters: function (oEvent) {
			var aFilters = [],
				sParameter = "";

			aFilters.push(new Filter("Parameter", FilterOperator.EQ, sParameter));

			models.getDialog(this, this._oResourceBundle.getText("value"), false, "/ValueSet", "Value", "Description", false, "model",
				"Value", null, null, aFilters, oEvent.getSource());
		},

		getDialog: function (that, sTitle, sRemember, sPath, sKey, sText, sMultiSelect, sModel, sProperty, sProperty1, aDefault, aFilter,
			oControl) {

			var dialogName = sProperty1 || sProperty;
			aDefault = aDefault || [];
			aFilter = aFilter || [];

			function setFilter(that, oDialog, sModel, sProperty, sKey, sMultiSelect) {
				var sFilter = that.getModel(sModel).getProperty(sProperty),
					afilters = [];
				afilters = afilters.concat(aFilter);
				if (sFilter && !sMultiSelect) {
					afilters.push(new Filter(sKey, FilterOperator.EQ, sFilter));
				}
				oDialog.getBinding("items").filter(afilters);
			}

			if (sProperty1) {
				sProperty = sProperty + "/" + sProperty1;
			} else {
				sProperty = "/" + sProperty;
			}

			var oDialog = new sap.m.SelectDialog({
				title: sTitle,
				busyIndicatorDelay: 0,
				items: {
					path: sPath,
					template: new sap.m.StandardListItem({
						title: {
							path: sKey,
							formatter: formatter.removeLeading
						},
						description: "{" + sText + "}"
					}),
					templateShareable: true
				},
				multiSelect: sMultiSelect,
				rememberSelections: sRemember,
				search: function (oEvent) {
					var match = /[\W_]/,
						sValue = oEvent.getParameter("value"),
						aFilters = [];
					oEvent.getSource().getBinding("items").attachEventOnce("dataReceived", function (ev) {
						var aData = ev.getParameter("data").results,
							aFiltersIn = [];
						if (aData.length === 0 && ev.getSource().aFilters.length > 0) {
							aFiltersIn = aFiltersIn.concat(aFilter);
							aFiltersIn.push(new Filter(sText, FilterOperator.Contains, sValue));
							aFiltersIn.push(new Filter(sText, FilterOperator.Contains, sValue.toLocaleUpperCase()));
							aFiltersIn.push(new Filter(sText, FilterOperator.Contains, sValue.toLocaleLowerCase()));
							aFiltersIn.push(new Filter(sText, FilterOperator.Contains, formatter.capitalize(sValue)));
							ev.getSource().filter(aFiltersIn);
						}
					}.bind(that));

					aFilters = aFilters.concat(aFilter);
					if (sValue) {
						aFilters.push(new Filter(sKey, FilterOperator.Contains, sValue));
						aFilters.push(new Filter(sKey, FilterOperator.Contains, sValue.toLocaleUpperCase()));
					}
					oEvent.getSource().getBinding("items").filter(aFilters);
				},
				confirm: function (oEvent) {
					var aSelectedContexts = oEvent.getParameter("selectedContexts");
					if (sMultiSelect) {
						var aSelected = [];
						for (var i in aSelectedContexts) {
							aSelected.push(aSelectedContexts[i].getObject(sKey));
						}
						that.getModel(sModel).setProperty(sProperty, aSelected);
					} else {
						var sValue = "",
							sDesc = "";
						for (var i in aSelectedContexts) {
							sValue = aSelectedContexts[i].getObject(sKey);
							sDesc = aSelectedContexts[i].getObject(sText);
							break;
						}
						that.getModel(sModel).setProperty(sProperty, sValue);
						if (oControl) {
							oControl.fireChange({
								value: sValue
							});
						}
					}
					oDialog.destroy();
				}.bind(that),
				cancel: function () {
					oDialog.destroy();
				}
			});
			oControl.addDependent(oDialog);
			setFilter(that, oDialog, sModel, sProperty, sKey, sMultiSelect);
			oDialog._oDialog.attachBeforeOpen(function (ev) {
				var oList = ev.getSource().getParent()._oList,
					aSelectedContextPath = [],
					sProp = {};
				for (var i in aDefault) {
					sProp[sKey] = aDefault[i];
					aSelectedContextPath.push(that.getModel().createKey(sPath, sProp));
				}
				oList.setSelectedContextPaths(aSelectedContextPath);
			}.bind(this));
			oDialog.open();
		}

	});

});