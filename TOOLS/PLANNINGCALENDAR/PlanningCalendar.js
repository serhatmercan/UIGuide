sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				"StartDate": new Date(2017, 0, 15, 8, 0),
				"People": [
					{
						"Name": "John Miller",
						"Picture": this.getImage("JohnMiller.png"),
						"Role": "Team Member",
						"Appointments": [
							{
								"Start": new Date(2017, 0, 15, 8, 30),
								"End": new Date(2017, 0, 15, 9, 30),
								"Title": "Meet Max Mustermann",
								"Type": "Type02",
								"Tentative": false
							},
							{
								"Start": new Date(2017, 0, 15, 10, 30),
								"End": new Date(2017, 0, 15, 12, 30),
								"Title": "Team meeting",
								"Info": "Room 1",
								"Type": "Type01",
								"Pic": "sap-icon://sap-ui5",
								"Tentative": false
							},
							{
								"Start": new Date(2017, 0, 15, 11, 30),
								"End": new Date(2017, 0, 15, 13, 30),
								"Title": "Lunch",
								"Info": "Canteen",
								"Type": "Type03",
								"Tentative": true
							}
						]
					},
					{
						"Name": "Donna Moore",
						"Picture": this.getImage("DonnaMoore.jpg"),
						"Role": "IT Manager",
						"Appointments": [
							{
								"Start": new Date(2017, 0, 15, 18, 0),
								"End": new Date(2017, 0, 15, 19, 10),
								"Title": "Discussion of the Plan",
								"Info": "Online meeting",
								"Type": "Type04",
								"Tentative": false
							}
						]
					}
				]
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAppointmentDrop(oEvent) {

		},

		onAppointmentSelect(oEvent) {
			const aAppointments = oEvent.getParameter("appointments");
			const oAppointment = oEvent.getParameter("appointment");
			const bSelected = oAppointment.getSelected();
			const sTitle = oAppointment.getTitle();
			const oStartDate = oAppointment.getStartDate();
			const oEndDate = oAppointment.getEndDate();
		},

		onStartDateChange() { },

		onViewChange() { },

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getImage: (sImagePath) => `${jQuery.sap.getModulePath("com.sm.template")}/assets/${sImagePath}`,

		getSelectedAppointments: () => this.byId("PlanningCalendar").getSelectedAppointments(),

		setAppointmentDropBetweenRows(oViewModel, oAppointmentContext, oCalendarRowContext) {
			const sAppointmentContextPath = oAppointmentContext.getPath();
			const aPaths = sAppointmentContextPath.split("/");
			const iIndex = aPaths.pop();
			const sRowAppointmentPath = aPaths.join("/");
			const oAppointment = oViewModel.getProperty(sAppointmentContextPath);
			const aAppointments = oCalendarRowContext.getObject("Appointments");

			aAppointments.push(oAppointment);

			const aOriginalAppointments = oViewModel.getProperty(sRowAppointmentPath);
			aOriginalAppointments.splice(iIndex, 1);
		},

		patternMatched() { }

	});
});