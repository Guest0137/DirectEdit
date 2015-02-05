/* Some of the framework here is intended for use with brush groups
   once I get those working, so some stuff is overcomplicated.
*/

model.dEdit.currentSpec.rootBrushGroup = {};
model.dEdit.currentSpec.rootBrushGroup.members = ko.observableArray();
model.dEdit.currentSpec.rootBrushGroup.getWritable = function() {

	var writableBrushes = [];
	
	// Get current observableArray state
	var image = model.dEdit.currentSpec.rootBrushGroup.members();
	
	for (i = 0; i < image.length; i++) {
		var info = image[i].getWritable();
		writableBrushes = writableBrushes.concat(info.brushes);
	}
	return {brushes: writableBrushes};
};

model.dEdit.currentSpec.noBrushes = ko.computed( function() {
	return model.dEdit.currentSpec.rootBrushGroup.members().length === 0;
});

dEdit.BrushWrapper = function(brush) {
	var self = this;
	self.original = brush;
	
	// weight doesn't matter
	self.spec = ko.observable(self.original.spec);
	self.proj = ko.observable(self.original.proj);
	// transform not currently in scope
	self.op = ko.observable(self.original.op);
	self.rotation = ko.observable(self.original.rotation);
	
	if(typeof self.original.scale === "undefined") {
		self.scale = [
			ko.observable(0),
			ko.observable(0),
			ko.observable(0)
		];
	}
	else {
		self.scale = [
			ko.observable(self.original.scale[0]),
			ko.observable(self.original.scale[1]),
			ko.observable(self.original.scale[2])
		];
	}
	
	self.height = ko.observable(self.original.height);
	
	if(typeof self.original.position === "undefined") {
		self.position = [
			ko.observable(0),
			ko.observable(0),
			ko.observable(0)
		];
	}
	else {
		self.position = [
			ko.observable(self.original.position[0]),
			ko.observable(self.original.position[1]),
			ko.observable(self.original.position[2])
		];
	}
	
	// weightHard doesn't matter
	// weightScale doesn't matter
	self.mirrored = ko.observable(self.original.mirrored);
	// twinIDs are unlinked when writing
	// flooded is set automatically on load
	self.pathable = ko.observable(self.original.pathable);
	self.mergeable = ko.observable(self.original.mergeable);
	self.no_features = ko.observable(self.original.no_features);
	
	this.getWritable = function() {
		var brushSpec = _.cloneDeep(self.original);
		
		brushSpec.spec = self.spec();
		brushSpec.proj = self.proj();
		
		brushSpec.op = self.op();
		brushSpec.rotation = self.rotation();
		brushSpec.scale = [self.scale[0](),self.scale[1](),self.scale[2]()];
		brushSpec.height = self.height();
		brushSpec.position = [self.position[0](),self.position[1](),self.position[2]()];
		
		
		brushSpec.mirrored = self.mirrored();
		brushSpec.twinId = 0; // Unlink twinIDs to avoid issues with clones
		
		brushSpec.pathable = self.pathable();
		brushSpec.mergeable = self.mergeable();
		brushSpec.no_features = self.no_features();
		
		return {brushes: [brushSpec]};
	};
};

dEdit.readBrushes = function(brushArray) {
	// Clear existing data
	model.dEdit.currentSpec.rootBrushGroup.members([]);
	
	var temp = new Array(brushArray.length);
	
	// Link brushes
	for(var i = 0; i < brushArray.length; i++) {
		temp[i] = new dEdit.BrushWrapper(brushArray[i]);
	}
	
	model.dEdit.currentSpec.rootBrushGroup.members(temp);
};

console.log("DirectEdit brush handling loaded");