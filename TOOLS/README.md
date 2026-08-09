# TOOLS Index

Reference/cookbook fragments and mini-apps for individual SAPUI5 controls, one folder per control (or control family). Most folders are **cookbooks**: a single XML snippet showing the control plus a large commented block of alternative attributes/handlers/layouts that is never loaded as-is — it's copy-paste reference material. A smaller set are **apps**: multi-file mini-applications (controller + view + manifest/fragments) that actually run.

Legend — **Type**: C = cookbook (reference snippet), A = app (runnable mini-app). **Files**: file types present (x=xml, j=js, i=i18n, m=manifest/model json, other=images/abap/xsd/etc).

| Folder | Control(s) | Library | Files | Type | Notes |
|---|---|---|---|---|---|
| ACTIONSHEET | ActionSheet | sap.m | x | C | |
| AVATAR | Avatar | sap.m | x | C | |
| BARCODESCANNER | BarcodeScanner | sap.m + sap.ndc | x,j | C | |
| BLOCKLAYOUT | BlockLayout | sap.m / sap.ui.layout | x | C | |
| BOOKMARK | AddBookmarkButton | sap.m + sap.ushell.ui.footerbar | x | C | |
| BREADCRUMBS | Breadcrumbs | sap.m | x | C | |
| BUSYINDICATOR | BusyIndicator | sap.ui.core (static API) | j | C | JS-only, no XML needed |
| BUTTON | Button | sap.m | x,j | C | reviewed; stray empty comment removed |
| CALENDARLEGEND | CalendarLegend | sap.ui.unified | x,j | C | two xml files (control + usage) |
| CARD | Card | sap.f.cards | x | C | |
| CAROUSEL | Carousel | sap.m | x,j | C | |
| CHARTCONTAINER | ChartContainer | sap.m + sap.viz / sap.suite.ui.commons | x,j | C | |
| CHECKBOX | CheckBox | sap.m | x,j | C | |
| COMBOBOX | ComboBox | sap.m | x,j | C | |
| CSSGRID | CSSGrid | sap.ui.layout.cssgrid | x | C | fixed: `mvc:View` used `xmlns:mvc` was never declared |
| CURRENCY | Currency (unified) | sap.m | x | C | |
| DATE | DatePicker-adjacent Date helpers | sap.m | x,j | C | |
| DATEPICKER | DatePicker | sap.m | x,j | C | |
| DIALOG | Dialog / ConfirmDialog | sap.m | x,j | C | reviewed; escapeHandler leading-dot fixed, Fragment.byId usage labeled legacy |
| DYNAMICPAGE | DynamicPage | sap.f | x | C | |
| DYNAMICSIDECONTENT | DynamicSideContent | sap.ui.layout | x | C | |
| FEEDINPUT | FeedInput | sap.m | x,j | C | |
| FILEUPLOADER | FileUploader | sap.m / sap.ui.unified | x,j | C | |
| FILTERBAR | FilterBar | sap.ui.comp.filterbar | x,j | C | |
| FLEXBOX | FlexBox | sap.m | x,j | C | includes a Detail.fragment.xml |
| FLEXIBLECOLUMNLAYOUT | FlexibleColumnLayout | sap.f / sap.uxap | x,j,m | A | full mini-app: Main/Detail/DetailX controllers+views, manifest.json, model.json, fragments/ |
| FORM | Form | sap.ui.layout.form | x | C | |
| FORMATTEDTEXT | FormattedText | sap.m | x | C | |
| FRAGMENT | Fragment (concept demo) | sap.ui.core | x | C | |
| GANTTCHART | GanttChart | sap.gantt.simple | x,j,i | A | Formatter.js + GanttChart.js/xml + GanttChartDetail.xml + i18n |
| GENERICTAG | GenericTag | sap.m | x | C | |
| GENERICTILE | GenericTile | sap.f | x,j | C | |
| GRID | Grid | sap.ui.layout | x | C | |
| GRIDCONTAINER | GridContainer | sap.f | x,j | C | |
| GRIDLIST | GridList | sap.f / sap.ui.layout.cssgrid | x | C | |
| GRIDTABLE - UI | sap.ui.table.Table (drag/drop) | sap.ui.table | x,j | C | reviewed; getDragControl() arg removed, undefined `formatter` in factory() flagged |
| HBOX | HBox | sap.m | x | C | |
| HORIZONTALLAYOUT | HorizontalLayout | sap.ui.layout | x,j | C | |
| HTML | HTML control | sap.ui.core | x,j | C | |
| ICON | Icon | sap.m | x | C | |
| ICONTABBAR | IconTabBar | sap.m | x,j | C | |
| ILLUSTRATEDMESSAGE | IllustratedMessage | sap.m | x,j | C | |
| IMAGE | Image | sap.m | x,j | C | includes Formatter.js |
| INFOLABEL | InfoLabel | sap.m | x | C | |
| INPUT | Input (+ value help / search help) | sap.m | x,j | A | multiple fragments (InputSHList, SmartSearchHelp) + Annotation.xml; reviewed, curly-quote typo fixed |
| LABEL | Label | sap.m | x | C | |
| LINK | Link | sap.m | x,j | C | |
| LIST | List | sap.m | x,j | C | |
| LISTSELECTOR | ListSelector helper | sap.m (controller pattern) | j | C | JS-only; reviewed — noted undefined placeholder vars (oElementBinding, sBindingPath) are illustrative, not runnable as-is |
| MENUBUTTON | MenuButton | sap.m | x,j | C | |
| MESSAGEBOX | MessageBox | sap.m (static API) | j | C | JS-only |
| MESSAGEPAGE | MessagePage | sap.m | x,i | C | |
| MESSAGEPOPOVER | MessagePopover | sap.m | x,j,i | A | reviewed; Turkish i18n string translated, legacy getMessageManager() labeled, addDialog() noted as pairing with a dialog created elsewhere |
| MESSAGESTRIP | MessageStrip | sap.m | x | C | |
| MESSAGETOAST | MessageToast | sap.m (static API) | j | C | JS-only |
| MICROCHART-BULLET | BulletMicroChart | sap.suite.ui.microchart | x | C | |
| MICROCHART-COLUMN | ColumnMicroChart | sap.suite.ui.microchart | x | C | |
| MULTICOMBOBOX | MultiComboBox | sap.m | x,j | C | |
| MULTIINPUTTOKEN | MultiInput / Tokens | sap.m | x,j | A | reviewed; pointless getCore().byId() round-trips removed, getParameters->getParameter fixed, Fragment.xml noted as side-by-side reference of two dialog shapes (never loaded as-is), alpha-regex naming note added |
| NAVIGATIONLIST | NavigationList | sap.m / sap.tnt | x,j | C | |
| NETWORKGRAPH | Graph | sap.suite.ui.commons.networkgraph(.layout) | x,j | C | |
| NOTIFICATIONLIST | NotificationList(Item) | sap.m | x,j | C | |
| OBJECTHEADER | ObjectHeader | sap.m (implicit, no wrapper) | x | C | bare snippet, no FragmentDefinition wrapper — intentional, matches TOOLBAR/TILECONTAINER pattern |
| OBJECTIDENTIFIER | ObjectIdentifier | sap.m | x,j | C | |
| OBJECTLISTITEM | ObjectListItem | sap.m | x,j,other | C | includes a .png and .xsd alongside the usual x/j |
| OBJECTNUMBER | ObjectNumber | sap.m | x,j | C | |
| OBJECTPAGELAYOUT | ObjectPageLayout | sap.uxap | x,j | C | large commented LAYOUT/EXAMPLE blocks use a `form:` prefix that doesn't match the live `smartForm:` declaration — doc-only inconsistency inside a comment, not live XML |
| OBJECTSTATUS | ObjectStatus | sap.m | x,j | C | |
| OVERFLOWTOOLBAR | OverflowToolbar | sap.m | x | C | |
| PAGE | Page | sap.m | x,j | C | |
| PANEL | Panel | sap.m | x,j | C | |
| PLANNINGCALENDAR | PlanningCalendar | sap.m / sap.ui.unified | x,j,other | A | assets/ (sample images) + fragments/dialog + controller |
| POPOVER | Popover | sap.m / sap.ui.comp | x,j | A | live root only declares smartForm/smartTable; commented CONTENT block also references `smartField:` without declaring it — doc-only, not live XML |
| PROCESSFLOW | ProcessFlow | sap.suite.ui.commons | x,j | C | |
| PROGRESSINDICATOR | ProgressIndicator | sap.m | x | C | |
| RADIOBUTTON | RadioButton(Group) | sap.m | x,j | C | |
| RATINGINDICATOR | RatingIndicator | sap.m | x | C | |
| RESPONSIVETABLE - M | sap.m.Table | sap.m | x,j | C | reviewed; undefined `oModel`->`oViewModel` fixed, sap.ui.core.ValueState global replaced with proper import |
| RICHTEXTEDITOR | RichTextEditor | sap.ui.richtexteditor + sap.ui.comp.smartform | x,j | C | |
| SCROLLCONTAINER | ScrollContainer | sap.m | x | C | |
| SEARCHFIELD | SearchField | sap.m | x,j | C | |
| SEGMENTEDBUTTON | SegmentedButton | sap.m | x,j | C | |
| SELECT | Select | sap.m | x,j | C | |
| SELECTDIALOG | SelectDialog | sap.m | x,j,other | C | includes a .png |
| SEMANTICDETAILPAGE | SemanticPage (detail) | sap.m.semantic | x,j | C | |
| SEMANTICMASTERPAGE | SemanticPage (master) + split menu | sap.m | x,j,m | A | App + Menu controller/view pairs, Manifest.json, Menu.json |
| SEMANTICPAGE - F | SemanticPage | sap.f.semantic | x,j | C | fixed: `mvc:View` and `core:Fragment` used but `xmlns:mvc`/`xmlns:core` were never declared |
| SEMANTICPAGE - M | SemanticPage | sap.m.semantic | x,j | C | |
| SEMANTICPAGEMD | SemanticPage (master-detail) | sap.m.semantic | x,j,m | C | includes Menu.json |
| SIMPLEFORM | SimpleForm | sap.ui.layout.form | x,j | C | |
| SINGLEPLANNINGCALENDAR | SinglePlanningCalendar | sap.m | x,j | A | Appointment.xml sub-fragment |
| SLIDER | Slider | sap.m | x | C | |
| SLIDETILE | SlideTile | sap.m | x,j | C | |
| SMARTCHART | SmartChart | sap.ui.comp.smartchart | x,j | A | annotation.xml alongside control |
| SMARTFIELD | SmartField | sap.ui.comp.smartfield | x,j | A | Annotation.xml alongside control |
| SMARTFILTERBAR | SmartFilterBar | sap.ui.comp.smartfilterbar | x,j | C | fixed real defect: `initialized=` -> `initialise=` (SmartFilterBar's actual event name uses the British spelling, not a typo) |
| SMARTFORM | SmartForm | sap.ui.comp.smartform | x,j | C | commented GROUP ELEMENT examples use lowercase `smartform:`/`smartfield:` inconsistently vs. the live `smartForm:`/`smartField:` — doc-only, not live XML |
| SMARTMULTIINPUT | SmartMultiInput | sap.ui.comp.smartmultiinput | x,j | C | fixed: live `<smartMultiInput:SmartMultiInput>` used without declaring `xmlns:smartMultiInput` — broken XML |
| SMARTTABLE | SmartTable | sap.ui.comp.smarttable / sap.ui.table | x,j | C | |
| SPLITAPP | SplitApp | sap.m | x,j | C | |
| SPLITTER | Splitter (+ sap.ui.table.Table) | sap.ui.layout | x | C | bare snippet, no wrapper; added missing `xmlns:ui="sap.ui.table"` to the documentation comment (the `ui:Table` prefix used below it wasn't documented) |
| SPREADSHEET | Spreadsheet (export) | sap.ui.export | x,j | C | |
| STEPINPUT | StepInput | sap.m | x | C | |
| SWITCH | Switch | sap.m | x,j | C | |
| TABCONTAINER | TabContainer | sap.m | x,j | C | |
| TABLESELECTDIALOG | TableSelectDialog | sap.m | x,j | C | |
| TEMPLATE | generic controller/view scaffold | sap.m | x,j | A | starting-point template, not a specific control |
| TEXT | Text | sap.m | x,j | C | |
| TEXTAREA | TextArea | sap.m | x | C | |
| TILECONTAINER | TileContainer | sap.m (implicit, no wrapper) | x,j | C | bare snippet, no wrapper; matches OBJECTHEADER/TOOLBAR pattern |
| TILECONTENT | TileContent | sap.m | x | C | |
| TIME | Time input helpers | sap.m | x | C | |
| TIMEPICKER | TimePicker | sap.m | x,j | C | |
| TITLE | Title | sap.m | x | C | |
| TOGGLEBUTTON | ToggleButton | sap.m | x | C | |
| TOOLBAR | Toolbar | sap.m (implicit, no wrapper) | x | C | bare snippet, no wrapper |
| TREETABLE - GW | sap.ui.table.TreeTable (Gateway/OData) | sap.ui.table | x,j,other | A | includes ABAP/ backend snippets + IMAGES/ screenshots; reviewed, xmlns:table declared but t: prefix used — fixed to xmlns:t |
| TREETABLE - UI | sap.ui.table.TreeTable (client-side) | sap.ui.table | x,j,m | A | reviewed; onAddDataToTreeTable binding/array mixup fixed, getParameters->getParameter fixed |
| VALUEHELPDIALOG | ValueHelpDialog | sap.ui.comp.valuehelpdialog + sap.ui.comp.filterbar | x,j | A | View.xml + ValueHelpDialog.js/xml |
| VBOX | VBox | sap.m | x | C | |
| VERTICALLAYOUT | VerticalLayout | sap.ui.layout | x,j | C | |
| VIEWSETTINGSDIALOG | ViewSettingsDialog | sap.m | x,j | A | View.xml + fragment + controller |
| WIZARD | Wizard | sap.m | x | C | |

## Defects fixed this pass

Beyond the items already fixed in earlier sessions (Input/Button/Dialog/MessagePopover/MultiInputToken/tables — see git history), this pass fixed:

- **CSSGRID/CSSGrid.xml** — `mvc:View` used without declaring `xmlns:mvc`.
- **SEMANTICPAGE - F/SemanticPage.xml** — `mvc:View`/`core:Fragment` used without declaring `xmlns:mvc`/`xmlns:core`.
- **SMARTMULTIINPUT/SmartMultiInput.xml** — `smartMultiInput:SmartMultiInput` used without declaring `xmlns:smartMultiInput`.
- **SPLITTER/Splitter.xml** — documented namespace comment was missing `xmlns:ui="sap.ui.table"`, needed by the `ui:Table` elements below it.
- **SMARTFILTERBAR/SmartFilterBar.xml** — `initialized=` corrected to `initialise=` (the actual SmartFilterBar API event name; British spelling is correct, not a typo).
- **LISTSELECTOR/ListSelector.js** — noted that `oElementBinding`/`sBindingPath` are illustrative placeholders, not values defined in the shown code.
- **MESSAGEPOPOVER/Controller.js** — noted `addDialog()` pairs with a dialog created elsewhere (`this.oDialog` is not set up in this file).
- **MULTIINPUTTOKEN/Fragment.xml** — noted the file is a side-by-side reference of two dialog shapes (TableSelectDialog vs. SelectDialog), never loaded as-is since a fragment can only have one root.
- **FORMAT/Formatter.js & MULTIINPUTTOKEN/Formatter.js** — noted the `bAlpha`/`validField` regexes match a broader character class (symbols too), not just letters.

Several other "undeclared prefix" hits during the scan turned out to be **inside commented-out documentation blocks** (OBJECTPAGELAYOUT's `form:` vs `smartForm:`, POPOVER's `smartField:`, SMARTFORM's lowercase `smartform:`/`smartfield:`, SEMANTICPAGE - F/LIST/SMARTFILTERBAR's `core:`) — left as-is since they're reference text, not live markup that XML parsers would choke on.

No deep line-by-line defect review was performed on every folder (that wasn't the goal of this pass) — folders not called out above were classified but not audited in depth.
