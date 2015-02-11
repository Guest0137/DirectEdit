
/* ==================== Single Brush Editing ==================== */

// If exactly one brush is selected, return it for editing
model.dEdit.brushDetail.currentBrush = ko.computed(function() {
	if(model.dEdit.brushDetail.selected.brushes().length === 1) {
		return model.dEdit.brushDetail.selected.brushes()[0];
	}
	else {
		return (new dEdit.BrushWrapper({}));
	}
});

// Liar z-coordinate
// This is designed to allow a brush to be flipped in place
model.dEdit.brushDetail.z = ko.computed({
	read: function() {
		var z = model.dEdit.brushDetail.currentBrush().position[2]();
		if(model.dEdit.brushDetail.currentBrush().mirrored()) {
			return -z;
		}
		else {
			return z;
		}
	},
	write: function(value) {
		if(model.dEdit.brushDetail.currentBrush().mirrored()) {
			model.dEdit.brushDetail.currentBrush().position[2](-value);
		}
		else {
			model.dEdit.brushDetail.currentBrush().position[2](value);
		}
	}
});

// Mirroring alias; this inverts the z-coordinate so the brush stays where it is
model.dEdit.brushDetail.orientationReversed = ko.computed({
	read: function() {
		return model.dEdit.brushDetail.currentBrush().mirrored();
	},
	write: function(value) {
		if(model.dEdit.brushDetail.currentBrush().mirrored()!==value) {
			model.dEdit.brushDetail.currentBrush().position[2](-model.dEdit.brushDetail.currentBrush().position[2]());
		}
		model.dEdit.brushDetail.currentBrush().mirrored(value);
	}
});

// Spherical coordinate handling
// Will add input capability "soon"
model.dEdit.brushDetail.theta = ko.computed({
	read: function() {
		var x = model.dEdit.brushDetail.currentBrush().position[0]();
		var y = model.dEdit.brushDetail.currentBrush().position[1]();
		var z = model.dEdit.brushDetail.z();
		
		return(Math.atan2(x,y));
	}
});

// Rotation in degrees
model.dEdit.brushDetail.psi = ko.computed({
	read: function() {
		return dEdit.radToDeg(model.dEdit.brushDetail.currentBrush().rotation() + model.dEdit.brushDetail.theta());
	},
	write: function(value) {
		model.dEdit.brushDetail.currentBrush().rotation(dEdit.degToRad(value) - model.dEdit.brushDetail.theta());
	}
});

console.log("[DirectEdit] Brush editing helpers loaded");