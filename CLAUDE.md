# CLAUDE.md — UIGuide

Coding rules: docs/SAPUI5-Development-Rules.md (applies to new and modified code; see "Legacy vs. modern patterns" in README.md).

## Purpose and scope
- Code-first SAPUI5 cookbook spanning several UI5 generations; a reference,
  not a runnable project. Add no root `package.json` or build.
- Legacy APIs, commented-out alternatives and near-duplicate examples are
  content: never modernize, merge or delete them for style; fix only
  deterministic defects (undeclared `xmlns`, wrong events, broken bindings).
- Only the UI5 consumer side is explained here. The OData service side
  links to GWGuide (https://github.com/serhatmercan/GWGuide), the source of
  CDS annotations to CDSGuide (https://github.com/serhatmercan/CDSGuide),
  plain JavaScript to JSGuide (https://github.com/serhatmercan/JSGuide).
  Deliberate exceptions `TOOLS/TREETABLE - GW/ABAP/` and
  `ANALYTICALLISTPAGE/CDS.txt` stay as context for their UI example; new
  backend content goes to the sibling guides.
- Call an API deprecated only when the SAPUI5 API Reference does, else
  "verify compatibility"; README "Compatibility" versions are no evidence.
- `APPLICATION/App.view.xml`, `App.controller.js`, `BaseController.js`:
  report before changing; never change a public BaseController signature.

## Structure
- Upper-case topic folders; `TOOLS/` has one folder per control, without
  separators (`ACTIONSHEET`). Suffixes `" - UI"`, `" - M"`, `" - F"`,
  `" - GW"` keep their spaces; `MICROCHART-<TYPE>` is a separate prefix.
- Cookbook (Type C): `<Control>.xml` live example, `<Control>.js` handlers.
  Mini-app (Type A): `<Name>.controller.js`, `<Name>.view.xml`,
  `<Name>.fragment.xml`, `manifest.json`, lower-case `fragments/<area>/`.
- Cookbook XML: one live root; after its closing tag, alternatives under
  `<!-- CONTROL - ATTRIBUTES -->` / `LAYOUT` / `EXAMPLE` banners, each
  followed by one comment block. Variants take Roman numerals (`DateII`).
- Banners and commented-out alternatives in XML are content, exempt from
  the no-comments rule in "XML Control Definition" of the rules document
  (formal exemption follows in its planned revision).
- New `TOOLS/` folder: add a row to the TOOLS/README.md index and update
  both READMEs' control counts; new top-level folder: README "Structure".

## Labels
- Portfolio labels: `CURRENT / RECOMMENDED`, `CLASSIC BUT STILL RELEVANT`,
  `LEGACY / HISTORICAL REFERENCE`, `VERSION-DEPENDENT` (no ABAP Cloud label).
- Lifecycle: ``> **Lifecycle:** `LABEL`. <one or two sentences>``; legacy
  notes name and link the modern equivalent. Version:
  `> ⚠️ **VERSION-DEPENDENT: <feature>.** <text>`, citing the API Reference.
  `_`-prefixed or unreleased APIs:
  ``> 📝 **Not a released API.** Verify availability and stability in your system.``
- Callouts: `> ⚠️` pitfalls, `> 💡` tips, `> 📝` notes, `> 🔐` security.
- Code comments keep the existing pointer above the method or statement
  (once at module top if the whole file uses it; `<!-- -->` in XML):
  `// Legacy Pattern: <API> — <modern equivalent and where it is used>`;
  also `// VERSION-DEPENDENT: <feature>.`, `// NOT A RELEASED API - verify in your system.`

## Code examples
- Keep each file's indentation; new files use tabs.
- New code always depends on `com/serhatmercan/controller/BaseController`;
  `./BaseController` outside `APPLICATION/` is a broken dependency, fixed
  in the planned pass. Never copy BaseController. Namespaces stay as
  written; new examples use `com.serhatmercan.*`.
- No file headers; a standalone script may open with a short `/* */` block
  saying what it is and how to run it. Comments are Title Case step labels
  (`// Handle Error`) or a non-obvious constraint, never a restatement.
- FORMAT/Formatter.js functions carry `/* => call(args) <= result */`.
  Fences: `js`, `xml`, `json`, `properties`; untagged for trees.

## Links
- Relative links; link text is the repo-root path in backticks, also from
  subfolders: ``[`APPLICATION/BaseController.js`](../APPLICATION/BaseController.js)``.
  In-page anchors use the heading text. Code comments name files by
  repo-root path, same-file methods by name, sections by quoted heading.
- External links: SAP documentation (ui5.sap.com, help.sap.com), sibling guides.

## Review status
- "Review status" in README.md is the record; the TOOLS/README.md Notes
  column mirrors it for `TOOLS/`. Update both in one change.
- New files go into "Added under the current rules, not run against a live
  system"; a changed file keeps its bucket unless it was read in full.
- "Not flagged" never means "verified": a scan, grep or classification
  leaves a file in "Classified/scanned only — not line-by-line reviewed".
- A file moves to a "Line-by-line reviewed" bucket only after a full read.
  "Line-by-line reviewed, no defects found" means read in full with no
  deterministic defect; runtime verification is stated separately in the
  entry ("run on a live system") and never implied.
- Findings needing author or business intent go to the "deferred" bucket.
  Entries name the commit, added after the user commits; never guess a
  hash. Keep folder counts consistent.
