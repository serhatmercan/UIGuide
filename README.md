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

### SAP BTP Neo routing examples

`APPLICATION/` and `EXTENSION/CV_ATTACHMENT_SRV/` contain `neo-app.json` files from SAP BTP
Neo-era application development. They are intentionally preserved as historical references for
destination routing, SAPUI5 resource configuration, and S/4HANA reuse-library integration.

For new application architectures, evaluate the routing and deployment model appropriate to the
target SAP BTP runtime instead of treating these files as current project templates. Destination
names in these files are placeholders.

## Compatibility

APPLICATION declares minUI5Version 1.65.6 while neo-app.json pins 1.71.47; verify against your own target release. This mismatch predates this curation pass and hasn't been reconciled, and neither number should be read as authoritative or used to justify a deprecation claim anywhere else in the repo.

## Review status

This repo has not had a uniform pass — different areas have gotten different levels of scrutiny, and the buckets below say which. Historical work is verifiable via `git log --name-only` against each commit named.

**Line-by-line reviewed and fixed** — read in full, with deterministic defects found and corrected (module loading, broken bindings, malformed markup, wrong OData key names):

- `APPLICATION/` — `cb2847b`, `89bfc89`, `68916bd`
- `BIND/`, `CONTROLLER/` — `0d9fc63`
- `FORMAT/` — `86840ff`, `0d9fc63`, `b6ad572`
- `CSS/`, `MANIFEST/`, `PAGE/` (both `ASSOCIATION/` and `NAVIGATION/`), `PROMISE/` — `c4fae9d`
- `JSON/`, `UI5/Path.js`, `OVERVIEWPAGE/annotation.xml`
- 21 of the 123 `TOOLS/` folders — `BUTTON`, `CSSGRID`, `DIALOG`, `GRIDLIST`, `GRIDTABLE - UI`, `INPUT`, `LIST`, `LISTSELECTOR`, `MESSAGEPOPOVER`, `MULTIINPUTTOKEN`, `POPOVER`, `RESPONSIVETABLE - M`, `RICHTEXTEDITOR`, `SEMANTICPAGE - F`, `SEMANTICPAGE - M`, `SMARTFILTERBAR`, `SMARTMULTIINPUT`, `SPLITTER`, `TREETABLE - GW`, `TREETABLE - UI`, `VIEWSETTINGSDIALOG` — the earlier fifteen under `4864ade`, `b6ad572`

**Line-by-line reviewed, no defects found**:

- `DEPLOYMENT/` — configuration read and confirmed free of credentials and system identifiers (`.env` is untracked by design and deliberately not read)
- `TEMPLATE/` — `View.xml` confirmed an intentional fragment scaffold rather than a mis-rooted view
- `UI5/Message.js`, `UI5/ExpressionBinding.xml`

**Reviewed with intentionally deferred semantic/documentation findings** — usable as reference, but what remains needs author or domain intent rather than a mechanical fix:

- `ANNOTATION/` — reviewed and deterministic defects fixed; two annotations still need a business decision (contradictory `UI.Hidden` values, and which field `UI.HeaderInfo` `Title` should carry)
- `DOCUMENT/UPLOADCOLLECTION/` — reviewed and deterministic defects fixed; `_getSingleData` has no definition anywhere in this repo and its provenance is unresolved
- `DOCUMENT/UPLOADSET/` — reviewed; a foreign fragment namespace, mixed control-lookup styles and a duplicated `setSource` are recorded as observations
- `LISTREPORT/` — `annotation.xml` and `manifest.json` reviewed and fixed (ObjectPage controller-extension registration, `Measures` alias declaration); `Measures.Unit` vs `Measures.ISOCurrency` remains an open semantic choice. The remaining files in the folder are not line-by-line reviewed.
- `TOOLS/TABCONTAINER` — active markup is valid; a trailing documentation comment contains a token XML cannot represent inside a comment
- `TOOLS/PROCESSFLOW` — the decorative logo assets are not shipped; the example renders without them

The last two were inspected for those specific findings, not read line by line. The `minUI5Version` / `neo-app.json` mismatch under [Compatibility](#compatibility) is also unresolved by design.

**Classified/scanned only — not line-by-line reviewed**:

- The remaining 102 `TOOLS/` folders — catalogued by control, library and file type in [`TOOLS/README.md`](TOOLS/README.md)
- `ANALYTICALLISTPAGE/`, `CUSTOMCONTROL/`, `EXTENSION/`

These were scanned repository-wide for high-value risks — secrets, customer or system identifiers, malformed markup, AMD dependency/parameter alignment, merge-conflict markers and broken local references — but were not read line by line. Don't read "not flagged" as "verified clean" for anything in this bucket.

Across every bucket, legacy APIs and commented-out alternatives were left in place deliberately: this is a multi-generation SAPUI5 reference, and the older form is frequently the point of the example. Deterministic defects were corrected; legacy patterns were not modernized.

## License

MIT — see [`LICENSE`](LICENSE). This covers the example code and notes in this repository only. SAPUI5, Fiori, and related APIs, controls, and trademarks referenced throughout remain the property of SAP SE; this repo does not grant any rights to them.
