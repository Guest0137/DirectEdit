
/* ==================== Frame creation and HTML injection ==================== */

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
	createFloatingFrame("dEdit_primary", 320, 620, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_primary_content"), "coui://ui/mods/DirectEdit/panel_main.html");
	
	// Create frame for editing individual brushes
	createFloatingFrame("dEdit_secondary", 320, 440, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_secondary_content"), "coui://ui/mods/DirectEdit/panel_secondary.html");
	// Make sure it hides correctly
	$("#dEdit_secondary").attr("data-bind","visible: dEdit.display.secondary.active");
})();

console.log("[DirectEdit] HTML loaded");