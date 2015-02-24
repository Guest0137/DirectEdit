dEdit.api.registerPlanetTool(
	{
		label: "Resize",
		description: "Change the planet's radius and adjust CSG, metal spots and landing zones appropriately.",
		warning: "May need manual adjustment on planets with random heightmaps",
		
		activeFields: {num_add: "New radius"},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.radius = Math.round(fields.num_add);
			
			fn.applyTo = function(planetSpec) {
				var cl = _.cloneDeep(planetSpec);
				
				var radius_old = cl.planet.radius;
				var ratio = fn.radius / radius_old;
				
				cl.planet.radius = fn.radius;
				
				cl.source = cl.source ? cl.source : {};
				
				if(typeof cl.planetCSG !== "undefined") {
					var csg = cl.planetCSG;
					for(var i = 0; i < csg.length; i++) {
						csg[i].height *= ratio;
						csg[i].scale[0] *= ratio;
						csg[i].scale[1] *= ratio;
						csg[i].scale[2] *= ratio;
					}
					cl.planetCSG = csg;
					cl.source.brushes = csg;
				}
				if(typeof cl.metal_spots !== "undefined") {
					var metal = cl.metal_spots;
					for(var i = 0; i < metal.length; i++) {
						metal[i][0] *= ratio;
						metal[i][1] *= ratio;
						metal[i][2] *= ratio;
					}
					cl.metal_spots = metal;
					cl.source.metal_spots = metal;
				}
				if(typeof cl.landing_zones !== "undefined" && typeof cl.landing_zones.list !== "undefined") {
					var spawns = cl.landing_zones;
					for(var i = 0; i < spawns.list.length; i++) {
						spawns.list[i][0] *= ratio;
						spawns.list[i][1] *= ratio;
						spawns.list[i][2] *= ratio;
					}
					cl.landing_zones = spawns;
					cl.source.landing_zones = spawns;
				}
				
				return cl;
			};
			
			return fn;
		}
	}
);