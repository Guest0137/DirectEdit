
/* ==================== Landing zone wrapper class ==================== */

/* 	There's some weirdness here I should probably explain.

	Landing zones used to be stored as an array of positons, like metal spots
	are right now. As of a recent update, they are now stored as an array of
	positions called "list" and an array of {min: , max: ,} objects called
	"rules".
	
	This presents a complication because each object is split among two arrays.
	To deal with this, I merge the arrays when reading the planet before wrapping
	each landing zone object. With brushes, DirectEdit should not affect any parameters
	that aren't explicitly handled; this is not the case with landing zones,
	so landing zone handling is liable to break if the data format is altered.
	
	This system is subject to change with further PA updates.
*/

dEdit.SpawnWrapper = function(spawn) {
	var self = this;
	self.original = spawn;
	
	self.isSelected = ko.observable(false);
	
	if(typeof self.original.location === "undefined") {
		self.location = [
			ko.observable(0),
			ko.observable(0),
			ko.observable(0)
		];
	}
	else {
		self.location = [
			ko.observable(self.original.location[0]),
			ko.observable(self.original.location[1]),
			ko.observable(self.original.location[2])
		];
	}
		
	self.min = ko.observable(self.original.min);
	self.max = ko.observable(self.original.max);
	
	self.getWritable = function() {
		var spawn = _.cloneDeep(self.original);
		
		spawn.location = [
			self.location[0](),
			self.location[1](),
			self.location[2]()
		];
		spawn.min = self.min();
		spawn.max = self.max();
		
		return spawn;
	};
};

console.log("[DirectEdit] Added class: SpawnWrapper");