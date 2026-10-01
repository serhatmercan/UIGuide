# SAPUI5 Development Rules for GitHub Copilot

You are assisting with the development of an SAPUI5 application in VS Code.
Follow the rules below strictly when generating, refactoring, or extending code.

> These rules apply to **new and modified** code in this repository. They are
> not retroactive justification to delete or rewrite existing historical/legacy
> reference examples — see the main [README](../README.md) for how this guide
> treats legacy vs. modern patterns.

## 1. General Development Principles

- Always write clean, maintainable, optimized, and performance-conscious SAPUI5 code.
- Follow SAPUI5 best practices and avoid deprecated controls, APIs, or properties.
- Always check whether the generated code is compatible with the SAPUI5 version defined in `manifest.json`.
- Use ES6 / ES7 syntax.
- Do not use `var`. Always use `const` or `let`.
- Use optional chaining and safe fallback values to avoid undefined errors.

  ```js
  const aUnits = oData?.results || [];
  const iLength = oData?.results?.length || 0;
  oViewModel.setProperty(`${sPath}/Color`, "");
  ```

- Do not create UI controls dynamically in controllers unless absolutely necessary.
- UI controls must be defined in XML views or XML fragments.
- Avoid unnecessary global variables.
- Avoid using `this._aOpenTabs = []` or similar controller-level variables unless there is a strong technical reason.
- Do not use `sap.ui.getCore()` to access controls or values.
- Do not use `this.getView().byId()` to read or change control values if the value can be handled through binding.
- Prefer model binding, `getProperty`, and `setProperty` over direct control manipulation.
- Do not use performance-heavy code such as `this.getModel().setSizeLimit()` unless explicitly required and justified.
- All variable names, method names, model names, comments, and technical definitions must be in English.
- Do not write Turkish text anywhere except in `i18n_tr.properties`.

## 2. Project Structure Rules

- Do not modify `App.view.xml` unless explicitly requested.
- Use `Main.view.xml` as the main application screen.
- Do not modify `App.controller.js` unless explicitly requested.
- `App.controller.js` already contains the global message model.
- `App.controller.js` already contains the global BusyIndicator logic.
- Do not add extra BusyIndicator handling for OData operations unless explicitly required.
- All JavaScript controllers except `App.controller.js` must extend `BaseController`.
- Do not modify existing methods in `BaseController.js` unless explicitly requested.
- If a reusable method is required across multiple controllers, add it to `BaseController.js`.
- If fragments are needed, create the following folder structure under `webapp`:

  ```
  webapp/
    fragments/
      Dialog/
      View/
  ```

- Put popup/dialog fragments under `fragments/Dialog`.
- Put view-related reusable fragments under `fragments/View`.
- If a view has multiple large sections, split them into meaningful fragments.
- Do not keep XML files unnecessarily large.

## 3. Controller Rules

### 3.1 Controller Definition

- Define controllers using arrow function syntax.
- Always extend `BaseController`.

  ```js
  sap.ui.define([
      "./BaseController",
      "sap/ui/model/FilterOperator"
  ], (BaseController, FilterOperator) => {
      "use strict";

      return BaseController.extend("namespace.controller.Main", {
          /* controller methods */
      });
  });
  ```

- Define all dependencies at the top inside `sap.ui.define`.
- Do not instantiate controls using fully qualified names inside controller code, such as `new sap.m.Button`.
- Import required libraries in `sap.ui.define`.

### 3.2 Variable Naming

Use the following prefixes when defining variables:

| Prefix | Type |
|---|---|
| `a` | Array |
| `b` | Boolean |
| `f` | Float |
| `i` | Integer |
| `o` | Object |
| `s` | String |
| `fn` | Function |
| `m` | Map / key-value object |
| `r` | RegExp |

Examples:

```js
const aSalesOrders = [];
const bIsEditable = true;
const fAmount = 10.5;
const iCount = 0;
const oViewModel = this.getModel("viewModel");
const sSalesOrderId = "10000001";
```

Array variable names must be plural and should end with `s`.

Correct: `const aItems = []; const aSalesOrders = [];`
Incorrect: `const aItem = []; const aSalesOrder = [];`

### 3.3 Method Naming

- Use camelCase for all controller methods.
- Event handler methods must start with `on`.
- Internal methods must not start with `on` unless they are triggered directly from the UI.
- Use SAP business-oriented method names.

  ```js
  onCreateSalesOrder()
  onDeleteItem()
  readSalesOrderItems()
  validateRequiredFields()
  ```

### 3.4 Controller Method Organization

Organize controller methods in the following order:

```js
/* ================= */
/* Lifecycle Methods  */
/* ================= */
onInit() {}

/* ============== */
/* Event Handlers */
/* ============== */
onChangeData() {}

/* ================ */
/* Internal Methods */
/* ================ */
patternMatched() {}
```

- Lifecycle Methods must include structural controller methods such as: `onInit`, `onExit`, `onBeforeRendering`, `onAfterRendering`.
- Event Handlers must include methods triggered from XML views or fragments.
- Internal Methods must include helper methods called only inside the controller.
- Sort methods alphabetically inside each category when possible.
- Add short and meaningful comments for controller methods when useful.
- Do not write long or unnecessary comments.

## 4. BaseController Usage Rules

Use existing `BaseController.js` methods whenever possible.

- Use `getModel` to access models.
- Use `getRouter` to access the router.
- Use `getText` to access i18n texts.
- Use `createDialog` when creating dialogs.
- Use `addModelCollectionItem` when adding data to a JSON model collection.
- Use `removeModelCollectionItem` when deleting data from a JSON model collection.
- Use `getCollectionIndexFromEvent` to find the index of an item from an event.
- Use `onClearModel` to reset global JSON model properties to their default values.
- Use `onFireToShowMessages` to display global backend messages returned from OData operations.
- Use `onShowMessages` to open the message popover.
- For OData operations, use the existing CRUDQ methods from `BaseController.js`:
  `onCallFunction`, `onCreate`, `onDelete`, `onRead`, `onReadAssociation`, `onReadExpanded`, `onReadQuery`, `onReadQueryAsyncSorters`, `onReadQueryParameters`, `onSubmitChanges`, `onUpdate`.
- Do not create duplicate OData helper methods in controllers if a suitable method already exists in `BaseController.js`.

## 5. OData, CRUDQ, and Async Rules

- All CRUDQ operations must use `try/catch/finally`.
- CRUDQ operations called from controllers must use async functions.
- Always handle success, warning, and error responses.
- Always show backend messages first if meaningful.
- If backend messages are missing or unclear, create custom messages using i18n.
- Do not ignore errors silently.
- Do not hardcode service messages.
- Always keep OData operation logic readable and separated from UI logic.
- Prefer binding-based operations before using JSON model manipulation.
- Use JSON models only when binding or OData model usage is not suitable.

  ```js
  async onCreateSalesOrder() {
      try {
          await this.onCreate("/SalesOrderSet", this.getModel("viewModel").getProperty("/SalesOrder"));
          this.onFireToShowMessages();
      } catch (oError) {
          MessageBox.error(this.getText("errorCreateSalesOrder"));
      } finally {
      }
  }
  ```

## 6. Confirmation and User Action Rules

- Before any operational or destructive action, ask for user confirmation.
- Use `MessageBox.confirm` for confirmations.
- Use content density class from the owner component.

  ```js
  const oMBAction = MessageBox.Action;

  MessageBox.confirm(this.getText("infoDeleteOperation"), {
      actions: [oMBAction.OK, oMBAction.CANCEL],
      emphasizedAction: oMBAction.OK,
      styleClass: this.getOwnerComponent().getContentDensityClass(),
      onClose: onConfirm
  });
  ```

- Operational actions include but are not limited to: Create, Update, Delete, Submit, Approve, Reject, Release, Cancel, Close, Send, Post.

## 7. XML View and Fragment Rules

### 7.1 XML Control Definition

- Define UI controls in XML views or fragments.
- Do not create UI controls in controllers.
- Do not add comments inside XML files.
- Do not define `id` for XML controls unless required.
- Use event handler method names starting with `on`.

  ```xml
  <Input
      id="MaterialInput"
      value="{viewModel>/Material}"
      editable="false"
      required="true"
      submit="onSubmit" />
  ```

### 7.2 XML Property Ordering

When defining XML control properties, follow this order:

1. `id`
2. Binding properties
3. Basic properties
4. State / condition properties
5. Layout properties
6. Events / methods

Within each group, sort properties alphabetically when possible.

```xml
<Input
    id="MaterialInput"
    description="{viewModel>/MaterialDescription}"
    value="{viewModel>/Material}"
    editable="{viewModel>/IsEditable}"
    required="true"
    submit="onSubmit" />
```

### 7.3 XML Library Usage

- Any SAPUI5 library used in XML must also be declared in `manifest.json`.
- Use SAPUI5 standard controls and libraries first.
- Prefer smart controls when they are suitable.
- If smart controls are not suitable, use simple controls.

  Priority:
  1. Smart controls: `SmartTable`, `SmartForm`, `SmartField`, other smart controls.
  2. Standard controls: `sap.m.Table`, `sap.ui.table.Table`, `SimpleForm`, `FlexBox`, other suitable UI5 controls.

- Smart control metadata extensions must be maintained in `annotations/annotation.xml`.

## 8. Layout and Responsiveness Rules

- All screens must be responsive and work properly on desktop, tablet, and mobile.
- Avoid static widths and heights.
- If fixed spacing or size is required, prefer `rem`.
- Prefer `FlexBox` for layout.
- Use `HBox` and `VBox` only when `FlexBox` is not suitable.
- Use SAP predefined CSS classes before writing custom CSS.

  ```
  class="sapUiSmallMargin"
  class="sapUiMediumMarginBegin"
  class="sapUiResponsiveMargin"
  ```

- Write custom CSS only when SAP predefined classes are not enough.
- CSS properties must be sorted alphabetically.

## 9. Page Type Rules

- For main pages, use `sap.f.semantic.SemanticPage` when appropriate.
- Include relevant SemanticPage aggregations such as: `titleHeading`, `headerContent`, `content`, `footerCustomActions`, `messagesIndicator`.
- For detail pages, use `sap.uxap.ObjectPageLayout` when appropriate.
- Include relevant ObjectPageLayout aggregations such as: `headerTitle`, `headerContent`, `sections`, `subSections`.

## 10. Routing and Manifest Rules

- Route and target names in `manifest.json` must start with an uppercase letter.
- Route name, target name, `viewName`, and `viewId` should be consistent.

  ```json
  "routes": [
      {
          "name": "Main",
          "pattern": "",
          "target": [
              "Main"
          ]
      }
  ],
  "targets": {
      "Main": {
          "viewName": "Main",
          "viewId": "Main"
      }
  }
  ```

- Define all required SAPUI5 libraries in `manifest.json`.
- Define reusable constants in a separate JSON model, such as `constants.json`.
- Do not hardcode constant values in controllers or views if they can be managed centrally.

## 11. Constants and JSON Model Rules

- Define constants in a central JSON file, such as `constants.json`.
- Register the constants model in `manifest.json`.
- Sort all JSON properties alphabetically.
- Use JSON models only when needed.
- Prefer view binding and OData binding before using additional JSON models.
- Reset global JSON model data using `onClearModel`.

  ```json
  {
      "DefaultCurrency": "TRY",
      "MaxItemCount": 100,
      "StatusApproved": "A",
      "StatusRejected": "R"
  }
  ```

## 12. Formatter and Expression Binding Rules

- For simple view formatting, prefer Expression Binding.
- If Expression Binding is not enough, create a method in `formatter.js`.
- Do not write formatting logic directly inside the controller if it belongs to the view.
- Controller-level formatting should also be moved to `formatter.js` when reusable.

  ```xml
  <ObjectStatus
      text="{= ${viewModel>/IsActive} ? ${i18n>active} : ${i18n>inactive} }"
      state="{= ${viewModel>/IsActive} ? 'Success' : 'Error' }" />
  ```

## 13. Dialog Rules

- Create dialogs using the `createDialog` method from `BaseController.js`.
- Place dialog fragments under `webapp/fragments/Dialog`.
- Destroy dialogs in `onExit`.
- Do not keep unnecessary dialog instances alive.
- Do not create dialog controls directly in the controller.
- Use i18n for all dialog titles, buttons, and messages.

## 14. Message Management Rules

- Service and UI messages must be displayed in a proper message management structure.
- Use `MessagePopover` for displaying messages.
- If the UI has a `SemanticPage`, use `MessagesIndicator`.
- If the UI does not have a `SemanticPage`, use a custom message button.
- Use the existing `onShowMessages` method from `BaseController.js`.

  With SemanticPage:
  ```xml
  <sap.f.semantic:MessagesIndicator press="onShowMessages" />
  ```

  With Button:
  ```xml
  <sap.m:Button
      icon="sap-icon://message-popup"
      press="onShowMessages"
      text="{= ${message>/}.length }"
      type="Emphasized"
      visible="{= ${message>/}.length > 0 }" />
  ```

- Use `MessageToast` for short non-critical UI feedback.
- Use `MessageBox` for warnings, confirmations, errors, and important decisions.
- Prefer backend success, warning, and error messages.
- If backend messages are not suitable, use custom i18n messages.

## 15. i18n Rules

- Do not use static text directly in XML, JavaScript, or JSON files.
- Use i18n for all UI texts.
- If a label is available from metadata, prefer metadata label binding.

  ```
  text="{/#ValueAddVH/Valueadd/@sap:label}"
  ```

- Use English keys in all i18n files.
- In `i18n.properties`, keys and texts must be English.
- In `i18n_en.properties`, keys and texts must be English.
- In `i18n_tr.properties`, keys must be English and texts must be Turkish.
- Sort all i18n keys alphabetically within each category.
- Categorize i18n entries using SAP-style prefixes:

  | Prefix | Meaning |
  |---|---|
  | `#XBUT` | Button |
  | `#XCOL` | Column |
  | `#XFLD` | Field |
  | `#XHED` | Heading |
  | `#XLBL` | Label |
  | `#XMSG` | Message |
  | `#XTIT` | Title |
  | `#XTOL` | Tooltip |
  | `#XTXT` | Text |
  | `#YDES` | Description |

  ```properties
  #XMSG: An error occurred
  errorOccurred=An error occurred

  #XBUT: Save
  save=Save

  #XTIT: Sales Order
  salesOrder=Sales Order
  ```

## 16. Naming and Language Rules

- All variable names must be English.
- All method names must be English.
- All model names must be English.
- All technical names must follow SAP business terminology.
- Use meaningful business names.

  Correct: `onCreateSalesOrder()`, `onApprovePurchaseRequest()`, `readMaterialItems()`
  Incorrect: `onCreateData()`, `onButtonPress()`, `onIslemYap()`

- Turkish text is allowed only in `i18n_tr.properties`.

## 17. Smart Control and Annotation Rules

- Prefer smart controls when metadata-driven UI is suitable.
- Maintain smart control annotations in `annotations/annotation.xml`.
- Do not hardcode metadata-driven labels, fields, or value helps if they can be managed via annotations.
- Use Fiori Elements or metadata-driven approaches where appropriate.
- Use manual UI controls only when smart controls or annotations are not suitable.

## 18. Performance Rules

- Avoid unnecessary model refreshes.
- Avoid unnecessary re-rendering.
- Avoid direct DOM manipulation.
- Avoid large JSON models when OData binding is sufficient.
- Avoid loading all data if filtering or paging can be used.
- Avoid synchronous calls.
- Avoid unnecessary `setSizeLimit`.
- Use binding parameters, filters, sorters, and server-side queries where possible.
- Do not perform heavy calculations inside XML bindings.
- Do not create controls repeatedly inside loops unless unavoidable.

## 19. Security and Validation Rules

- Validate user input before sending data to backend services.
- Do not trust frontend-only validation.
- Do not expose sensitive data in console logs.
- Do not log tokens, credentials, personal data, or service responses containing sensitive information.
- Use backend authorization and service-level checks.
- Use frontend validation only for better user experience.
- Use confirmation dialogs before critical operations.

## 20. Logging and Debugging Rules

- Do not leave unnecessary `console.log`, `debugger`, or temporary test code in the final output.
- Use meaningful error handling instead of silent failures.
- If logging is required, use a structured logging approach and avoid sensitive data.

## 21. App-specific Rules

### App.view.xml and App.controller.js

- Do not modify `App.view.xml`.
- Do not use `App.view.xml` as the main application screen.
- Use `Main.view.xml` as the main page.
- Do not modify `App.controller.js` unless explicitly requested.
- Use the existing message model in `App.controller.js`.
- Use the existing global BusyIndicator logic in `App.controller.js`.
- Do not add another global busy handling mechanism for standard OData operations.

### BaseController.js

- Do not change existing methods in `BaseController.js` unless explicitly requested.
- Add reusable shared methods to `BaseController.js` only when they are used by multiple controllers.
- Use existing `BaseController.js` helper methods before creating new ones.

## 22. Output Expectations for Copilot

When generating code:

- Follow the existing project structure.
- Follow the naming conventions in this document.
- Generate only the required files or code blocks.
- Do not make unrelated changes.
- Do not modify existing working logic unless requested.
- Keep the code clean, minimal, and SAPUI5-compliant.
- Prefer binding, annotations, and metadata-driven development.
- Use i18n for every visible text.
- Use XML views/fragments for UI.
- Use controller methods only for logic, event handling, and service orchestration.
- Use `BaseController.js` methods whenever possible.
- Use async CRUDQ methods with `try/catch/finally`.
- Add short comments only where they improve readability.
- Never add Turkish technical names, comments, or UI texts outside `i18n_tr.properties`.
