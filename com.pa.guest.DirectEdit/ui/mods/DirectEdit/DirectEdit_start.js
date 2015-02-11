
/* ==================== Frame Creation and HTML Injection ==================== */

//load html dynamically (thanks CC)
function loadHtmlTemplate(element, url) {
    element.load(url, function () {
        console.log("Loading html " + url);
        element.children().each(function() {
			ko.applyBindings(model, this);
		});
    });
}

// Create frame
(function() {
	// Create main frame
	createFloatingFrame("dEdit_base", 320, 620, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_base_content"), "coui://ui/mods/DirectEdit/ui/DirectEdit_panel_main.html");
	
	// Create frame for editing individual brushes
	createFloatingFrame("dEdit_brushDetail", 320, 440, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_brushDetail_content"), "coui://ui/mods/DirectEdit/ui/DirectEdit_panel_brushDetail.html");
	// Make sure it hides correctly
	$("#dEdit_brushDetail").attr("data-bind","visible: dEdit.brushDetail.active");
})();

console.log("[DirectEdit] HTML loaded");
