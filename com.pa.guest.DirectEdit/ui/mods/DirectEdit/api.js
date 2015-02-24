dEdit.api = {};

dEdit.api.registerBrushTool = function(tool) {
	model.dEdit.brushTools.tools.push(tool);
	console.log("[DirectEdit API] Registered brush tool: \"" + tool.label + "\"");
};
dEdit.api.registerMetalTool = function(tool) {
	model.dEdit.metalTools.tools.push(tool);
	console.log("[DirectEdit API] Registered metal tool: \"" + tool.label + "\"");
}
dEdit.api.registerSpawnTool = function(tool) {
	model.dEdit.spawnTools.tools.push(tool);
	console.log("[DirectEdit API] Registered spawn tool: \"" + tool.label + "\"");
};
dEdit.api.registerPlanetTool = function(tool) {
	model.dEdit.planetTools.tools.push(tool);
	console.log("[DirectEdit API] Registered planet tool: \"" + tool.label + "\"");
};

console.log("[DirectEdit] API loaded");