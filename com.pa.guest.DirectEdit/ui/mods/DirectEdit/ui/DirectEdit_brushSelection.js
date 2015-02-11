
/* ==================== Brush Selection Logic ==================== */

model.dEdit.brushDetail.selected = {brushes: ko.observableArray()};
model.dEdit.brushDetail.strongSelected = ko.observable();

// Function called when a row in the CSG list is clicked
// Effect varies based on context
model.dEdit.brushDetail.brushClickEvent = function(brushWrapper, event) {
	if(event.ctrlKey && event.shiftKey) {
	
		var startIdx = model.dEdit.currentSpec.brushList.find(model.dEdit.brushDetail.strongSelected());
		var endIdx = model.dEdit.currentSpec.brushList.find(brushWrapper);
		
		if(startIdx === -1) {
			model.dEdit.brushDetail.strongSelected(brushWrapper);
			model.dEdit.brushDetail.selected.add(brushWrapper);
		}
		else {
			if(startIdx<endIdx) {
				model.dEdit.brushDetail.selected.addAll(model.dEdit.currentSpec.brushList.members.slice(startIdx,endIdx+1));
			}
			else {
				model.dEdit.brushDetail.selected.addAll(model.dEdit.currentSpec.brushList.members.slice(endIdx,startIdx+1));
			}
		}
	}
	else if(event.shiftKey) {
	
		var startIdx = model.dEdit.currentSpec.brushList.find(model.dEdit.brushDetail.strongSelected());
		var endIdx = model.dEdit.currentSpec.brushList.find(brushWrapper);
		
		if(startIdx === -1) {
			model.dEdit.brushDetail.strongSelected(brushWrapper);
			model.dEdit.brushDetail.selected.set([brushWrapper]);
		}
		else {
			if(startIdx<endIdx) {
				model.dEdit.brushDetail.selected.set(model.dEdit.currentSpec.brushList.members.slice(startIdx,endIdx+1));
			}
			else {
				model.dEdit.brushDetail.selected.set(model.dEdit.currentSpec.brushList.members.slice(endIdx,startIdx+1));
			}
		}
	}
	else if(event.ctrlKey) {
	
		model.dEdit.brushDetail.strongSelected(brushWrapper);
		
		if(brushWrapper.isSelected()) {
			model.dEdit.brushDetail.selected.deselect(brushWrapper);
		}
		else {
			model.dEdit.brushDetail.selected.add(brushWrapper);
		}
	}
	else {
		model.dEdit.brushDetail.strongSelected(brushWrapper);
		
		if(brushWrapper.isSelected() && (model.dEdit.brushDetail.selected.brushes().length === 1)){
			model.dEdit.brushDetail.selected.set(_.clone(model.dEdit.currentSpec.brushList.members()));
		}
		else {
			model.dEdit.brushDetail.selected.set([brushWrapper]);
		}
	}
};

// Autohide
model.dEdit.brushDetail.selected.brushes.subscribe(
	function(array)	{
		if(array.length>0) {
			model.dEdit.brushDetail.show();
		}
		else {
			model.dEdit.brushDetail.hide();
		}
	}
);

model.dEdit.brushDetail.selected.set = function(brushWrapperArray) {
	model.dEdit.brushDetail.selected.clear();
	
	for(var i = 0; i < brushWrapperArray.length; i++) {
		brushWrapperArray[i].isSelected(true);
	}
	
	model.dEdit.brushDetail.selected.brushes(brushWrapperArray);
};

model.dEdit.brushDetail.selected.clear = function() {
	var list = model.dEdit.brushDetail.selected.brushes();
	
	for(var i = 0; i < list.length; i++) {
		list[i].isSelected(false);
	}
	
	model.dEdit.brushDetail.selected.brushes([]);
};

model.dEdit.brushDetail.selected.add = function(brushWrapper) {
	brushWrapper.isSelected(true);
	
	model.dEdit.brushDetail.selected.brushes.push(brushWrapper);
};

model.dEdit.brushDetail.selected.addAll = function(brushWrapperArray) {
	for(var i = 0; i < brushWrapperArray.length; i++) {
		if(!brushWrapperArray[i].isSelected()) {
			model.dEdit.brushDetail.selected.add(brushWrapperArray[i]);
		}
	}
};

model.dEdit.brushDetail.selected.deselect = function(brushWrapper) {
	brushWrapper.isSelected(false);
	
	return model.dEdit.brushDetail.selected.brushes.remove(brushWrapper);
};

model.dEdit.brushDetail.selected.firstIndex = function() {
	var list = model.dEdit.currentSpec.brushList.members();
	for(var i = 0; i < list.length; i++) {
		if(list[i].isSelected()) {
			return i;
		}
	}
	return -1;
};

model.dEdit.brushDetail.selected.lastIndex = function() {
	var list = model.dEdit.currentSpec.brushList.members();
	var idx = -1;
	for(var i = 0; i < list.length; i++) {
		if(list[i].isSelected()) {
			idx = i;
		}
	}
	return idx;
};

/* ==================== Actions on All Selected Brushes ==================== */

model.dEdit.brushDetail.selected.joinUp = function() {
	var idx = model.dEdit.brushDetail.selected.firstIndex();
	
	var image = _.clone(model.dEdit.brushDetail.selected.brushes());
	
	model.dEdit.currentSpec.brushList.members.removeAll(image);
	
	model.dEdit.currentSpec.brushList.insertAll(idx-1,model.dEdit.brushDetail.selected.brushes());
};

model.dEdit.brushDetail.selected.joinDown = function() {
	var idx = model.dEdit.brushDetail.selected.lastIndex();
	
	var image = _.clone(model.dEdit.brushDetail.selected.brushes());
	var l = image.length;
	
	model.dEdit.currentSpec.brushList.members.removeAll(image);
	
	model.dEdit.currentSpec.brushList.insertAll(idx-l,model.dEdit.brushDetail.selected.brushes());
};

model.dEdit.brushDetail.selected.shiftUpAll = function() {
	var first = model.dEdit.brushDetail.selected.firstIndex();
	var last = model.dEdit.brushDetail.selected.lastIndex();
	
	var list = model.dEdit.currentSpec.brushList.members();
	
	for(var i = Math.max(1,first); i <= last; i++) {
		var item = list[i];
		if(item.isSelected()) {
			model.dEdit.currentSpec.brushList.members.splice(i,1);
			model.dEdit.currentSpec.brushList.members.splice(i-1,0,item);
		}
	}
};

model.dEdit.brushDetail.selected.shiftDownAll = function() {
	var first = model.dEdit.brushDetail.selected.firstIndex();
	var last = model.dEdit.brushDetail.selected.lastIndex();
	
	var list = model.dEdit.currentSpec.brushList.members();
	
	for(var i = Math.min(last,list.length-2); i >= first; i--) {
		var item = list[i];
		if(item.isSelected()) {
			model.dEdit.currentSpec.brushList.members.splice(i,1);
			model.dEdit.currentSpec.brushList.members.splice(i+1,0,item);
		}
	}
};

// Clone selected brushes with no further changes
model.dEdit.brushDetail.selected.cloneAll = function() {

	var idx = model.dEdit.brushDetail.selected.lastIndex();
	
	var list = _.clone(model.dEdit.brushDetail.selected.brushes());
	var cloneArray = new Array(list.length);
	
	for(var i = 0; i < list.length; i++) {
		cloneArray[i] = new dEdit.BrushWrapper(list[i].getWritable());
	}
	
	// Try to insert immediately after the last selected brush if possible
	if(idx !== -1) {
		model.dEdit.currentSpec.brushList.insertAll(idx,cloneArray);
	}
	else {
		console.log("No selected brushes found after cloning; this should never happen");
		ko.utils.arrayPushAll(model.dEdit.currentSpec.brushList.members,cloneArray);
	}
	
	// Select the new clones
	// TODO:SETTING
	model.dEdit.brushDetail.selected.set(cloneArray);
};

// Delete selected brushes
model.dEdit.brushDetail.selected.removeAll = function() {
	
	var idx = model.dEdit.brushDetail.selected.lastIndex();
	
	// Find brush to view after current selection is removed
	var next = 0;
	
	var list = model.dEdit.currentSpec.brushList.members();
	
	if(idx !== -1) {
		if((idx+1) < list.length) {
			// Look forward
			next = list[idx+1];
		}
		else {
			// Look backward
			for(var i = idx-1; i >= 0; i--) {
				if(!list[i].isSelected()) {
					next = list[i];
					break;
				}
			}
		}
	}
	else {
		console.log("No selected brushes found on delete command; this should never happen");
	}
	
	// Remove all selected brushes from list
	model.dEdit.currentSpec.brushList.members.removeAll(model.dEdit.brushDetail.selected.brushes());
	
	// TODO:TEST
	if(next) {
		model.dEdit.brushDetail.selected.set([next]);
	}
	else {
		model.dEdit.brushDetail.selected.clear();
	}
};

model.dEdit.brushDetail.selected.applyFunctionToAll = function() {
	try {
		var image = _.clone(model.dEdit.brushDetail.selected.brushes());
		var op = dEdit.getCurrentBrushFunction();
		var output = new Array(image.length);
		for(var i = 0; i < image.length; i++) {
			output[i] = new dEdit.BrushWrapper(op.applyTo(image[i].getWritable()));
		}
		
		for(var i = 0; i < image.length; i++) {
			model.dEdit.currentSpec.brushList.replace(image[i],output[i]); // TODO: catch fail state
		}
		
		model.dEdit.brushDetail.selected.set(output);
	}
	catch(e) {
		console.log("Error in applying brush function:");
		console.log(e);
	}
};

model.dEdit.brushDetail.selected.cloneFunctionToAll = function() {
	try {
		var list = _.clone(model.dEdit.brushDetail.selected.brushes());
		var op = dEdit.getCurrentBrushFunction();
		var output = new Array(list.length);
		for(var i = 0; i < list.length; i++) {
			output[i] = new dEdit.BrushWrapper(op.applyTo(list[i].getWritable()));
		}
		
		var idx = model.dEdit.brushDetail.selected.lastIndex();
		
		// Try to insert immediately after the last selected brush if possible
		if(idx !== -1) {
			model.dEdit.currentSpec.brushList.insertAll(idx,output);
		}
		else {
			console.log("No selected brushes found after cloning; this should never happen");
			ko.utils.arrayPushAll(model.dEdit.currentSpec.brushList.members,output);
		}
		
		model.dEdit.brushDetail.selected.set(output);
	}
	catch(e) {
		console.log("Error in clone-applying brush function:");
		console.log(e);
	}
};

console.log("[DirectEdit] Brush selection UI loaded");