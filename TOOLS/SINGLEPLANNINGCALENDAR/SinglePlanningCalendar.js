sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/library",
], (Controller, Fragment, JSONModel, library) => {
	"use strict";

	const { CalendarDayType: oCalendarDayType } = library;

	return Controller.extend("com.sm.SinglePlanningCalendar.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Appointment: { Title: "", Text: "", Type: oCalendarDayType.Type01, StartDate: new Date(), EndDate: new Date() },
				Appointments: [
					{
						Title: "Meeting", Text: "Online", Type: oCalendarDayType.Type01, Icon: "sap-icon://meeting-room",
						StartDate: new Date("2022-01-12T09:00:00"), EndDate: new Date("2022-01-12T10:00:00")
					},
					{
						Title: "Lunch", Text: "Canteen", Type: oCalendarDayType.Type02, Icon: "sap-icon://meal",
						StartDate: new Date("2022-01-12T12:00:00"), EndDate: new Date("2022-01-12T13:00:00")
					},
					{
						Title: "Rest", Text: "Home", Type: oCalendarDayType.Type03, Icon: "sap-icon://home",
						StartDate: new Date("2022-01-12T18:00:00"), EndDate: new Date("2022-01-12T20:00:00")
					}
				],
				Mode: "CA"
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACAppointmentDialog() {
			this.oAppointment.close();
			this.oAppointment.destroy();
			this.oAppointment = null;
			this.sPath = "";
		},

		onAppointmentCreate(event) {
			const oViewModel = this.getModel("model");
			const aAppointments = oViewModel.getProperty("/Appointments");

			aAppointments.push({
				Title: "New Appointment",
				StartDate: event.getParameter("startDate"),
				EndDate: event.getParameter("endDate")
			});

			oViewModel.updateBindings();
		},

		onAppointmentDrop(oEvent) {
			const oViewModel = this.getModel("model");
			const aAppointments = oViewModel.getProperty("/Appointments");
			const { appointment: oAppointment, startDate: oStartDate, endDate: oEndDate } = oEvent.getParameters();

			if (event.getParameter("copy")) {
				aAppointments.push({
					Title: oAppointment.getTitle(),
					Icon: oAppointment.getIcon(),
					Text: oAppointment.getText(),
					Type: oAppointment.getType(),
					StartDate: oStartDate,
					EndDate: oEndDate
				});
				oViewModel.updateBindings();
			} else {
				oAppointment.setStartDate(oStartDate);
				oAppointment.setEndDate(oEndDate);
			}
		},

		onAppointmentResize(event) {
			const { appointment: oAppointment, startDate, endDate } = event.getParameters();

			oAppointment.setStartDate(startDate);
			oAppointment.setEndDate(endDate);
		},

		onAppointmentSelect(event) {
			const oAppointment = event.getParameter("appointment");
			const oViewModel = this.getModel("model");

			if (!oAppointment || !oAppointment.getSelected()) {
				return;
			}

			this.sPath = oAppointment.getBindingContext("model").getPath();

			oViewModel.setProperty("/Mode", "UA");
			oViewModel.setProperty("/Appointment", {
				Title: oAppointment.getTitle(),
				Text: oAppointment.getText(),
				Type: oAppointment.getType(),
				StartDate: oAppointment.getStartDate(),
				EndDate: oAppointment.getEndDate()
			});

			this.onShowAppointment();
		},

		onCreateAppointment() {
			const oViewModel = this.getModel("model");

			oViewModel.setProperty("/Appointment", {
				Title: "",
				Text: "",
				Type: oCalendarDayType.Type01,
				StartDate: new Date(),
				EndDate: new Date()
			});

			oViewModel.setProperty("/Mode", "CA");

			this.onShowAppointment();
		},

		onDeleteAppointment() {
			const oViewModel = this.getModel("model");
			const aAppointments = oViewModel.getProperty("/Appointments");
			const iIndex = this.sPath.split("/").pop();

			aAppointments.splice(iIndex, 1);

			oViewModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onSaveAppointment() {
			const oViewModel = this.getModel("model");
			const oAppointment = oViewModel.getProperty("/Appointment");
			const aAppointments = oViewModel.getProperty("/Appointments");

			if (oViewModel.getProperty("/Mode") === "CA") {
				aAppointments.push(oAppointment);
			} else {
				oViewModel.setProperty(this.sPath, oAppointment);
			}

			oViewModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onShowAppointment() {
			Fragment.load({
				id: this.getView().getId(),
				name: "com.sm.SinglePlanningCalendar.Appointment",
				controller: this
			}).then(oAppointment => {
				this.oAppointment = oAppointment;
				this.getView().addDependent(this.oAppointment);
				this.oAppointment.setModel(this.getModel("model"), "model");
				this.oAppointment.open();
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		formatDate(sDate) {
			return new Date(sDate);
		}

	});
});