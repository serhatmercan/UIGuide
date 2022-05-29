sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("xxx.controller.SplitApp", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({										
                    Items: [
                        {
                            "Title": "Title I",
                            "Fragment": "FI"
                        }, {
                            "Title": "Title II",
                            "Fragment": "FII"
                        }, {
                            "Title": "Title III",
                            "Fragment": "FIII"
                        }
                    ]
				}), "model"
			);

            this.getRouter().getRoute("SplitApp").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

        onNavBack: function(){
            const sPreviousHash = History.getInstance().getPreviousHash();
			const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
        },

        onPressLI: function(oEvent){
            this.setFragment(oEvent.getParameter("listItem").getBindingContext("model").getObject("Fragment"));
        },

		/* ================ */
		/* Internal Methods */
		/* ================ */

        patternMatched: function(){
            this.setFragment("MessagePage");
			this.byId("List").removeSelections();
        },

        setFragment: function (sFragmentName) {
			const oDetailPage = this.byId("DetailPage");
			const oFragment = sap.ui.xmlfragment("com.serhatmercan.fragment." + sFragmentName, this);

			oDetailPage.destroyContent();
			oDetailPage.addContent(oFragment);
		}

	});
});