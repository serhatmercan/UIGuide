sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GenericTag",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (BaseController, GenericTag, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Details: [],
					Items: [],
					Skills: [
						{
							"Skill": "JavaScript",
							"Statu": "Success",
							"Detail": [
								"Arrow Functions",
								"Async / Await",
								"Classes",
								"Collections",
								"Control Flow & Error Handling",
								"ES6 & ES7",
								"Expressions & Operators",
								"Functions",
								"Grammar & Types",
								"Loops & Iteration",
								"Numbers & Dates",
								"Objects",
								"Promises",
								"Text Formatting"
							]
						}
					],
					Value: ""
				}), "model"
			);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onClosePopover: function (oEvent) {
			oEvent.getSource().getParent().getParent().close();
		},

		onGenerateFB: function () {
			const oFlexBox = this.byId("FlexBox");

			this.getModel("model").getProperty("/Items").forEach(oSkill => {
				oFlexBox.addItem(new GenericTag({
					design: "StatusIconHidden",
					text: oSkill.Skill,
					status: oSkill.Statu,
					press: this.onShowSkillDetail.bind(this)
				}));
			});
		},

		onShowPopover: function (oEvent, sDialogID, sName) {
			const oSource = oEvent.getSource();
			const oView = this.getView();
			let oDialog = this.byId(sDialogID);

			if (!oDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "com.sm.cv.fragment." + sName,
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.openBy(oSource);
				});
			} else {
				oDialog.openBy(oSource);
			}
		},

		onShowSkillDetail: function (oEvent) {
			const oGenericTag = oEvent.getSource();
			const sGenericTagID = oGenericTag.getId()
			const iIndex = oGenericTag.getParent().getItems().findIndex(oItem => oItem.getId() === sGenericTagID);
			const oViewModel = this.getModel("model");
			const aDetails = oViewModel.getProperty("/Skills/" + iIndex + "/Detail");

			if (!aDetails) {
				return;
			}

			oViewModel.setProperty("/Details", aDetails);

			this.onShowPopover(oEvent, "DetailPopover", "Detail");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			this.onGenerateFB();
		}

	});

});