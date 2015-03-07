
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
	// Create frames
	createFloatingFrame("dEdit_primary", 320, 608, {"offset": "center"});
	createFloatingFrame("dEdit_secondary", 320, 440, {"offset": "center"});
	
	// Inject HTML and apply bindings
	loadHtmlTemplate($("#dEdit_primary_content"),"coui://ui/mods/DirectEdit/res/panel_main.html");
	loadHtmlTemplate($("#dEdit_secondary_content"),"coui://ui/mods/DirectEdit/res/panel_secondary.html");
	
	
	// Set CSS
	$("#dEdit_primary_content").attr("class","dEdit_base");
	$("#dEdit_secondary_content").attr("class","dEdit_base");
	// Hide
	$("#dEdit_secondary").attr("data-bind","visible: dEdit.display.secondary.active");
})();

console.log("[DirectEdit] HTML loaded");