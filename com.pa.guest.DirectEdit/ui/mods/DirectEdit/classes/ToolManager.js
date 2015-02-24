dEdit.ToolManager = function() {
	var self = this;
	
	self.tools = [];
	
	self.selectedType = ko.observable({activeFields:{null_null: "null"}});
	
	self.isReady = ko.computed(function() {
		var active = self.selectedType().activeFields;
		
		var vals = model.dEdit.staticVars.getToolFieldValues();
		
		// Bracket hell
		for	(var fKey in active) {
			if($.isArray(vals[fKey])) {
				for(var i = 0; i < vals[fKey].length; i++) {
					if(!$.isNumeric(vals[fKey][i])) {
						return false;
					}
				}
			}
			else {
				if(!$.isNumeric(vals[fKey])) {
					return false;
				}
			}
		}
		
		return true;
	});
	
	self.getApplicable = function() {
		if(self.isReady()) {
			return self.selectedType().getFunction(model.dEdit.staticVars.getToolFieldValues());
		}
		else {
			throw "Tool does not have all necessary fields";
		}
	};
};

console.log("[DirectEdit] Added class: ToolManager");