// Add list of planets
model.dEdit.listPlanets = ko.computed (function() {
		var planetsList = Array({});
		var planets = model.system().planets.slice();
		planetsList = planetsList.concat(planets);
		return planetsList;
	});

model.dEdit.brushDetail = {};

model.dEdit.brushDetail.currentBrush = ko.observable(new dEdit.BrushWrapper({}));
model.dEdit.brushDetail.active = ko.observable(false);

// Brush selection logic
model.dEdit.brushDetail.viewBrush = function(brushWrapper) {
	model.dEdit.brushDetail.currentBrush().isSelected(false);
	brushWrapper.isSelected(true);
	model.dEdit.brushDetail.currentBrush(brushWrapper);
	model.dEdit.brushDetail.active(true);
};

model.dEdit.brushDetail.hide = function() {
	model.dEdit.brushDetail.active(false);
};

// Wrapper for something that will be more complicated later
model.dEdit.brushDetail.find = function(brushWrapper) {
	return model.dEdit.currentSpec.rootBrushGroup.members.indexOf(brushWrapper);
};

model.dEdit.brushDetail.shiftCurrentUp = function() {
	var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
	
	if(idx > 0) {
		model.dEdit.currentSpec.rootBrushGroup.members.splice(idx,1);
		model.dEdit.currentSpec.rootBrushGroup.members.splice(idx-1,0,model.dEdit.brushDetail.currentBrush());
	}
};

model.dEdit.brushDetail.shiftCurrentDown = function() {
	var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
	
	model.dEdit.currentSpec.rootBrushGroup.members.splice(idx,1);
	model.dEdit.currentSpec.rootBrushGroup.members.splice(idx+1,0,model.dEdit.brushDetail.currentBrush());
};

// Simple clone logic
model.dEdit.brushDetail.cloneCurrent = function() {
	var cl = model.dEdit.brushDetail.currentBrush().getWritable();
	var wr = new dEdit.BrushWrapper(cl);
	
	var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
	
	if(idx !== -1) {
		model.dEdit.currentSpec.rootBrushGroup.members.splice(idx+1,0,wr);
	}
	else {
		console.log("Current brush not found? this should never happen");
		model.dEdit.brushDetail.members.push(wr);
	}
	
	model.dEdit.brushDetail.viewBrush(wr);
};

// Deletion
model.dEdit.brushDetail.removeCurrent = function() {
	
	var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
	
	if(idx !== -1) {
		model.dEdit.currentSpec.rootBrushGroup.members.splice(idx,1);
		
		var l = model.dEdit.currentSpec.rootBrushGroup.members().length;
		if(l > 0) {
			if(idx < l) {
				// Select brush after this if possible
				model.dEdit.brushDetail.viewBrush(model.dEdit.currentSpec.rootBrushGroup.members()[idx]);
			}
			else {
				// Otherwise select brush before this
				model.dEdit.brushDetail.viewBrush(model.dEdit.currentSpec.rootBrushGroup.members()[idx-1]);
			}
		}
		else {
			// If list is empty, hide it
			model.dEdit.brushDetail.hide();
		}
	}
};

// Display stuff
model.dEdit.opChar = function(str) {
	if(str === "BO_Add") {
		return "+";
	}
	else if(str === "BO_Subtract") {
		return "-";
	}
	else {
		return "?";
	}
};

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

// Brush op UI
model.dEdit.currentOp = {
	type: ko.observable(dEdit.brushOps.centerReflect),
	vector: [ko.observable(),ko.observable(),ko.observable()],
	relative: ko.observable(),
	absolute: ko.observable(),
	angle: ko.observable()
};

model.dEdit.currentOp.isValid = ko.computed(function() {
	var active = model.dEdit.currentOp.type().activeFields;
	
	// TODO make sure a brush is selected
	
	return( (!active.vector || ($.isNumeric(model.dEdit.currentOp.vector[0]()) && $.isNumeric(model.dEdit.currentOp.vector[1]()) &&	$.isNumeric(model.dEdit.currentOp.vector[2]())) ) &&
			(!active.relative || ($.isNumeric(model.dEdit.currentOp.relative())) ) &&
			(!active.absolute || ($.isNumeric(model.dEdit.currentOp.absolute())) ) &&
			(!active.angle || ($.isNumeric(model.dEdit.currentOp.angle())) )
		);
});

dEdit.getCurrentOp = function() {
	var c = model.dEdit.currentOp;
	if(c.isValid()) {
		return c.type().getOp( {
			vector: [c.vector[0](), c.vector[1](), c.vector[2]()],
			relative: c.relative(),
			absolute: c.absolute(),
			angle: dEdit.degToRad(c.angle())
		} );
	}
	else {
		throw "Operation not valid";
	}
};

dEdit.applyOpToCurrent = function() {
	try {
		var output = dEdit.getCurrentOp().applyTo(model.dEdit.brushDetail.currentBrush().getWritable());
		var wr = new dEdit.BrushWrapper(output);
		
		var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
		
		if(idx !== -1) {
			model.dEdit.currentSpec.rootBrushGroup.members.splice(idx,1,wr);
			model.dEdit.brushDetail.viewBrush(wr);
		}
		else {
			console.log("Current brush not found? this should never happen");
		}
	}
	catch(e) {
		console.log("Attempted to apply incomplete brush op");
	}
};

dEdit.applyOpToCurrentClone = function() {
	try {
		var output = dEdit.getCurrentOp().applyTo(model.dEdit.brushDetail.currentBrush().getWritable());
		var wr = new dEdit.BrushWrapper(output);
		
		var idx = model.dEdit.brushDetail.find(model.dEdit.brushDetail.currentBrush());
		
		if(idx !== -1) {
			model.dEdit.currentSpec.rootBrushGroup.members.splice(idx+1,0,wr);
		}
		else {
			console.log("Current brush not found? this should never happen");
			model.dEdit.brushDetail.members.push(wr);
		}
		model.dEdit.brushDetail.viewBrush(wr);
	}
	catch(e) {
		console.log("Attempted to apply incomplete brush op");
	}
};

console.log("DirectEdit UI components loaded");

//load html dynamically (thanks CC)
function loadHtmlTemplate(element, url) {
    element.load(url, function () {
        console.log("Loading html " + url);
        element.children().each(function() {
			ko.applyBindings(model, this);
		});
    });
}

// Create frame
(function() {
	// Create main frame
	createFloatingFrame("dEdit_base", 320, 620, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_base_content"), "coui://ui/mods/DirectEdit/DirectEdit_panel_main.html");
	
	// Create frame for editing individual brushes
	createFloatingFrame("dEdit_brushDetail", 320, 440, {"offset": "center"});
	// Inject HTML into frame
	loadHtmlTemplate($("#dEdit_brushDetail_content"), "coui://ui/mods/DirectEdit/DirectEdit_panel_brushDetail.html");
	// Make sure it hides correctly
	$("#dEdit_brushDetail").attr("data-bind","visible: dEdit.brushDetail.active");
})();

console.log("DirectEdit HTML loaded");
