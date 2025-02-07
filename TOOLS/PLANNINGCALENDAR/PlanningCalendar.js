sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], (BaseController, MessageToast, DateFormat) => {
	"use strict";

	return BaseController.extend("com.sm.template.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onExit() {
			this.sPath = "";

			if (this.oAppointmentDialog) {
				this.oAppointmentDialog.destroy();
				this.oAppointmentDialog = null;
			}

			if (this.oAppointmentPopover) {
				this.oAppointmentPopover.destroy();
				this.oAppointmentPopover = null;
			}
		},

		onInit() {
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACAppointmentDialog() {
			this.oAppointmentDialog.close();
		},

		onAppointmentCreate(oEvent) {
			const oViewModel = this.getModel("model");
			const oCalendarRow = oEvent.getParameter("calendarRow");
			const oStartDate = oEvent.getParameter("StartDate");
			const oEndDate = oEvent.getParameter("EndDate");
			const sPath = oCalendarRow.getBindingContext("model").getPath();
			const aAppointments = oViewModel.getProperty(sPath + "/Appointments");

			aAppointments.push({
				Title: "New Appointment",
				Start: oStartDate,
				End: oEndDate
			});

			MessageToast.show("New Appointment is created at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");

			oViewModel.refresh(true);
		},

		onAppointmentDragEnter(oEvent) {
			if (this.checkAppointmentOverlap(oEvent, oEvent.getParameter("calendarRow"))) {
				oEvent.preventDefault();
			}
		},

		onAppointmentDrop(oEvent) {
			const oViewModel = this.getModel("model");
			const oAppointment = oEvent.getParameter("appointment");
			const oCalendarRow = oEvent.getParameter("calendarRow");
			const oStartDate = oEvent.getParameter("startDate");
			const oEndDate = oEvent.getParameter("endDate");
			const bCopy = oEvent.getParameter("copy");
			const oAppointmentContext = oAppointment.getBindingContext("model");
			const oCalendarRowContext = oCalendarRow.getBindingContext("model");

			if (bCopy) {
				const sAppointmentPath = oAppointment.getBindingContext().getPath();
				const oAppointmentProp = { ...oViewModel.getProperty(sAppointmentPath) };

				Object.assign(oAppointmentProp, {
					Start: oStartDate,
					End: oEndDate
				});

				oCalendarRowContext.getObject("Appointments").push(oAppointmentProp);
			} else {
				oViewModel.setProperty("Start", oStartDate, oAppointmentContext);
				oViewModel.setProperty("End", oEndDate, oAppointmentContext);

				if (oAppointment.getParent() !== oCalendarRow) this.setAppointmentDropBetweenRows(oViewModel, oAppointmentContext, oCalendarRowContext);
			}

			oViewModel.refresh(true);
		},

		onAppointmentResize(oEvent) {
			const oAppointment = oEvent.getParameter("appointment");
			const oCalendarRow = oAppointment.getParent();
			const sTitle = oAppointment.getTitle();
			const oStartDate = oEvent.getParameter("startDate");
			const oEndDate = oEvent.getParameter("endDate");

			if (!this.checkAppointmentOverlap(oEvent, oCalendarRow)) {
				MessageToast.show("Appointment '" + sTitle + "' now starts at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");
				oAppointment.setStartDate(oStartDate).setEndDate(oEndDate);
			} else {
				MessageToast.show("As a manager you can not resize events if they overlap with another events");
			}
		},

		async onAppointmentSelect(oEvent) {
			const oAppointment = oEvent.getParameter("appointment");

			if (!oAppointment) return;

			if (!oAppointment.getSelected() && this.oAppointmentPopover) {
				this.oAppointmentPopover.close();
				return;
			}

			if (!this.oAppointmentPopover) {
				this.oAppointmentPopover = await this.loadFragment({
					name: "com.sm.template.fragments.dialog.Detail",
					controller: this
				}).then((oAppointmentPopover) => {
					oAppointmentPopover.setModel(this.getModel("i18n"), "i18n");
					oAppointmentPopover.setModel(this.getModel("model"), "model");
					this.getView().addDependent(oAppointmentPopover);
					return oAppointmentPopover;
				});
			}

			this.oAppointmentPopover.attachBeforeOpen(() => {
				this.setDetailPopoverContent(oAppointment);
			});

			this.oAppointmentPopover.openBy(oAppointment);
		},

		onChangeDates(oEvent) {
			const bValid = oEvent.getParameter("valid");
			const oDatePicker = oEvent.getSource();
			const oStartDate = this.byId("StartDate");
			const oEndDate = this.byId("EndDate");

			if (bValid) {
				this.validateDateTime(oStartDate, oEndDate);
			} else {
				oDatePicker.setValueState("Error");
			}

			this.updateButtonEnabledState();
		},

		onDeleteAppointment() {
			const oDetailPopover = this.byId("DetailPopover");
			const sPath = oDetailPopover.getBindingContext("model").getPath();
			const [, , sPersonID, , sAppointmentID] = sPath.split("/");

			this.removeAppointment(sPersonID, sAppointmentID);

			this.oAppointmentPopover.close();
		},

		onSaveAppointment() {
			const oViewModel = this.getModel("model");
			const oAppointment = oViewModel.getProperty("/Appointment");
			const oStartDate = this.byId("StartDate");
			const oEndDate = this.byId("EndDate");

			if (oStartDate.getValueState() === "Error" || oEndDate.getValueState() === "Error") return;

			const oNewAppointment = {
				Title: oAppointment.Title,
				Info: oAppointment.Info,
				Start: oStartDate.getDateValue(),
				End: oEndDate.getDateValue()
			};

			if (this.sPath && this.oAppointmentDialog._iDialogType === 1) { // Edit
				oNewAppointment.Type = this.byId("DetailPopover").getBindingContext("model").getProperty("/Type");

				this.editAppointment(oNewAppointment);
				// this.editAppointment({
				//     title: sInputTitle,
				//     info: sInfoValue,
				//     type: this.byId("detailsPopover").getBindingContext().getObject().type,
				//     start: oStartDate.getDateValue(),
				//     end: oEndDate.getDateValue()
				// }, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog);
			} else { // Create
				this.addNewAppointment(oNewAppointment);
			}

			oViewModel.updateBindings();
			this.oAppointmentDialog.close();
		},

		onShowCreateAppointment() {
			this.showAppointment(0); // Create
		},

		onShowEditAppointment() {
			const oDetailPopover = this.byId("DetailPopover");

			this.sPath = oDetailPopover.getBindingContext("model").getPath();

			oDetailPopover.close();

			this.showAppointment(1); // Edit
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addNewAppointment(oAppointment) {
			const oViewModel = this.getModel("model");
			const sPersonNameIndex = this.byId("AppointmentName").getSelectedIndex().toString();
			const sPath = "/People/" + sPersonNameIndex + "/Appointments";
			const aPersonAppointments = oViewModel.getProperty(sPath) || [];

			aPersonAppointments.push(oAppointment);
			oViewModel.setProperty(sPath, aPersonAppointments);
		},

		appointmentOwnerChange() {
			const sPathPersonID = this.sPath.split("/People/")[1]?.[0];
			const sPersonNameIndex = this.byId("AppointmentName").getSelectedIndex().toString();
			const sLastElementIndex = this.getModel("model").getProperty(`/People/${sPersonNameIndex}/Appointments/`).length.toString();

			return sPathPersonID !== sPersonNameIndex
				? `/People/${sPersonNameIndex}/Appointments/${sLastElementIndex}`
				: this.sPath;
		},

		arrangeAppointmentDialog(iDialogType) {
			const aDialogTypes = this.getModel("model").getProperty("/DialogTypes");
			let sTitle = "";

			switch (iDialogType) {
				case 0:
					this.setCreateAppointmentDialogContent();
					sTitle = aDialogTypes[0].Title;
					break;
				case 1:
					this.setEditAppointmentDialogContent();
					sTitle = aDialogTypes[1].Title;
					break;
			}

			this.updateButtonEnabledState();

			this.oAppointmentDialog._iDialogType = iDialogType;
			this.oAppointmentDialog.setTitle(sTitle);
		},

		checkAppointmentOverlap(oEvent, oCalendarRow) {
			const oAppointment = oEvent.getParameter("appointment");
			const oStartDate = oEvent.getParameter("startDate");
			const oEndDate = oEvent.getParameter("endDate");
			let bAppointmentOverlapped = false;

			bAppointmentOverlapped = oCalendarRow.getAppointments().some((oCurrentAppointment) => {
				if (oCurrentAppointment === oAppointment) return;

				const oAppStartTime = oCurrentAppointment.getStartDate().getTime();
				const oAppEndTime = oCurrentAppointment.getEndDate().getTime();

				if (oAppStartTime <= oStartDate.getTime() && oStartDate.getTime() < oAppEndTime) return true;

				if (oAppStartTime < oEndDate.getTime() && oEndDate.getTime() <= oAppEndTime) return true;

				if (oStartDate.getTime() <= oAppStartTime && oAppStartTime < oEndDate.getTime()) return true;
			});

			return bAppointmentOverlapped;
		},

		editAppointment(oNewAppointment) {
			const sAppointmentPath = this.appointmentOwnerChange();

			if (this.sPath !== sAppointmentPath) {
				const [, , sPersonID, , sAppointmentID] = this.sPath.split("/");

				this.addNewAppointment(oNewAppointment);
				this.removeAppointment(sPersonID, sAppointmentID);
			}

			this.getModel("model").setProperty(`${sAppointmentPath}/`, oNewAppointment);
		},

		formatDate(oDate) {
			if (oDate) {
				const iHours = oDate.getHours();
				const iMinutes = oDate.getMinutes();
				const iSeconds = oDate.getSeconds();

				if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
					return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
				} else {
					return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
				}
			}
		},

		getImage: (sImagePath) => `${jQuery.sap.getModulePath("com.sm.template")}/assets/${sImagePath}`,

		getSelectedAppointments: () => this.byId("PlanningCalendar").getSelectedAppointments(),

		patternMatched() {
			const oData = {
				"Appointment": {
					"Name": ""
				},
				"DialogTypes": [
					{
						"Title": "Create Appointment", "Type": "Create"
					},
					{
						"Title": "Edit Appointment", "Type": "Edit"
					}
				],
				"StartDate": new Date(2024, 9, 22, 8, 0),
				"People": [
					{
						"Name": "John Miller",
						"Picture": this.getImage("JohnMiller.png"),
						"Role": "Team Member",
						"Appointments": [
							{
								"Start": new Date(2024, 9, 22, 8, 30),
								"End": new Date(2024, 9, 22, 9, 30),
								"Title": "Meet Max Mustermann",
								"Type": "Type02",
								"Tentative": false
							},
							{
								"Start": new Date(2024, 9, 22, 10, 30),
								"End": new Date(2024, 9, 22, 12, 30),
								"Title": "Team meeting",
								"Info": "Room 1",
								"Type": "Type01",
								"Pic": "sap-icon://sap-ui5",
								"Tentative": false
							},
							{
								"Start": new Date(2024, 9, 22, 11, 30),
								"End": new Date(2024, 9, 22, 13, 30),
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
								"Start": new Date(2024, 9, 22, 18, 0),
								"End": new Date(2024, 9, 22, 19, 10),
								"Title": "Discussion of the Plan",
								"Info": "Online meeting",
								"Type": "Type04",
								"Tentative": false
							}
						]
					}
				]
			};

			this.getModel("model").setProperty("/", oData);
		},

		removeAppointment(sPersonID, sAppointmentID) {
			const oViewModel = this.getModel("model");
			const sPath = `/People/${sPersonID}/Appointments`;
			const aAppointments = oViewModel.getProperty(sPath);

			if (aAppointments && aAppointments.length > sAppointmentID) {
				aAppointments.splice(sAppointmentID, 1);
				oViewModel.setProperty(sPath, aAppointments);
			}
		},

		setAppointmentDropBetweenRows(oViewModel, oAppointmentContext, oCalendarRowContext) {
			const sAppointmentContextPath = oAppointmentContext.getPath();
			const aPaths = sAppointmentContextPath.split("/");
			const iIndex = aPaths.pop();
			const sRowAppointmentPath = aPaths.join("/");
			const oAppointment = oViewModel.getProperty(sAppointmentContextPath);
			const aAppointments = oCalendarRowContext.getObject("Appointments");

			aAppointments.push(oAppointment);

			oViewModel.getProperty(sRowAppointmentPath).splice(iIndex, 1);
		},

		setCreateAppointmentDialogContent() {
			const oAppointmentName = this.byId("AppointmentName");
			const oViewModel = this.getModel("model");
			const oAppointment = {
				"Name": "",
				"Title": "",
				"StartDate": null,
				"EndDate": null,
				"Info": ""
			};

			oViewModel.setProperty("/Appointment", oAppointment);
			oAppointmentName.setSelectedItem(oAppointmentName.getItems()[0]);
		},

		setDetailPopoverContent(oAppointment) {
			const sAppointmentPath = oAppointment.getBindingContext("model").getPath();
			const sPopoverPath = "model>" + sAppointmentPath;

			this.oAppointmentPopover.bindElement({ path: sPopoverPath });
		},

		setEditAppointmentDialogContent() {
			const oViewModel = this.getModel("model");
			const oSelectedAppointment = oViewModel.getProperty(this.sPath);
			const [, , iPersonID, , ,] = this.sPath.split("/");
			const oAppointment = {
				"Name": "",
				"Title": oSelectedAppointment.Title,
				"StartDate": oSelectedAppointment.Start,
				"EndDate": oSelectedAppointment.End,
				"Info": oSelectedAppointment.Info,
			};
			const oAppointmentName = this.byId("AppointmentName");
			const oStartDate = this.byId("StartDate");
			const oEndDate = this.byId("EndDate");

			oViewModel.setProperty("/Appointment", oAppointment);

			oAppointmentName.setSelectedIndex(iPersonID);
			oStartDate.setDateValue(oSelectedAppointment.Start);
			oStartDate.setValueState("None");
			oEndDate.setDateValue(oSelectedAppointment.End);
			oEndDate.setValueState("None");
		},

		async showAppointment(iDialogType) {
			if (!this.oAppointmentDialog) {
				this.oAppointmentDialog = await this.loadFragment({
					name: "com.sm.template.fragments.dialog.Appointment",
					controller: this
				});

				oAppointmentDialog.setModel(this.getModel("i18n"), "i18n");
				oAppointmentDialog.setModel(this.getModel("model"), "model");
				this.getView().addDependent(oAppointmentDialog);
			}

			this.oAppointmentDialog.attachBeforeOpen(() => this.arrangeAppointmentDialog(iDialogType));
			this.oAppointmentDialog.open();
		},

		updateButtonEnabledState() {
			const oStartDate = this.byId("StartDate");
			const oEndDate = this.byId("EndDate");
			const bEnabled =
				oStartDate.getValueState() !== "Error" && oStartDate.getValue() !== "" && oEndDate.getValue() !== "" && oEndDate.getValueState() !== "Error";

			this.oAppointmentDialog.getBeginButton().setEnabled(bEnabled);
		},

		validateDateTime(oStartDate, oEndDate) {
			const oStartDateValue = oStartDate.getDateValue();
			const oEndDateValue = oEndDate.getDateValue();
			const sValueStateText = "Start date should be before End date";

			if (oStartDateValue && oEndDateValue && oEndDateValue.getTime() <= oStartDateValue.getTime()) {
				oStartDate.setValueState("Error");
				oEndDate.setValueState("Error");
				oStartDate.setValueStateText(sValueStateText);
				oEndDate.setValueStateText(sValueStateText);
			} else {
				oStartDate.setValueState("None");
				oEndDate.setValueState("None");
			}
		}

	});
});