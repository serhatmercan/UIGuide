# UIGuide — SAPUI5 Control & Pattern Reference

> A code-first SAPUI5 cookbook: **123 control folders**, Fiori Elements pages, OData/SAP Gateway
> examples and reusable formatter/binding patterns, collected across several years of enterprise
> SAP project work — written to be copied from, not read through.

**Start here → [`TOOLS/` control index (123 controls)](TOOLS/README.md)**

## Highlights

- **[`TOOLS/`](TOOLS/README.md)** — 123 control folders, each classified by control, library, file types and cookbook-vs-app in a single index table.
- **Fiori Elements** — Analytical List Page (`ANALYTICALLISTPAGE/`), List Report + Object Page extensions (`LISTREPORT/`), Overview Page (`OVERVIEWPAGE/`), and a controller extension (`EXTENSION/`), with their annotation XML.
- **OData / SAP Gateway** — `TOOLS/TREETABLE - GW/` carries the full stack: the UI5 TreeTable, the ABAP DPC/MPC extension source, and screenshots of the Gateway service definition.
- **Reusable patterns** — `FORMAT/Formatter.js` (formatter library), `BIND/` (data-binding cookbook), `PROMISE/` (async patterns), `CUSTOMCONTROL/` (extending `sap.m.Table`).
- **Legacy *and* modern UI5 side by side** — deliberately preserved rather than modernized away (see [Legacy vs. modern patterns](#legacy-vs-modern-patterns)).
- **[`docs/SAPUI5-Development-Rules.md`](docs/SAPUI5-Development-Rules.md)** — the coding standard this repository applies to new and modified code.

## How to use this repository

This is a reference, not a runnable project — there is no root `package.json` and no build. Find the
control or pattern in the [`TOOLS/` index](TOOLS/README.md) or the [Structure](#structure) table
below, open the folder, and copy the snippet into your own application.

Two things to know before copying:

- **Shared `BaseController`.** Most controller snippets `sap.ui.define` a dependency on
  `com/serhatmercan/controller/BaseController`. That module lives in this repo at
  [`APPLICATION/BaseController.js`](APPLICATION/BaseController.js) — copy it alongside the snippet,
  or repoint the dependency at your own base controller. Snippets that call `getRouter()`,
  `getModel()`, `setModel()` or similar without defining them are relying on it.
- **Namespaces vary on purpose.** Examples were written across several years and carry different
  namespace conventions (`com.serhatmercan.*`, `com.sm.*`, and the placeholder `xxx.*`). They are
  left as-is rather than mass-renamed; substitute your own namespace when copying.

## What this is

A personal, code-first SAPUI5 reference built up over several years of real project work. It is a **cookbook**, not a tutorial: most folders are small, self-contained examples of one control or one pattern, with the "live" example next to a large block of commented-out alternatives (other attributes, other event handlers, other layouts) for quick copy-paste lookup. A smaller number of folders are runnable mini-apps demonstrating a full flow (navigation, a Fiori Elements extension, a Gateway-backed control, etc).

This repo spans multiple SAPUI5 generations on purpose. Legacy APIs (`sap.ui.getCore()`, `neo-app.json`, Smart Controls, older event-handler conventions) sit next to their modern equivalents deliberately, so both are preserved rather than "modernized away." Where a legacy pattern is used, it's labeled in a comment pointing at the modern equivalent elsewhere in the repo, rather than rewritten.

## Structure

| Folder | What it is |
|---|---|
| [`TOOLS/`](TOOLS/README.md) | One folder per SAPUI5 control (123 in total) — the bulk of the repo. See its own index for the full per-control breakdown (control, library, cookbook vs. app, notes). |
| `APPLICATION/` | Shared application shell: `Component.js`, `App.controller.js`/`.view.xml`, `BaseController.js`, `Main.controller.js`/`.view.xml`, `manifest.json`. Treated as high-risk shared infrastructure — not modified casually. |
| `ANALYTICALLISTPAGE/` | Fiori Elements Analytical List Page: annotation.xml, manifest.json, and a CDS view definition (`CDS.txt`). |
| `ANNOTATION/` | Standalone OData annotation XML reference. |
| `BIND/` | Data-binding cookbook (`Bind.js` + a `Dialog.xml` binding example). |
| `CONTROLLER/` | Bare controller lifecycle/pattern reference. |
| `CSS/` | Custom CSS class usage with a view/controller/manifest to demonstrate it end to end. |
| `CUSTOMCONTROL/` | Example of extending `sap.ui.core.Control` (a custom `Table`). |
| `DEPLOYMENT/` | `ui5.yaml` / `ui5-deploy.yaml` build & deploy config, plus `webapp/index.html`. `.env`/`.env.example` hold deployment credentials — `.env` is git-ignored; see `.env.example` for the expected shape. |
| `DOCUMENT/` | File/document handling: `UPLOADCOLLECTION` and `UPLOADSET` control examples. |
| `EXTENSION/` | A Fiori Elements controller extension example (`CV_ATTACHMENT_SRV`), including its own `manifest.json`/`neo-app.json`. |
| `FORMAT/` | `Formatter.js` — a large library of reusable formatter functions, paired with `Formatter.xml` showing them bound in views. |
| `JSON/` | `JSONModel` usage reference. |
| `LISTREPORT/` | Fiori Elements List Report extensions: custom filters, controller extensions, annotations. |
| `MANIFEST/` | `manifest.json` structure reference with a minimal controller. |
| `OVERVIEWPAGE/` | Fiori Elements Overview Page: annotation.xml + manifest.json. |
| `PAGE/` | OData association (`ASSOCIATION/`) and routing (`NAVIGATION/`) mini-apps. |
| `PROMISE/` | `Promise`/async patterns reference. |
| `TEMPLATE/` | Minimal controller+view scaffold used as a starting point for new examples. |
| `UI5/` | Misc. core UI5 references: expression binding, `sap.m.MessageBox`-adjacent `Message.js`, `Path.js`, `Shell.js`. |
| `docs/` | [`SAPUI5-Development-Rules.md`](docs/SAPUI5-Development-Rules.md) — the coding-standard rules this repo's *new* code follows (not retroactive — see below). |

### TOOLS folder-naming suffixes

A handful of `TOOLS/` folder names carry a deliberate `" - <suffix>"` marker distinguishing which library or backend flavor of a control the folder covers — this is intentional and preserved as-is, not a naming inconsistency:

- `" - UI"` — `sap.ui.table`-based (e.g. `GRIDTABLE - UI`, `TREETABLE - UI`)
- `" - M"` — `sap.m`-based (e.g. `RESPONSIVETABLE - M`, `SEMANTICPAGE - M`)
- `" - F"` — `sap.f`-based (e.g. `SEMANTICPAGE - F`)
- `" - GW"` — SAP Gateway/OData-backed (e.g. `TREETABLE - GW`)

`MICROCHART-` (no surrounding spaces) is a separate, unrelated prefix distinguishing chart-type variants, e.g. `MICROCHART-BULLET` vs. `MICROCHART-COLUMN`.

### Namespace conventions

Examples use more than one namespace convention — `com.serhatmercan.*` (the most common),
`com.sm.*`, and the placeholder `xxx.*`. This is historical: the examples were written across
several years and different project conventions, and they are kept as written rather than
mass-renamed, for the same reason legacy APIs are kept (see below). Nothing depends on the
namespace being uniform — each folder is self-contained — so substitute your own when copying.

## Legacy vs. modern patterns

`docs/SAPUI5-Development-Rules.md` states the rules for **new and modified** code. It is explicitly not retroactive: existing examples that predate a rule (e.g. `sap.ui.getCore()` lookups, classical `extend()` syntax) are kept as historical reference and labeled with a comment pointing at the modern equivalent elsewhere in the repo, rather than being rewritten to match current style. If you're looking for "the current recommended way," follow the comment pointers or the non-legacy-labeled examples.

## Compatibility

APPLICATION declares minUI5Version 1.65.6 while neo-app.json pins 1.71.47; verify against your own target release. This mismatch predates this curation pass and hasn't been reconciled, and neither number should be read as authoritative or used to justify a deprecation claim anywhere else in the repo.

## Review status

This repo has not had a uniform pass — different areas have gotten different levels of scrutiny. Verifiable via `git log --name-only` against each commit named below.

**Line-by-line reviewed and fixed** (real bugs found and corrected, not just read):
- `APPLICATION/` — `cb2847b`, `89bfc89`, `68916bd`
- `BIND/`, `CONTROLLER/` — `0d9fc63`
- `FORMAT/` — `86840ff`, `0d9fc63`, `b6ad572`
- `CSS/`, `MANIFEST/`, `PAGE/` (both `ASSOCIATION/` and `NAVIGATION/`), `PROMISE/` — `c4fae9d`
- 15 of the 123 `TOOLS/` folders — `BUTTON`, `DIALOG`, `GRIDTABLE - UI`, `INPUT`, `MESSAGEPOPOVER`, `MULTIINPUTTOKEN`, `RESPONSIVETABLE - M`, `TREETABLE - GW`, `TREETABLE - UI`, `CSSGRID`, `LISTSELECTOR`, `SEMANTICPAGE - F`, `SMARTFILTERBAR`, `SMARTMULTIINPUT`, `SPLITTER` — `4864ade`, `b6ad572`

**Classified only** (control/library/file-type noted, skimmed for anything glaring, but no systematic line-by-line check):
- The remaining 108 `TOOLS/` folders — see [`TOOLS/README.md`](TOOLS/README.md) for the per-folder breakdown.

**Untouched — no read, no review**:
- `ANALYTICALLISTPAGE/`, `ANNOTATION/`, `CUSTOMCONTROL/`, `DEPLOYMENT/`, `DOCUMENT/`, `EXTENSION/`, `JSON/`, `LISTREPORT/`, `OVERVIEWPAGE/`, `TEMPLATE/`, `UI5/`

Don't read "not flagged" as "verified clean" for anything in the second or third bucket.

### Next steps

Picking this up cold in a future session, in priority order:

1. **11 untouched top-level folders** (no read at all yet): `ANALYTICALLISTPAGE/`, `ANNOTATION/`, `CUSTOMCONTROL/`, `DEPLOYMENT/`, `DOCUMENT/`, `EXTENSION/`, `JSON/`, `LISTREPORT/`, `OVERVIEWPAGE/`, `TEMPLATE/`, `UI5/`.
2. **108 classified-only `TOOLS/` folders** — skimmed for classification (see [`TOOLS/README.md`](TOOLS/README.md)) but not line-by-line reviewed:
   `ACTIONSHEET`, `AVATAR`, `BARCODESCANNER`, `BLOCKLAYOUT`, `BOOKMARK`, `BREADCRUMBS`, `BUSYINDICATOR`, `CALENDARLEGEND`, `CARD`, `CAROUSEL`, `CHARTCONTAINER`, `CHECKBOX`, `COMBOBOX`, `CURRENCY`, `DATE`, `DATEPICKER`, `DYNAMICPAGE`, `DYNAMICSIDECONTENT`, `FEEDINPUT`, `FILEUPLOADER`, `FILTERBAR`, `FLEXBOX`, `FLEXIBLECOLUMNLAYOUT`, `FORM`, `FORMATTEDTEXT`, `FRAGMENT`, `GANTTCHART`, `GENERICTAG`, `GENERICTILE`, `GRID`, `GRIDCONTAINER`, `GRIDLIST`, `HBOX`, `HORIZONTALLAYOUT`, `HTML`, `ICON`, `ICONTABBAR`, `ILLUSTRATEDMESSAGE`, `IMAGE`, `INFOLABEL`, `LABEL`, `LINK`, `LIST`, `MENUBUTTON`, `MESSAGEBOX`, `MESSAGEPAGE`, `MESSAGESTRIP`, `MESSAGETOAST`, `MICROCHART-BULLET`, `MICROCHART-COLUMN`, `MULTICOMBOBOX`, `NAVIGATIONLIST`, `NETWORKGRAPH`, `NOTIFICATIONLIST`, `OBJECTHEADER`, `OBJECTIDENTIFIER`, `OBJECTLISTITEM`, `OBJECTNUMBER`, `OBJECTPAGELAYOUT`, `OBJECTSTATUS`, `OVERFLOWTOOLBAR`, `PAGE`, `PANEL`, `PLANNINGCALENDAR`, `POPOVER`, `PROCESSFLOW`, `PROGRESSINDICATOR`, `RADIOBUTTON`, `RATINGINDICATOR`, `RICHTEXTEDITOR`, `SCROLLCONTAINER`, `SEARCHFIELD`, `SEGMENTEDBUTTON`, `SELECT`, `SELECTDIALOG`, `SEMANTICDETAILPAGE`, `SEMANTICMASTERPAGE`, `SEMANTICPAGE - M`, `SEMANTICPAGEMD`, `SIMPLEFORM`, `SINGLEPLANNINGCALENDAR`, `SLIDER`, `SLIDETILE`, `SMARTCHART`, `SMARTFIELD`, `SMARTFORM`, `SMARTTABLE`, `SPLITAPP`, `SPREADSHEET`, `STEPINPUT`, `SWITCH`, `TABCONTAINER`, `TABLESELECTDIALOG`, `TEMPLATE`, `TEXT`, `TEXTAREA`, `TILECONTAINER`, `TILECONTENT`, `TIME`, `TIMEPICKER`, `TITLE`, `TOGGLEBUTTON`, `TOOLBAR`, `VALUEHELPDIALOG`, `VBOX`, `VERTICALLAYOUT`, `VIEWSETTINGSDIALOG`, `WIZARD`.

## License

MIT — see [`LICENSE`](LICENSE). This covers the example code and notes in this repository only. SAPUI5, Fiori, and related APIs, controls, and trademarks referenced throughout remain the property of SAP SE; this repo does not grant any rights to them.
