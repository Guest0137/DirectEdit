var dEdit = {
	readPlanetSpec: function(planetSpec) {
		// Grab a pointer for shorthand
		var c = model.dEdit.currentSpec;
		
		// Keep a copy of the original in memory
		// this should save anything not covered by a specific observable
		c.original = _.cloneDeep(planetSpec);
		
		// Make sure the observables get loaded
		function setOrDefault(obs, val, alt) {
			try {
				obs(val);
			}
			catch(e) {
				obs(alt);
			}
		}
		
		setOrDefault(c.name,						c.original.name,						"");
		setOrDefault(c.mass,						c.original.mass,						10000);
		setOrDefault(c.position_x,					c.original.position_x,					50000);
		setOrDefault(c.position_y,					c.original.position_y,					0);
		setOrDefault(c.velocity_x,					c.original.velocity_x,					0);
		setOrDefault(c.velocity_y,					c.original.velocity_y,					0);
		setOrDefault(c.required_thrust_to_move,		c.original.required_thrust_to_move,		0);
		setOrDefault(c.starting_planet,				c.original.starting_planet,				false);
		
		setOrDefault(c.planet.seed,					c.original.planet.seed,					0);
		setOrDefault(c.planet.radius,				c.original.planet.radius,				500);
		setOrDefault(c.planet.heightRange,			c.original.planet.heightRange,			0);
		setOrDefault(c.planet.waterDepth,			c.original.planet.waterDepth,			0);
		setOrDefault(c.planet.waterHeight,			c.original.planet.waterHeight,			0);
		setOrDefault(c.planet.temperature,			c.original.planet.temperature,			0);
		setOrDefault(c.planet.metalDensity,			c.original.planet.metalDensity,			0);
		setOrDefault(c.planet.metalClusters,		c.original.planet.metalClusters,		0);
		// biomeScale doesn't matter
		setOrDefault(c.planet.biome,				c.original.planet.biome,				"Moon");
		setOrDefault(c.planet.symmetryType,			c.original.planet.symmetryType,			"None");
		setOrDefault(c.planet.symmetricalMetal,		c.original.planet.symmetricalMetal, 	false);
		setOrDefault(c.planet.symmetricalStarts,	c.original.planet.symmetricalStarts,	false);
		// numArmies is display stuff? not sure
		setOrDefault(c.planet.landingZonesPerArmy,	c.original.planet.landingZonesPerArmy,	1);
		setOrDefault(c.planet.landingZoneSize,		c.original.planet.landingZoneSize,		100);
		
		if(typeof c.original.planetCSG !== "undefined") {
			dEdit.readBrushes(c.original.planetCSG);
		}
		else if((typeof c.original.source !== "undefined") && (typeof c.original.source.brushes !== "undefined")) {
			dEdit.readBrushes(c.original.source.brushes);
		}
		else {
			dEdit.readBrushes([]);
		}
	},
	
	// Construct valid planet object by observing observables
	writableCurrentSpec: function() {
		// Grab a pointer for shorthand
		var c = model.dEdit.currentSpec;
		
		// Start from the original version and paste in the current values
		var spec = _.cloneDeep(c.original);	// Some of these cloneDeeps could be removed
		
		// We do some rounding here. It seems like non-int values cause bugs.
		
		spec.name						 = c.name();
		spec.mass						 = Math.ceil(c.mass());
		spec.position_x					 = c.position_x();
		spec.position_y					 = c.position_y();
		spec.velocity_x					 = c.velocity_x();
		spec.velocity_y					 = c.velocity_y();
		spec.required_thrust_to_move	 = Math.ceil(c.required_thrust_to_move());
		spec.starting_planet			 = c.starting_planet();
		
		spec.planet.seed				 = Math.ceil(c.planet.seed());
		spec.planet.radius				 = Math.ceil(c.planet.radius());
		spec.planet.heightRange			 = Math.ceil(c.planet.heightRange());
		spec.planet.waterDepth			 = Math.ceil(c.planet.waterDepth());
		spec.planet.waterHeight			 = Math.ceil(c.planet.waterHeight());
		spec.planet.temperature			 = Math.ceil(c.planet.temperature());
		spec.planet.metalDensity		 = Math.ceil(c.planet.metalDensity());
		spec.planet.metalClusters		 = Math.ceil(c.planet.metalClusters());
		spec.planet.biome				 = c.planet.biome();
		spec.planet.symmetryType		 = c.planet.symmetryType();
		spec.planet.symmetricalMetal	 = c.planet.symmetricalMetal();
		spec.planet.symmetricalStarts	 = c.planet.symmetricalStarts();
		spec.planet.landingZonesPerArmy	 = Math.ceil(c.planet.landingZonesPerArmy());
		spec.planet.landingZoneSize		 = Math.ceil(c.planet.landingZoneSize());
		
		if(typeof spec.source === "undefined") {
			spec.source = {};
		}
		
		var info = c.rootBrushGroup.getWritable();
		
		spec.source.brushes = info.brushes;
		spec.planetCSG = info.brushes;
		
		return spec;
	},
	
    // Load a copy of the chosen planet for editing
    readPlanet: function() {
        dEdit.readPlanetSpec(model.dEdit.selectedPlanet());
    },
	
    // Write the stored planet copy to the system
    // Also delete any planet that's already in the same location
    writePlanet: function (overwrite) {
		// Default behavior is to overwrite
        if(typeof overwrite === "undefined") {
            overwrite = true;
        }
		
		if(overwrite) {
			// TODO better overwrite logic
			var sys_x = model.dEdit.currentSpec.position_x();
			var sys_y = model.dEdit.currentSpec.position_y();
			
			if(typeof model.system().planets !== "undefined") {
				var l = model.system().planets.length;
			
			
				for(var i = 0; i < l; i++) {
					if((model.system().planets[i].position_x === sys_x)&&(model.system().planets[i].position_y === sys_y)) {
						model.removePlanet(i);
						break;
					}
				}
			}
			console.log("Should be overwriting");
		}
		
        api.systemEditor.addPlanet(dEdit.writableCurrentSpec());
    }
	
};

// Initialize model observables
model.dEdit = {
	version: "0.2.0 (Work in Progress)",
	currentSpec: {

		name: ko.observable(),
		mass: ko.observable(),
		position_x: ko.observable(),
		position_y: ko.observable(),
		velocity_x: ko.observable(),
		velocity_y: ko.observable(),
		required_thrust_to_move: ko.observable(),
		starting_planet: ko.observable(),
		
		planet: {
			seed: ko.observable(),
			radius: ko.observable(),
			heightRange: ko.observable(),
			waterDepth: ko.observable(),
			waterHeight: ko.observable(),
			temperature: ko.observable(),
			metalDensity: ko.observable(),
			metalClusters: ko.observable(),
			biome: ko.observable(),
			symmetryType: ko.observable(),
			symmetricalMetal: ko.observable(),
			symmetricalStarts: ko.observable(),
			landingZonesPerArmy: ko.observable(),
			landingZoneSize: ko.observable(),
		}
		
		// rootBrushGroup is initialized in another file
	}
};

model.dEdit.selectedPlanet = ko.observable({});

console.log("DirectEdit core loaded");