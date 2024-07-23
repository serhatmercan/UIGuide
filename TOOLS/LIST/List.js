sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GroupHeaderListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (BaseController, GroupHeaderListItem, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oList = this.byId("List");
			const oRouter = this.getRouter();

			this.bInitialScreen = true;

			this.oList = oList;
			this.oList.attachEventOnce("updateFinished", () => { });
			this.oList.removeSelections();

			oRouter.getRoute("main").attachPatternMatched(this.patternMatched, this);
			oRouter.attachBypassed(this.onBypassed, this);
		},

		onAfterRendering() {
			const oListBinding = this.byId("List").getBinding("items");

			oListBinding.attachDataRequested(() => { });
			oListBinding.attachDataReceived(() => { });
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAcceptNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
		},

		onBypassed: function () {
			this.oList.removeSelections(true);
		},

		onDelete(oEvent) {
			const sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const aIndexes = sPath.split("/");
			const iIndex = parseInt(aIndexes.pop(), 10);
			const sModelPath = aIndexes.join("/");
			const oViewModel = this.getModel("model");
			const aResults = oViewModel.getProperty(sModelPath);

			aResults.splice(iIndex, 1);
			oViewModel.setProperty(sModelPath, aResults);
		},

		onDetailNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getBindingContext().getObject();
		},

		onItemPress(oEvent) { },

		onLiveChange(oEvent) {
			const sValue = oEvent.getParameter("newValue");
			const oBinding = this.byId("List").getBinding("items");

			oBinding.filter([new Filter("ID", FilterOperator.Contains, sValue)]);
		},

		onOLI(oEvent) {
			const sID = oEvent.getParameter("listItem").getBindingContext().getProperty("ID");
		},

		onPress(oEvent) {
			const oData = oEvent.getSource().getBindingContext("model").getObject();
			const sValue = oEvent.getSource().getBindingContext().getProperty("Value");
		},

		onSelectionChange(oEvent) {
			const oList = oEvent.getSource();
			const oListMode = oList.getMode();
			const oListItem = oEvent.getParameter("listItem");
			const bListItemSelected = oEvent.getParameter("selected");
			const sID = oItem.getBindingContext().getProperty("ID");

			if (!(oListMode === "MultiSelect" && !bListItemSelected)) {
				this.showDetail(oListItem || oList);
			}
		},

		onUpdateFinished() {
			this.updateListItemCount(oEvent.getParameter("total"));
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createGroupHeader(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		patternMatched() {
			this.oList.removeSelections(true);
		},

		updateListItemCount(iTotalItems) {
			if (this.oList?.getBinding("items")?.isLengthFinal()) {
				const oViewModel = this.getModel("model");

				oViewModel.setProperty("/Title", this.getText("title", iTotalItems)); // Data ({0})

				if (this.bInitialScreen) {
					const aData = this.oList.getItems();

					aData[0]?.setSelected(true);
					aData[0]?.firePress();

					this.oList?.scrollToIndex(0);
					this.bInitialScreen = false;
				}
			}
		}

	});
});