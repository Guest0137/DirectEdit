
/* ==================== Miscellaneous UI stuff ==================== */

model.dEdit.opChar = function(str) {
	if		(str === "BO_Add") 		{return "+";}
	else if	(str === "BO_Subtract") {return "-";}
	else 							{return "?";}
};


model.dEdit.selectedPlanet = ko.observable({});

// Add list of planets
model.dEdit.listPlanets = ko.computed (function() {
		var planetsList = Array({});
		var planets = model.system().planets.slice();
		planetsList = planetsList.concat(planets);
		return planetsList;
	}
);



/* ==================== Persistent / static / global-esque variables ==================== */

model.dEdit.staticVars = {};

model.dEdit.staticVars.toolFields = {
	num_angle:		ko.observable(),
	num_add:		ko.observable(),
	num_mult:		ko.observable(),
	num_mean:		ko.observable(),
	num_sd:			ko.observable(),
	num_min:		ko.observable(),
	num_max:		ko.observable(),
	vec_direction:	[ko.observable(),ko.observable(),ko.observable()],
	vec_scaling:	[ko.observable(),ko.observable(),ko.observable()],
	vec_translate:	[ko.observable(),ko.observable(),ko.observable()]
};

model.dEdit.staticVars.getToolFieldValues = function() {
	var obj = {};
	var fields = model.dEdit.staticVars.toolFields;
	
	for (fKey in fields) {
		if ($.isArray(fields[fKey])) {
			obj[fKey] = [];
			for(var i = 0; i < fields[fKey].length; i++) {
				obj[fKey][i] = fields[fKey][i]()*1;
			}
		}
		else {
			obj[fKey] = fields[fKey]()*1;
		}
	}
	return obj;
};

/* ==================== User-friendly aliases for brush properties ==================== */

model.dEdit.staticVars.brushPropAliases = new function() {
	var self = this;
	var current = model.dEdit.currentSpec.brushList.selectionManager.current;
	
	// Liar z-coordinate
	// This is designed to allow a brush to be flipped in place
	self.z = ko.computed({
		read: function() {
			var z = current().position[2]();
			if(current().mirrored()) {
				return -z;
			}
			else {
				return z;
			}
		},
		write: function(value) {
			if(current().mirrored()) {
				current().position[2](-value);
			}
			else {
				current().position[2](value);
			}
		}
	});
	
	// Mirroring alias; this inverts the z-coordinate so the brush stays where it is
	self.orientationReversed = ko.computed({
		read: function() {
			return current().mirrored();
		},
		write: function(value) {
			if(current().mirrored()!==value) {
				current().position[2](-current().position[2]());
			}
			current().mirrored(value);
		}
	});

	// Spherical coordinate handling
	// Will add input capability "soon"
	self.theta = ko.computed({
		read: function() {
			var x = current().position[0]();
			var y = current().position[1]();
			var z = self.z();
			
			return(Math.atan2(x,y));
		}
	});
	
	// Rotation in degrees
	self.psi = ko.computed({
		read: function() {
			return dEdit.radToDeg(current().rotation() + self.theta());
		},
		write: function(value) {
			current().rotation(dEdit.degToRad(value) - self.theta());
		}
	});
};

/* ==================== Tool manager initializations ==================== */

model.dEdit.brushTools = new dEdit.ToolManager();
model.dEdit.metalTools = new dEdit.ToolManager();
model.dEdit.spawnTools = new dEdit.ToolManager();

model.dEdit.planetTools = new dEdit.ToolManager();

model.dEdit.applyPlanetTool = function() {
	model.dEdit.currentSpec.read(model.dEdit.planetTools.getApplicable().applyTo(model.dEdit.currentSpec.getWritable()));
}
/* ==================== Variables dictating visibility of UI sections ==================== */

model.dEdit.display = new function() {

	this.secondary = new function() {
		var secondary = this;
		
		secondary.mode = ko.observable("");
		
		secondary.active = ko.observable(false);
		secondary.show = function() {secondary.active(true);};
		secondary.hide = function() {secondary.active(false);};
		
		secondary.brushDetail = new function() {
			this.active = ko.computed(function() {
				return secondary.mode()==="brush";
			});
		};
		
		secondary.metalDetail = new function() {
			this.active = ko.computed(function() {
				return secondary.mode()==="metal";
			});
		};
		
		secondary.spawnDetail = new function() {
			this.active = ko.computed(function() {
				return secondary.mode()==="spawn";
			});
		};
		
		// Autohide secondary panel when nothing is selected
		// You can still use the "hide" button do force the panel to vanish, since the 
		// autohide is only updated when changes are made to an observableArray
		model.dEdit.currentSpec.brushList.selectionManager.items.subscribe(function(array) {
			secondary.mode("brush");
			if(array.length>0) {
				secondary.show();
			}
			else {
				secondary.hide();
			}
		});
		model.dEdit.currentSpec.metalList.selectionManager.items.subscribe(function(array) {
			secondary.mode("metal");
			if(array.length>0) {
				secondary.show();
			}
			else {
				secondary.hide();
			}
		});
		model.dEdit.currentSpec.spawnList.selectionManager.items.subscribe(function(array) {
			secondary.mode("spawn");
			if(array.length>0) {
				secondary.show();
			}
			else {
				secondary.hide();
			}
		});
	};
};

/* ==================== Planet read/write ==================== */

dEdit.readSelectedPlanet = function() {
	model.dEdit.display.secondary.hide();
	model.dEdit.currentSpec.read(model.dEdit.selectedPlanet());
};
	
// Write the stored planet copy to the system
// Also delete any planet that's already in the same location
dEdit.writePlanet = function (overwrite) {
	var planetToWrite = model.dEdit.currentSpec.getWritable();
	
	// Default behavior is to overwrite
	// TODO:SETTING
	if(typeof overwrite === "undefined") {
		overwrite = true;
	}
	
	
	if(overwrite) {
		
		var tolerance = 0.5;
		
		/*  In previous versions I would use model.removePlanet wherever I found a conflict.
			However, model.removePlanet sometimes just does nothing. Not sure why.
			This new method clears the entire system and writes all planets that don't conflict.
			
			Pros:	Guaranteed to erase planets in the write location
					Maintains order of planets in system
					
			Cons:	Unbuilds all planets
					Probably has hidden bugs that will corrupt data
					
			We'll see how it goes.
		*/
		
		var hasWritten = false;
		
		var planetsInitial = _.clone(model.system().planets);
		
		var numInitial = planetsInitial.length;
		var numDiscards = 0;
		
		
		model.removeAllPlanets();
		
		for(var i = 0; i < numInitial; i ++) {
			var xDiff = Math.abs(planetsInitial[i].position_x - planetToWrite.position_x);
			var yDiff = Math.abs(planetsInitial[i].position_y - planetToWrite.position_y);
			if((xDiff < tolerance) && (yDiff < tolerance)) {
				numDiscards++;
				if(!hasWritten) {
					hasWritten = true;
					api.systemEditor.addPlanet(planetToWrite);
				}
			}
			else {
				api.systemEditor.addPlanet(planetsInitial[i]);
			}
		}
		if(!hasWritten) {
			hasWritten = true;
			api.systemEditor.addPlanet(planetToWrite);
		}
		console.log("[DirectEdit] Overwrite: number of planets is " + numInitial + " - " + numDiscards + " + " + (hasWritten ? 1 : 0));
	}
	else {
		api.systemEditor.addPlanet(planetToWrite);
	}
};

console.log("[DirectEdit] UI components loaded");