sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);

			const oViewModel = new JSONModel({
				Experience: {
					Positions: [
						{ ID: "0", Position: 0, Icon: "sap-icon://study-leave", Date: "Sept '14 - June '19" },
						{ ID: "1", Position: 1, Icon: "sap-icon://world", Date: "July '18 - Aug '18" },
						{ ID: "2", Position: 2, Icon: "sap-icon://employee", Date: "Sept '18 - Febr '20" },
						{ ID: "3", Position: 3, Icon: "sap-icon://sap-ui5", Date: "March '20 - March '21" },
						{ ID: "4", Position: 4, Icon: "sap-icon://home", Date: "March '21 - Present" }
					],
					Details: [
						{
							ID: "4", Lane: "4", Company: "NTT DATA Business Solutions Turkey", Date: "March 2021 - Present",
							Photo: "../assets/Nttdata.png", Position: "UI Technologies", Role: "Senior UI Developer", State: "Neutral"
						},
						{
							ID: "3", Lane: "3", Children: [4], Company: "Itelligence Turkey", Date: "March 2020 - March 2021",
							Photo: "../assets/Itelligence.png", Position: "UI Technologies", Role: "UI Developer", State: "Positive"
						},
						{
							ID: "2", Lane: "2", Children: [3], Company: "SPRO Technology", Date: "September 2018 - February 2020",
							Photo: "../assets/Spro.png", Position: "R&D", Role: "SAP Full-Stack Developer", State: "Positive"
						},
						{
							ID: "1", Lane: "1", Children: [2], Company: "SPRO Technology", Date: "July 2018 - August 2018",
							Photo: "../assets/Spro.png", Position: "Intern", Role: "SAP ABAP Developer", State: "Positive"
						},
						{
							ID: "0", Lane: "0", Children: [1], Company: "İstanbul University", Date: "September 2014 - June 2019",
							Position: "University", Photo: "../assets/IU.png", Role: "Computer Engineering", State: "Positive"
						}
					]
				},
				Nodes: [
					{
						ID: "0", Lane: "0", Children: [1], Company: "SPRO Technology", Date: "July 2018 - August 2018",
						Photo: `${jQuery.sap.getModulePath("com.sm.CV.assets")}/Spro.png`, Position: "Intern", Role: "SAP ABAP Developer"
					},
					{
						ID: "1", Lane: "1", Children: [2], Company: "SPRO Technology", Date: "September 2018 - February 2020",
						Photo: `${jQuery.sap.getModulePath("com.sm.CV.assets")}/Spro.png`, Position: "SAP Developer", Role: "SAP Full-Stack Developer"
					}
				],
				Lanes: [
					{ ID: "0", Position: 0, Icon: "sap-icon://employee", Date: "July '18 - Aug '18" },
					{ ID: "1", Position: 1, Icon: "sap-icon://employee", Date: "Sept '18 - Febr '20" }
				]
			});

			this.setModel(oViewModel, "model");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() {
			this.byId("ProcessFlow").zoomIn();
		}

	});
});