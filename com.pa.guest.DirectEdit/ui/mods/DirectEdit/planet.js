model.dEdit.hasPlanet = ko.observable(false);

model.dEdit.currentSpec = new function() {
	var self = this;
	
	self.original = {};
	
	self.name = ko.observable();
	self.mass = ko.observable();
	self.position_x = ko.observable();
	self.position_y = ko.observable();
	self.velocity_x = ko.observable();
	self.velocity_y = ko.observable();
	self.required_thrust_to_move = ko.observable();
	self.starting_planet = ko.observable();
	
	self.planet = {
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
		landingZoneSize: ko.observable()
	};
	
	self.brushList = new dEdit.WrapperList(dEdit.BrushWrapper);
	self.metalList = new dEdit.WrapperList(dEdit.MetalWrapper);
	self.spawnList = new dEdit.WrapperList(dEdit.SpawnWrapper);
	
	self.read = function(planetSpec) {
		// Keep a copy of the original in memory
		// this should save anything not covered by a specific observable
		self.original = _.cloneDeep(planetSpec);
		
		// Set observable to a safe default value if it isn't found
		function setOrDefault(obs, val, alt) {
			try {
				obs(val);
			}
			catch(e) {
				obs(alt);
			}
		}
		
		setOrDefault(self.name,							self.original.name,							"");
		setOrDefault(self.mass,							self.original.mass,							10000);
		setOrDefault(self.position_x,					self.original.position_x,					50000);
		setOrDefault(self.position_y,					self.original.position_y,					0);
		setOrDefault(self.velocity_x,					self.original.velocity_x,					0);
		setOrDefault(self.velocity_y,					self.original.velocity_y,					0);
		setOrDefault(self.required_thrust_to_move,		self.original.required_thrust_to_move,		0);
		setOrDefault(self.starting_planet,				self.original.starting_planet,				false);
		
		setOrDefault(self.planet.seed,					self.original.planet.seed,					0);
		setOrDefault(self.planet.radius,				self.original.planet.radius,				500);
		setOrDefault(self.planet.heightRange,			self.original.planet.heightRange,			0);
		setOrDefault(self.planet.waterDepth,			self.original.planet.waterDepth,			0);
		setOrDefault(self.planet.waterHeight,			self.original.planet.waterHeight,			0);
		setOrDefault(self.planet.temperature,			self.original.planet.temperature,			0);
		setOrDefault(self.planet.metalDensity,			self.original.planet.metalDensity,			0);
		setOrDefault(self.planet.metalClusters,			self.original.planet.metalClusters,			0);
		// biomeScale doesn't matter
		setOrDefault(self.planet.biome,					self.original.planet.biome,					"Moon");
		setOrDefault(self.planet.symmetryType,			self.original.planet.symmetryType,			"None");
		setOrDefault(self.planet.symmetricalMetal,		self.original.planet.symmetricalMetal, 		false);
		setOrDefault(self.planet.symmetricalStarts,		self.original.planet.symmetricalStarts,		false);
		// numArmies is display stuff? not sure
		setOrDefault(self.planet.landingZonesPerArmy,	self.original.planet.landingZonesPerArmy,	1);
		setOrDefault(self.planet.landingZoneSize,		self.original.planet.landingZoneSize,		100);
		
		// Try to read brushes
		if(typeof self.original.planetCSG !== "undefined") {
			self.brushList.readItems(self.original.planetCSG);
		}
		else if((typeof self.original.source !== "undefined") && (typeof self.original.source.brushes !== "undefined")) {
			self.brushList.readItems(self.original.source.brushes);
		}
		else {
			self.brushList.readItems([]);
		}
		
		// Try to read metal spots
		if(typeof self.original.metal_spots !== "undefined") {
			self.metalList.readItems(self.original.metal_spots);
		}
		else if((typeof self.original.source !== "undefined") && (typeof self.original.source.metal_spots !== "undefined")) {
			self.metalList.readItems(self.original.source.metal_spots);
		}
		else {
			self.metalList.readItems([]);
		}
		
		// Try to read landing zones
		// This is wonky; see comment in SpawnWrapper
		
		var splitSpawnArray = [];
		
		if(typeof self.original.landing_zones !== "undefined") {
			readSpawns(self.original.landing_zones);
		}
		else if((typeof self.original.source !== "undefined") && (typeof self.original.source.landing_zones !== "undefined")) {
			readSpawns(self.original.source.landing_zones);
		}
		else {
			self.spawnList.readItems([]);
		}
		
		function readSpawns(obj) {
			var mergedArray = [];
			
			if(typeof obj.list !== "undefined" && typeof obj.rules !== "undefined") {
				for (var i = 0; i < obj.list.length; i++) {
					mergedArray.push({
						location: obj.list[i],
						min: obj.rules[i].min ? obj.rules[i].min : 0,
						max: obj.rules[i].max ? obj.rules[i].max : 10
					});
				}
			}
			else if($.isArray(obj)) {
				for (var i = 0; i < obj.length; i++) {
					mergedArray.push({
						location: obj[i],
						min: 0,
						max: 10
					});
				}
			}
			else {
				throw "Unrecognized landing zone array format";
			}
			
			self.spawnList.readItems(mergedArray);
		}
		model.dEdit.hasPlanet(true);
	};
	
	// Construct valid planet object by observing observables
	self.getWritable = function() {
		// Start from the original version and paste in the current values
		var spec = _.cloneDeep(self.original);	// Some of these cloneDeeps could be removed
		
		// We do some rounding here. It seems like non-int values cause bugs.
		spec.name						 = self.name();
		spec.mass						 = Math.ceil(self.mass());
		spec.position_x					 = self.position_x();
		spec.position_y					 = self.position_y();
		spec.velocity_x					 = self.velocity_x();
		spec.velocity_y					 = self.velocity_y();
		spec.required_thrust_to_move	 = Math.ceil(self.required_thrust_to_move());
		spec.starting_planet			 = self.starting_planet();
		
		spec.planet.seed				 = Math.ceil(self.planet.seed());
		spec.planet.radius				 = Math.ceil(self.planet.radius());
		spec.planet.heightRange			 = Math.ceil(self.planet.heightRange());
		spec.planet.waterDepth			 = Math.ceil(self.planet.waterDepth());
		spec.planet.waterHeight			 = Math.ceil(self.planet.waterHeight());
		spec.planet.temperature			 = Math.ceil(self.planet.temperature());
		spec.planet.metalDensity		 = Math.ceil(self.planet.metalDensity());
		spec.planet.metalClusters		 = Math.ceil(self.planet.metalClusters());
		spec.planet.biome				 = self.planet.biome();
		spec.planet.symmetryType		 = self.planet.symmetryType();
		spec.planet.symmetricalMetal	 = self.planet.symmetricalMetal();
		spec.planet.symmetricalStarts	 = self.planet.symmetricalStarts();
		spec.planet.landingZonesPerArmy	 = Math.ceil(self.planet.landingZonesPerArmy());
		spec.planet.landingZoneSize		 = Math.ceil(self.planet.landingZoneSize());
		
		if(typeof spec.source === "undefined") {
			spec.source = {};
		}
		
		var brushes = self.brushList.getWritable();
		spec.source.brushes = brushes;
		spec.planetCSG = brushes;
		
		var metal = self.metalList.getWritable();
		spec.source.metal_spots = metal;
		spec.metal_spots = metal;
		
		var mergedSpawns = self.spawnList.getWritable();
		var spawns = {list: [], rules: []};
		
		for(var i = 0; i < mergedSpawns.length; i++) {
			spawns.list.push(mergedSpawns[i].location);
			spawns.rules.push({min: mergedSpawns[i].min, max: mergedSpawns[i].max});
		}
		spec.source.landing_zones = spawns;
		spec.landing_zones = spawns;
		
		return spec;
	};
};
console.log("[DirectEdit] Planet handling loaded");
