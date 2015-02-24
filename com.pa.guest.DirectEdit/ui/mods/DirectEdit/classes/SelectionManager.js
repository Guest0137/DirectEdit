
/* ==================== Click handler and manipulator "class" for generic item wrapper list ==================== */

dEdit.SelectionManager = function(parentList,wrapperType) {
	var self = this;
	
	self.items = ko.observableArray();
	
	// If exactly one item is selected, return it for individual editing
	self.current = ko.computed(function() {
		if(self.items().length === 1) {
			return self.items()[0];
		}
		else {
			return (new parentList.itemClass({}));
		}
	});
	
	self.clickRefItem = ko.observable();
	
	self.handleClickEvent = function(item, event) {
		if(event.ctrlKey && event.shiftKey) {
		
			var startIdx = parentList.find(self.clickRefItem());
			var endIdx = parentList.find(item);
			
			if(startIdx === -1) {
				self.clickRefItem(item);
				self.add(item);
			}
			else {
				if(startIdx<endIdx) {
					self.addAll(parentList.items.slice(startIdx,endIdx+1));
				}
				else {
					self.addAll(parentList.items.slice(endIdx,startIdx+1));
				}
			}
		}
		else if(event.shiftKey) {
		
			var startIdx = parentList.find(self.clickRefItem());
			var endIdx = parentList.find(item);
			
			if(startIdx === -1) {
				self.clickRefItem(item);
				self.set([item]);
			}
			else {
				if(startIdx<endIdx) {
					self.set(parentList.items.slice(startIdx,endIdx+1));
				}
				else {
					self.set(parentList.items.slice(endIdx,startIdx+1));
				}
			}
		}
		else if(event.ctrlKey) {
		
			self.clickRefItem(item);
			
			if(item.isSelected()) {
				self.deselect(item);
			}
			else {
				self.add(item);
			}
		}
		else {
			self.clickRefItem(item);
			
			if(item.isSelected() && (self.items().length === 1)){
				self.set(_.clone(parentList.items()));
			}
			else {
				self.set([item]);
			}
		}
	}
	
	self.set = function(itemArray) {
		self.clear();
		
		for(var i = 0; i < itemArray.length; i++) {
			itemArray[i].isSelected(true);
		}
		
		self.items(itemArray);
	};

	self.clear = function() {
		var list = self.items();
		
		for(var i = 0; i < list.length; i++) {
			list[i].isSelected(false);
		}
		
		self.items([]);
	};

	self.add = function(item) {
		item.isSelected(true);
		
		self.items.push(item);
	};

	self.select = function(itemOrItems) {
		for(var i = 0; i < itemArray.length; i++) {
			if(!itemArray[i].isSelected()) {
				self.add(itemArray[i]);
			}
		}
	};

	self.deselect = function(item) {
		item.isSelected(false);
		
		return self.items.remove(item);
	};

	self.firstIndex = function() {
		var list = parentList.items();
		for(var i = 0; i < list.length; i++) {
			if(list[i].isSelected()) {
				return i;
			}
		}
		return -1;
	};

	self.lastIndex = function() {
		var list = parentList.items();
		var idx = -1;
		for(var i = 0; i < list.length; i++) {
			if(list[i].isSelected()) {
				idx = i;
			}
		}
		return idx;
	};

	/* ==================== Actions on All Selected Items ==================== */

	self.joinUp = function() {
		var idx = self.firstIndex();
		
		var image = _.clone(self.items());
		
		parentList.items.removeAll(image);
		
		parentList.insertAll(idx-1,self.items());
	};

	self.joinDown = function() {
		var idx = self.lastIndex();
		
		var image = _.clone(self.items());
		var l = image.length;
		
		parentList.items.removeAll(image);
		
		parentList.insertAll(idx-l,self.items());
	};

	self.shiftUpAll = function() {
		var first = self.firstIndex();
		var last = self.lastIndex();
		
		var list = parentList.items();
		
		for(var i = Math.max(1,first); i <= last; i++) {
			var item = list[i];
			if(item.isSelected()) {
				parentList.items.splice(i,1);
				parentList.items.splice(i-1,0,item);
			}
		}
	};

	self.shiftDownAll = function() {
		var first = self.firstIndex();
		var last = self.lastIndex();
		
		var list = parentList.items();
		
		for(var i = Math.min(last,list.length-2); i >= first; i--) {
			var item = list[i];
			if(item.isSelected()) {
				parentList.items.splice(i,1);
				parentList.items.splice(i+1,0,item);
			}
		}
	};

	// Clone selected brushes with no further changes
	self.cloneAll = function() {

		var idx = self.lastIndex();
		
		var list = _.clone(self.items());
		var cloneArray = new Array(list.length);
		
		for(var i = 0; i < list.length; i++) {
			cloneArray[i] = new wrapperType(list[i].getWritable());
		}
		
		// Try to insert immediately after the last selected brush if possible
		if(idx !== -1) {
			parentList.insertAll(idx,cloneArray);
		}
		else {
			// TODO:ERROR
			ko.utils.arrayPushAll(parentList.items,cloneArray);
		}
		
		// Select the new clones
		// TODO:SETTING
		self.set(cloneArray);
	};

	// Delete selected brushes
	self.removeAll = function() {
		
		var idx = self.lastIndex();
		
		// Find brush to view after current selection is removed
		var next = 0;
		
		var list = parentList.items();
		
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
			console.log("No selected brushes found on delete command; self should never happen");
		}
		
		// Remove all selected brushes from list
		parentList.items.removeAll(self.items());
		
		// TODO:TEST
		if(next) {
			self.set([next]);
		}
		else {
			self.clear();
		}
	};

	self.applyToolToAll = function(tool) {
		try {
			var image = _.clone(self.items());
			
			var output = new Array(image.length);
			
			for(var i = 0; i < image.length; i++) {
				output[i] = new wrapperType(tool.applyTo(image[i].getWritable()));
			}
			
			for(var i = 0; i < image.length; i++) {
				parentList.replace(image[i],output[i]);
			}
			// TODO:ERROR
			self.set(output);
		}
		catch(e) {
			// TODO:ERROR
			console.log(e);
		}
	};

	self.cloneToolToAll = function(tool) {
		try {
			var list = _.clone(self.items());
			
			var output = new Array(list.length);
			
			for(var i = 0; i < list.length; i++) {
				output[i] = new wrapperType(tool.applyTo(list[i].getWritable()));
			}
			
			var idx = self.lastIndex();
			
			// Try to insert immediately after the last selected item if possible
			if(idx !== -1) {
				parentList.insertAll(idx,output);
			}
			else {
				console.log("No selected items found after cloning; self should never happen");
				ko.utils.arrayPushAll(parentList.items,output);
			}
			
			self.set(output);
		}
		catch(e) {
			// TODO:ERROR
			console.log(e);
		}
	};
};

console.log("[DirectEdit] Added class: SelectionManager");