dEdit.api.registerSpawnTool(
	{
		label: "Reflect through center",
		description: "Flip this landing zone to the position on the opposite side of the planet.",
		
		activeFields: {},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.applyTo = function(spawn) {
				var cl = _.cloneDeep(spawn);
				
				cl.location[0] = -cl.location[0];
				cl.location[1] = -cl.location[1];
				cl.location[2] = -cl.location[2];
				
				return cl;
			};
			
			return fn;
		}
	}
);