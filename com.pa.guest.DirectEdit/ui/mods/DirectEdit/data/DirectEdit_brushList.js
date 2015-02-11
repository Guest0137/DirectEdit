
/* ==================== Brush list for current spec ==================== */

model.dEdit.currentSpec.brushList = {};
model.dEdit.currentSpec.brushList.members = ko.observableArray();
model.dEdit.currentSpec.brushList.getWritable = function() {

	var writableBrushes = [];
	
	// Get pointer to array
	var list = model.dEdit.currentSpec.brushList.members();
	
	for (i = 0; i < list.length; i++) {
		writableBrushes = writableBrushes.concat(list[i].getWritable());	// Use map function instead?
	}
	
	return writableBrushes;
};
model.dEdit.currentSpec.brushList.find = function(brushWrapper) {
	return model.dEdit.currentSpec.brushList.members.indexOf(brushWrapper);
};

model.dEdit.currentSpec.brushList.insertAll = function(index, array) {
	for(var i = 0; i < array.length; i++) {
		model.dEdit.currentSpec.brushList.members.splice(index+i+1, 0, array[i]);
	}
};

model.dEdit.currentSpec.brushList.replace = function(brushWrapper,replacement) {
	var idx = model.dEdit.currentSpec.brushList.find(brushWrapper);
	if(idx !== -1) {
		if(model.dEdit.brushDetail.selected.deselect(brushWrapper).length > 0) {
			model.dEdit.brushDetail.selected.add(replacement);
		}
		model.dEdit.currentSpec.brushList.members.splice(idx,1,replacement);
	}
	else {
		console.log("Couldn't find brush to replace");
	}
};

model.dEdit.currentSpec.brushList.shiftUp = function(brushWrapper) {
	var idx = model.dEdit.currentSpec.brushList.find(brushWrapper);
	
	// implicit: idx !== -1
	if(idx > 0) {
		model.dEdit.currentSpec.brushList.members.splice(idx,1);
		model.dEdit.currentSpec.brushList.members.splice(idx-1,0,brushWrapper);
		return true;
	}
	return false;
};

model.dEdit.currentSpec.brushList.shiftDown = function(brushWrapper) {
	var idx = model.dEdit.currentSpec.brushList.find(brushWrapper);
	if(idx !== -1) {
		if((idx+1) < model.dEdit.currentSpec.brushList.members().length) {
			model.dEdit.currentSpec.brushList.members.splice(idx,1);
			model.dEdit.currentSpec.brushList.members.splice(idx+1,0,brushWrapper);
			return true;
		}
	}
	return false;
};

model.dEdit.currentSpec.brushList.isEmpty = ko.computed( function() {
	return model.dEdit.currentSpec.brushList.members().length === 0;
});


model.dEdit.currentSpec.brushList.readBrushes = function(brushArray) {
	// Clear existing data
	model.dEdit.currentSpec.brushList.members([]);
	
	// TODO put this somewhere better
	model.dEdit.brushDetail.selected.clear();
	
	var temp = new Array(brushArray.length);
	
	// Wrap brushes
	for(var i = 0; i < brushArray.length; i++) {
		temp[i] = new dEdit.BrushWrapper(brushArray[i]);
	}
	
	model.dEdit.currentSpec.brushList.members(temp);
};

console.log("[DirectEdit] Brush list handling loaded");