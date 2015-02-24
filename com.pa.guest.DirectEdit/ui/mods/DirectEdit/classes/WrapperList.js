
/* ==================== Generic item wrapper list "class" ==================== */

dEdit.WrapperList = function(wrapperType) {
	var self = this;
	
	self.items = ko.observableArray();
	
	self.itemClass = wrapperType;
	
	self.selectionManager = new dEdit.SelectionManager(self,wrapperType);
	
	self.getWritable = function() {

		var writableItems = [];
		
		// Get pointer to array
		var list = self.items();
		
		for (i = 0; i < list.length; i++) {
			writableItems.push(list[i].getWritable());	// Use map function instead?
		}
		
		return writableItems;
	};
	
	self.find = function(itemWrapper) {
		return self.items.indexOf(itemWrapper);
	};

	self.insertAll = function(index, array) {
		for(var i = 0; i < array.length; i++) {
			self.items.splice(index+i+1, 0, array[i]);
		}
	};

	self.replace = function(itemWrapper,replacement) {
		var idx = self.find(itemWrapper);
		if(idx !== -1) {
			// Add to selection manager if one exists and the replaced item was selected
			if(typeof self.selectionManager !== "undefined") {
				if(self.selectionManager.deselect(itemWrapper).length > 0) {
					self.selectionManager.add(replacement);
				}
			}
			self.items.splice(idx,1,replacement);
		}
		else {
			// TODO:ERROR
			console.log("Couldn't find item to replace");
		}
	};

	/* Unneeded and computationally expensive
	self.shiftUp = function(itemWrapper) {
		var idx = self.find(itemWrapper);
		
		// implicit: idx !== -1
		if(idx > 0) {
			self.items.splice(idx,1);
			self.items.splice(idx-1,0,itemWrapper);
			return true;
		}
		return false;
	};

	self.shiftDown = function(itemWrapper) {
		var idx = self.find(itemWrapper);
		if(idx !== -1) {
			if((idx+1) < self.items().length) {
				self.items.splice(idx,1);
				self.items.splice(idx+1,0,itemWrapper);
				return true;
			}
		}
		return false;
	};
	*/
	self.isEmpty = ko.computed( function() {
		return self.items().length === 0;
	});
	
	self.isSingle = ko.computed( function() {
		return self.items().length === 1;
	});
	
	self.isMulti = ko.computed( function() {
		return self.items().length > 1;
	});
	
	self.readItems = function(rawItemArray) {
		self.items([]);
		
		// Deselect everything if applicable
		if(typeof self.selectionManager !== "undefined") {
			self.selectionManager.clear();
		}
		// TODO:ERROR
		
		var temp = new Array(rawItemArray.length);
		
		// Wrap raw items
		for(var i = 0; i < rawItemArray.length; i++) {
			temp[i] = new wrapperType(rawItemArray[i]);
		}
		
		// Replace current data
		self.items(temp);
	};
};

console.log("[DirectEdit] Added class: WrapperList");