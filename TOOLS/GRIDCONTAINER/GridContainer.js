sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/f/Card",
	"sap/f/cards/Header",
	"sap/f/dnd/GridDropInfo",
	"sap/f/GridContainerItemLayoutData",
	"sap/m/Label",
	"sap/m/Link",
	"sap/m/Text",
	"sap/ui/core/dnd/DragInfo",
	"sap/ui/layout/form/SimpleForm"
], (BaseController, JSONModel, Card, Header, GridDropInfo, GridContainerItemLayoutData, Label, Link, Text, DragInfo, SimpleForm) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Educations: [
					{
						Company: "NTT DATA Business Solutions Turkey",
						Course: "Clean SAPUI5",
						Educator: "Serhat Mercan",
						Format: "Broadcast",
						Time: "2 Hours",
						Type: "Internal",
						Subjects: [
							"Comments",
							"Conditional Complexity",
							"Density",
							"Error Handling",
							"Function",
							"Horizontal Alignment",
							"Hungarian Notation",
							"JS ES6+ Features",
							"Model View Controller (MVC)",
							"Naming",
							"SAP Fiori Floorplans",
							"Ternary Operators"
						]
					}
				],
				Items: [],
				ItemSelected: false,
				Layout: "2-3-1",
				Layouts: [
					{ Key: "1", ID: "GCI" },
					{ Key: "2", ID: "GCII" },
					{ Key: "3", ID: "GCIII" }
				],
				Value: ""
			});

			this.setModel(oViewModel, "model");

			const oGC = this.byId("GC");

			oGC.addDragDropConfig(new DragInfo({
				sourceAggregation: "items"
			}));

			oGC.addDragDropConfig(new GridDropInfo({
				targetAggregation: "items",
				dropPosition: "Between",
				dropLayout: "Horizontal",
				drop: this.onDropGC.bind(this)
			}));

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onDropGC(oInfo) {
			const oDragged = oInfo.getParameter("draggedControl");
			const oDropped = oInfo.getParameter("droppedControl");
			const sInsertPosition = oInfo.getParameter("dropPosition");
			const oGC = oDragged.getParent();
			let iDragPosition = oGC.indexOfItem(oDragged);
			let iDropPosition = oGC.indexOfItem(oDropped);

			oGC.removeItem(oDragged);

			if (iDragPosition < iDropPosition) {
				iDropPosition--;
			}

			if (sInsertPosition === "After") {
				iDropPosition++;
			}

			oGC.insertItem(oDragged, iDropPosition);
		},

		onGenerateGC() {
			const oGC = this.byId("GC");
			const oModel = this.getModel("model");

			oModel.getProperty("/Educations").forEach(oEducation => {
				oGC.addItem(new Card({
					layoutData: new GridContainerItemLayoutData({ columns: 4 }),
					header: new Header({
						title: oEducation.Company,
						subtitle: oEducation.Type
					}),
					content: new SimpleForm({
						content: [
							new Label({
								text: "Course",
								class: "sapUiSmallMarginEnd",
								design: "Bold",
								width: "8rem"
							}),
							new Link({
								text: oEducation.Course,
								emphasized: true,
								press: this.onShowCourseDetail.bind(this)
							}),
							new Label({
								text: "Format",
								class: "sapUiSmallMarginEnd",
								design: "Bold",
								width: "8rem"
							}),
							new Text({ text: oEducation.Format }),
							new Label({
								text: "Time",
								class: "sapUiSmallMarginEnd",
								design: "Bold",
								width: "8rem"
							}),
							new Text({ text: oEducation.Time }),
							new Label({
								text: "Educator",
								class: "sapUiSmallMarginEnd",
								design: "Bold",
								width: "8rem"
							}),
							new Text({ text: oEducation.Educator })
						]
					})
				}));
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		generateGC() {
			const oViewModel = this.getModel("model");
			const aLayouts = oViewModel.getProperty("/Layouts");
			const sLayout = oViewModel.getProperty("/Layout");
			const aGCItems = this.byId("GC").getItems();

			if (sLayout) {
				sLayout.split("-").forEach((sKey, iIndex) => {
					const oItem = aGCItems.find(aGCItem => aGCItem.getId().endsWith(aLayouts.find(oLayout => oLayout.Key === sKey).ID));

					this.byId("GC").removeItem(oItem);
					this.byId("GC").insertItem(oItem, iIndex);
				});
			}
		},

		saveLayout() {
			const oViewModel = this.getModel("model");
			const aKeys = [];
			const aLayouts = oViewModel.getProperty("/Layouts");
			let sLayout = "";

			this.byId("GC").getItems().forEach(oItem => {
				aKeys.push(aLayouts.find(oLayout => oLayout.ID === oItem.getId().split("-").pop()).Key);
			});

			sLayout = aKeys.join("-");
			oViewModel.setProperty("/Layout", sLayout);
		},

		patternMatched() {
			this.byId("GC").destroyItems();
			this.onGenerateGC();
		}

	});

});