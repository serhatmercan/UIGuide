/*
 * OData list binding inventory
 * Paste into the browser DevTools console of a running UI5 application.
 * Diagnostic only - not application code; console output is intentional
 * (deliberate exception to the no-console rule). It is a snapshot of the
 * controls that exist at the moment it runs.
 */
(() => {
    // sap/ui/core/ElementRegistry exists since UI5 1.120, where
    // Element.registry was deprecated; the fallback covers older releases.
    const ElementRegistry = typeof sap !== "undefined" && sap.ui?.require
        ? sap.ui.require("sap/ui/core/ElementRegistry")
            || sap.ui.require("sap/ui/core/Element")?.registry
        : undefined;

    if (!ElementRegistry) {
        console.warn("UI5 is not loaded on this page, or this UI5 release predates the element registry API.");
        return;
    }

    const aODataListBindingTypes = [
        "sap.ui.model.odata.v2.ODataListBinding",
        "sap.ui.model.odata.v4.ODataListBinding"
    ];
    const mBindingsByPath = {};
    let iBindingCount = 0;

    ElementRegistry.forEach((oElement) => {
        Object.keys(oElement.getMetadata().getAllAggregations()).forEach((sAggregation) => {
            const oBinding = oElement.getBinding(sAggregation);

            if (!oBinding?.isA(aODataListBindingTypes)) {
                return;
            }

            // Resolve relative paths so different entity sets are not merged
            const sPath = oBinding.getModel().resolve(oBinding.getPath(), oBinding.getContext())
                || `(unresolved) ${oBinding.getPath()}`;

            iBindingCount++;
            mBindingsByPath[sPath] = (mBindingsByPath[sPath] || 0) + 1;
        });
    });

    console.log("OData list bindings:", iBindingCount);
    console.table(
        Object.entries(mBindingsByPath)
            .sort(([, iA], [, iB]) => iB - iA)
            .map(([sPath, iCount]) => ({ path: sPath, bindings: iCount }))
    );
    console.log("Registered elements:", ElementRegistry.size);
})();

/*
 * Reading the result
 * - Several bindings on the same path can mean the same entity set is
 *   requested several times (e.g. a value-help control repeated in every
 *   table row) - a candidate for a shared model/binding.
 * - "(unresolved)" means a relative binding whose context is not set yet.
 * - Template-based rows or items are counted once per created instance.
 * - Destroyed controls are not counted; run it again after navigating.
 * - Only OData V2/V4 list bindings are counted; JSON model bindings and
 *   property/element bindings are ignored on purpose.
 */