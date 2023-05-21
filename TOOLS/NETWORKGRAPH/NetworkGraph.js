sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/SuggestionItem",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, SuggestionItem, ActionButton, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: [],
					Organization: {
						"Lines": [
							{
								"From": "MERCAN",
								"To": "MEHMETMERCAN"
							},
							{
								"From": "MERCAN",
								"To": "FATMAMERCAN"
							},
							{
								"From": "MEHMETMERCAN",
								"To": "SERCANMERCAN"
							},
							{
								"From": "MEHMETMERCAN",
								"To": "YELIZMERCAN"
							},
							{
								"From": "FATMAMERCAN",
								"To": "SERHATMERCAN"
							},
							{
								"From": "SERCANMERCAN",
								"To": "ELIFMERCAN"
							},
							{
								"From": "YELIZMERCAN",
								"To": "SELIMMERCAN"
							}
						],
						"Nodes": [
							{
								"ID": "MERCAN",
								"Title": "MERCAN'lar",
								"Attributes": [
									{
										"Label": 7,
										"Value": "Mercan"
									}
								],
								"Level": "Soyağacı",
								"Location": "Türkiye",
								"Position": "Family Tree",
								"Src": "",
								"Team": 7
							},
							{
								"ID": "MEHMETMERCAN",
								"Title": "Mehmet MERCAN",
								"Attributes": [
									{
										"Label": 4,
										"Value": "Grandfather"
									}
								],
								"Level": "Dede",
								"Location": "Giresun",
								"Position": "Grandfather",
								"Src": "../assets/MehmetMercan.jpeg",
								"Supervisor": "MERCAN",
								"Team": 4
							},
							{
								"ID": "FATMAMERCAN",
								"Title": "Fatma MERCAN",
								"Attributes": [
									{
										"Label": 1,
										"Value": "Grandmother"
									}
								],
								"Level": "Ma'anne",
								"Location": "İstanbul",
								"Position": "Grandmother",
								"Src": "../assets/FatmaMercan.jpeg",
								"Supervisor": "MERCAN",
								"Team": 1
							},
							{
								"ID": "SERCANMERCAN",
								"Title": "Sercan MERCAN",
								"Attributes": [
									{
										"Label": 1,
										"Value": "Father"
									}
								],
								"Level": "Baba",
								"Location": "İstanbul",
								"Position": "Father",
								"Src": "",
								"Supervisor": "MEHMETMERCAN",
								"Team": 1
							},
							{
								"ID": "YELIZMERCAN",
								"Title": "Yeliz MERCAN",
								"Attributes": [
									{
										"Label": 1,
										"Value": "Mother"
									}
								],
								"Level": "Anne",
								"Location": "Göttingen",
								"Position": "Mother",
								"Src": "",
								"Supervisor": "MEHMETMERCAN",
								"Team": 1
							},
							{
								"ID": "SERHATMERCAN",
								"Title": "Serhat MERCAN",
								"Attributes": [
									{
										"Label": 0,
										"Value": "Uncle"
									}
								],
								"Level": "Amça",
								"Location": "İstanbul",
								"Position": "Uncle",
								"Src": "../assets/SerhatMercan.jpg",
								"Supervisor": "FATMAMERCAN"
							},
							{
								"ID": "ELIFMERCAN",
								"Title": "Elif MERCAN",
								"Attributes": [
									{
										"Label": 0,
										"Value": "Fıstık"
									}
								],
								"Level": "Fıstık",
								"Location": "Ankara",
								"Position": "Fıstık",
								"Src": "../assets/ElifMercan.jpeg",
								"Supervisor": "SERCANMERCAN"
							},
							{
								"ID": "SELIMMERCAN",
								"Title": "Selim MERCAN",
								"Attributes": [
									{
										"Label": 0,
										"Value": "Şelim"
									}
								],
								"Level": "Şelim",
								"Location": "Hamm",
								"Position": "Şelim",
								"Src": "../assets/SelimMercan.jpeg",
								"Supervisor": "YELIZMERCAN"
							}
						]
					},
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onPressLine: function (oEvent) {
            oEvent.setCollapsed(false);
            this.loadMore(oEvent.getKey());
        },

		onSearch: function (oEvent) {
			const sKey = oEvent.getParameter("key");

			if (sKey) {
				this.mExplored = [sKey];
				this.sTopSupervisor = sKey;
				this.setFilterOrganization();

				oEvent.bPreventDefault = true;
			}
		},

		onSearchSuggest: function (oEvent) {
			const aSuggestionItems = [];
			const aItems = this.oViewModel.getProperty("/Organization");
			let aFilteredItems = [];
			let sTerm = oEvent.getParameter("term");

			sTerm = sTerm ? sTerm : "";

			aFilteredItems = aItems.filter((oItem) => {
				const sTitle = oItem.Title ? oItem.Title : "";
				return sTitle.toLowerCase().indexOf(sTerm.toLowerCase()) !== -1;
			});

			aFilteredItems.sort((oItem1, oItem2) => {
				const sTitle = oItem1.Title ? oItem1.Title : "";
				return sTitle.localeCompare(oItem2.Title);
			}).forEach((oItem) => {
				aSuggestionItems.push(
					new SuggestionItem({
						key: oItem.ID,
						text: oItem.Title
					})
				);
			});

			this.oNetworkGraph.setSearchSuggestionItems(aSuggestionItems);

			oEvent.bPreventDefault = true;
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getCustomDataValue: function (oNode, sName) {
			const aItems = oNode.getCustomData().filter((oData) => oData.getKey() === sName);

			return aItems.length > 0 && aItems[0].getValue();
		},

		loadMore: function (sName) {
			this.oNetworkGraph.deselect();
			this.mExplored.push(sName);
			this.setFilterOrganization();
		},

		openLeader: function (oNode, bCollapseDefault) {
			let bCollapsed;

			if (bCollapseDefault) {
				bCollapsed = bCollapseDefault;
			}
			else {
				bCollapsed = oNode.getCollapsed() ? false : true;
			}

			oNode.setCollapsed(bCollapsed);

			this.loadMore(oNode.getKey());

			oNode.setShowExpandButton(true);
		},

		patternMatched: function (oEvent) {
			this.oViewModel = this.getModel("model");
			this.setOrganization();
		},

		setFilterOrganization: function () {
			const aNodesCondition = [];
			const aLinesCondition = [];
			const fnAddBossCondition = (sBoss) => {
				aNodesCondition.push(
					new Filter({
						path: "ID",
						operator: FilterOperator.EQ,
						value1: sBoss
					})
				);

				aNodesCondition.push(
					new Filter({
						path: "Supervisor",
						operator: FilterOperator.EQ,
						value1: sBoss
					})
				);
			};
			const fnAddLineCondition = (sLine) => {
				aLinesCondition.push(
					new Filter({
						path: "From",
						operator: FilterOperator.EQ,
						value1: sLine
					})
				);
			};

			this.mExplored.forEach((oItem) => {
				fnAddBossCondition(oItem);
				fnAddLineCondition(oItem);
			});

			this.oNetworkGraph.getBinding("nodes").filter(
				new Filter({
					filters: aNodesCondition,
					and: false
				})
			);

			this.oNetworkGraph.getBinding("lines").filter(
				new Filter({
					filters: aLinesCondition,
					and: false
				})
			);
		},

		setOrganization: async function () {
			this.sTopSupervisor = "MERCAN";
			this.mExplored = [
				this.sTopSupervisor
			];

			this.oNetworkGraph = this.byId("NetworkGraph");

			this.setFilterOrganization();

			await this.oNetworkGraph.attachEvent("beforeLayouting", () => {
				this.oNetworkGraph.preventInvalidation(true);
				this.oNetworkGraph.getNodes().forEach((oNode) => {
					let oExpandButton;
					let oUpOneLevelButton;
					let sSupervisor;

					oNode.removeAllActionButtons();

					if (this.mExplored.indexOf(oNode.getKey()) === -1) {
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
									const aSuperVisors = oNode.getCustomData().filter((oData) => oData.getKey() === "Supervisor");
									const sSupervisor = aSuperVisors.length > 0 && aSuperVisors[0].getValue();

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

			await this.oNetworkGraph.getNodes().forEach((oNode) => {
				this.openLeader(oNode, false);
			});

			await this.oNetworkGraph.getNodes().forEach((oNode) => {
				this.openLeader(oNode, false);
			});
		}

	});

});