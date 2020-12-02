sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function() {
			
			var oModel = new JSONModel({
				Value: ""	
			});
			
			this.setModel(oModel, "model");
			
		},
		
		checkObligatoryFields: function () {
			if (!this.validateFieldsByControl(this, this.getView().getId())) {
				MessageToast.show("Check Obligatory Fields");
				return;
			}
		},
		
		validateFieldsByControl: function(that, sId) {
			
			var isValid = true,
				isValid = this.getFieldsByControl(that, sId, isValid);
			
			return isValid;
			
		},
		
		getFieldsByControl: function(that, sId, isValid) {
			
			var oControl = sap.ui.getCore().byId(that.createId(sId)) || sap.ui.getCore().byId(sId),
				aAggregatedObjects = oControl.findAggregatedObjects();

			for (var i in aAggregatedObjects) {
				
				if (aAggregatedObjects[i].mProperties.hasOwnProperty("required")) {
					
					if (aAggregatedObjects[i].getProperty("required")) {
						isValid = this.checkStatesByControl(that, aAggregatedObjects[i], isValid);
					} else {
						isValid = this.getFieldsByControl(that, aAggregatedObjects[i].getId(), isValid);
					}
					
				} else {
					isValid = this.getFieldsByControl(that, aAggregatedObjects[i].getId(), isValid);
				}
				
			}
			
			return isValid;
			
		},
		
		checkStatesByControl: function(that, oField, isValid) {
			
			var oBinding,
				oParts,
				sIPath,
				sValue;

			if (oField.getBindingInfo("value")) {
				oBinding = oField.getBindingInfo("value");
			} else if (oField.getBindingInfo("selectedKey")) {
				oBinding = oField.getBindingInfo("selectedKey");
			} else if (oField.getBindingInfo("dateValue")) {
				oBinding = oField.getBindingInfo("dateValue");
			} else if (oField.getBindingInfo("selectedKeys")) {
				oBinding = oField.getBindingInfo("selectedKeys");
			} else if (oField.getBindingInfo("tokens")) {
				oBinding = oField.getBindingInfo("tokens");
			}

			oParts = oBinding.parts ? oBinding.parts : [oBinding];
			sIPath = oBinding.binding.getContext() ? oBinding.binding.getContext().getPath() + "/" : "";

			for (var i = 0; i < oParts.length; i++) {
				
				sValue = that.getModel(oParts[i].model).getProperty(sIPath + oParts[i].path);
				
				if (Array.isArray(sValue)) {
					if (sValue.length === 0) {
						oField.setValueState("Error");
						isValid = false;
					} else {
						oField.setValueState("None");
					}
				} else if (!sValue) {
					oField.setValueState("Error");
					isValid = false;
				} else {
					oField.setValueState("None");
				}
				
			}
			
			return isValid;
			
		}

	});

});