sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/SuggestionItem",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, SuggestionItem, ActionButton, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Items: [],
				Organization: {
					"Lines": [
						{ "From": "MERCAN", "To": "MEHMETMERCAN" },
						{ "From": "MERCAN", "To": "FATMAMERCAN" },
						{ "From": "MEHMETMERCAN", "To": "SERCANMERCAN" },
						{ "From": "MEHMETMERCAN", "To": "YELIZMERCAN" },
						{ "From": "FATMAMERCAN", "To": "SERHATMERCAN" },
						{ "From": "SERCANMERCAN", "To": "ELIFMERCAN" },
						{ "From": "YELIZMERCAN", "To": "SELIMMERCAN" }
					],
					"Nodes": [
						{
							"ID": "MERCAN", "Title": "MERCAN'lar", "Attributes": [{ "Label": 7, "Value": "Mercan" }],
							"Level": "Soyağacı", "Location": "Türkiye", "Position": "Family Tree", "Src": "", "Team": 7
						},
						{
							"ID": "MEHMETMERCAN", "Title": "Mehmet MERCAN", "Attributes": [{ "Label": 4, "Value": "Grandfather" }],
							"Level": "Dede", "Location": "Giresun", "Position": "Grandfather", "Src": "../assets/MehmetMercan.jpeg",
							"Supervisor": "MERCAN", "Team": 4
						},
						{
							"ID": "FATMAMERCAN", "Title": "Fatma MERCAN", "Attributes": [{ "Label": 1, "Value": "Grandmother" }],
							"Level": "Ma'anne", "Location": "İstanbul", "Position": "Grandmother", "Src": "../assets/FatmaMercan.jpeg",
							"Supervisor": "MERCAN", "Team": 1
						},
						{
							"ID": "SERCANMERCAN", "Title": "Sercan MERCAN", "Attributes": [{ "Label": 1, "Value": "Father" }],
							"Level": "Baba", "Location": "İstanbul", "Position": "Father", "Src": "",
							"Supervisor": "MEHMETMERCAN", "Team": 1
						},
						{
							"ID": "YELIZMERCAN", "Title": "Yeliz MERCAN", "Attributes": [{ "Label": 1, "Value": "Mother" }],
							"Level": "Anne", "Location": "Göttingen", "Position": "Mother", "Src": "",
							"Supervisor": "MEHMETMERCAN", "Team": 1
						},
						{
							"ID": "SERHATMERCAN", "Title": "Serhat MERCAN", "Attributes": [{ "Label": 0, "Value": "Uncle" }],
							"Level": "Amça", "Location": "İstanbul", "Position": "Uncle", "Src": "../assets/SerhatMercan.jpg",
							"Supervisor": "FATMAMERCAN"
						},
						{
							"ID": "ELIFMERCAN", "Title": "Elif MERCAN", "Attributes": [{ "Label": 0, "Value": "Fıstık" }],
							"Level": "Fıstık", "Location": "Ankara", "Position": "Fıstık", "Src": "../assets/ElifMercan.jpeg",
							"Supervisor": "SERCANMERCAN"
						},
						{
							"ID": "SELIMMERCAN", "Title": "Selim MERCAN", "Attributes": [{ "Label": 0, "Value": "Şelim" }],
							"Level": "Şelim", "Location": "Hamm", "Position": "Şelim", "Src": "../assets/SelimMercan.jpeg",
							"Supervisor": "YELIZMERCAN"
						}
					]
				},
				Value: ""
			});

			this.setModel(oViewModel, "model");
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onPressLine(oEvent) {
			oEvent.setCollapsed(false);
			this.loadMore(oEvent.getKey());
		},

		onSearch(oEvent) {
			const sKey = oEvent.getParameter("key");

			if (sKey) {
				this.mExplored = [sKey];
				this.sTopSupervisor = sKey;
				this.setFilterOrganization();

				oEvent.bPreventDefault = true;
			}
		},

		onSearchSuggest(oEvent) {
			const sTerm = oEvent.getParameter("term") || "";
			const aSuggestionItems = [];
			const aItems = this.oViewModel.getProperty("/Organization/Nodes");
			const aFilteredItems = aItems.filter(oItem => oItem.Title.toLowerCase().includes(sTerm.toLowerCase()));

			aFilteredItems.sort((oItem1, oItem2) =>
				oItem1?.Title?.localeCompare(oItem2.Title)).forEach(oItem => {
					aSuggestionItems.push(new SuggestionItem({ key: oItem.ID, text: oItem.Title }));
				});

			this.oNetworkGraph.setSearchSuggestionItems(aSuggestionItems);
			oEvent.bPreventDefault = true;
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getCustomDataValue(oNode, sName) {
			return oNode.getCustomData()?.find(oData => oData.getKey() === sName)?.getValue();
		},

		loadMore(sName) {
			this.oNetworkGraph.deselect();
			this.mExplored.push(sName);
			this.setFilterOrganization();
		},

		openLeader(oNode, bCollapseDefault) {
			const bCollapsed = bCollapseDefault ?? !oNode.getCollapsed();
			oNode.setCollapsed(bCollapsed);

			this.loadMore(oNode.getKey());
			oNode.setShowExpandButton(true);
		},

		async patternMatched() {
			this.oViewModel = this.getModel("model");
			this.setOrganization();
		},

		setFilterOrganization() {
			const aNodesCondition = [];
			const aLinesCondition = [];
			const fnAddBossCondition = sBoss => {
				aNodesCondition.push(new Filter({ path: "ID", operator: FilterOperator.EQ, value1: sBoss }));
				aNodesCondition.push(new Filter({ path: "Supervisor", operator: FilterOperator.EQ, value1: sBoss }));
			};
			const fnAddLineCondition = sLine => {
				aLinesCondition.push(new Filter({ path: "From", operator: FilterOperator.EQ, value1: sLine }));
			};

			this.mExplored.forEach(oItem => {
				fnAddBossCondition(oItem);
				fnAddLineCondition(oItem);
			});

			this.oNetworkGraph.getBinding("nodes").filter(new Filter({ filters: aNodesCondition, and: false }));
			this.oNetworkGraph.getBinding("lines").filter(new Filter({ filters: aLinesCondition, and: false }));
		},

		async setOrganization() {
			this.sTopSupervisor = "MERCAN";
			this.mExplored = [this.sTopSupervisor];
			this.oNetworkGraph = this.byId("NetworkGraph");
			this.setFilterOrganization();

			await this.oNetworkGraph.attachEvent("beforeLayouting", () => {
				this.oNetworkGraph.preventInvalidation(true);
				this.oNetworkGraph.getNodes().forEach(oNode => {
					let oExpandButton, oUpOneLevelButton, sSupervisor;

					oNode.removeAllActionButtons();

					if (!this.mExplored.includes(oNode.getKey())) {
						oNode.setShowExpandButton(false);
						oNode.setCollapsed(true);

						oExpandButton = new ActionButton({
							title: "Expand",
							icon: "sap-icon://sys-add",
							press: () => {
								oNode.setCollapsed(false);
								this.loadMore(oNode.getKey());
							}
						});
						oNode.addActionButton(oExpandButton);
					} else {
						oNode.setShowExpandButton(true);
					}

					if (oNode.getKey() === this.sTopSupervisor) {
						sSupervisor = this.getCustomDataValue(oNode, "Supervisor");

						if (sSupervisor) {
							oUpOneLevelButton = new ActionButton({
								title: "Up One level",
								icon: "sap-icon://arrow-top",
								press: () => {
									const sSupervisor = this.getCustomDataValue(oNode, "Supervisor");

									this.loadMore(sSupervisor);
									this.sTopSupervisor = sSupervisor;
								}
							});
							oNode.addActionButton(oUpOneLevelButton);
						}
					}
				});
				this.oNetworkGraph.preventInvalidation(false);
			});

			await Promise.all(this.oNetworkGraph?.getNodes()?.map(oNode => this.openLeader(oNode, false)));
			await Promise.all(this.oNetworkGraph?.getNodes()?.map(oNode => this.openLeader(oNode, false)));
		}

	});
});