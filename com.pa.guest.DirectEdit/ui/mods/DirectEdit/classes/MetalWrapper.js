
/* ==================== Metal spot wrapper class ==================== */

dEdit.MetalWrapper = function(vector) {
	var self = this;
	
	self.isSelected = ko.observable(false);
	
	self.location = [
		ko.observable(vector[0]),
		ko.observable(vector[1]),
		ko.observable(vector[2])
		];
	
	this.getWritable = function() {
		return [self.location[0](),self.location[1](),self.location[2]()];
	};
};

console.log("[DirectEdit] Added class: MetalWrapper");