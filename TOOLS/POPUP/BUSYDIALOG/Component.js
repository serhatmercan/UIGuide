sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";
	return UIComponent.extend("com.serhatmercan.Component", {
		
		init: function () {
			this.setModel(Models.createGlobalModel(), "globalModel");
			this.attachBusy();
		},
		
		attachBusy: function(){
			
				this.getModel().metadataLoaded().then(function() {
					
					var oGlobalModel = this.getModel("globalModel");
					
					this.fnRequestSent = function(oSent){
						oGlobalModel.setProperty("/GlobalBusy", true);
					}
					
					this.fnRequestReceived = function(oReceived){
						setTimeout(function(){
							if(!this.hasPendingRequests()){
								oGlobalModel.setProperty("/GlobalBusy", false);
							}
						}.bind(this), 200);
					}
					
					this.getModel().attachRequestSent(this.fnRequestSent);
					this.getModel().attachRequestCompleted(this.fnRequestReceived);
					this.getModel().attachRequestFailed(this.fnRequestReceived);
					this.getModel().attachBatchRequestSent(this.fnRequestSent);
					this.getModel().attachBatchRequestCompleted(this.fnRequestReceived);
					this.getModel().attachBatchRequestFailed(this.fnRequestReceived);
					
					this.getModel().setSizeLimit(750);
					
				}.bind(this));
				
			},
		
	});
});