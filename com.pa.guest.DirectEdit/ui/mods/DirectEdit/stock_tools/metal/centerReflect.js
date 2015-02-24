dEdit.api.registerMetalTool(
	{
		label: "Reflect through center",
		description: "Flip this metal spot to the position on the opposite side of the planet.",
		
		activeFields: {},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.applyTo = function(location_array) {
				var cl = _.cloneDeep(location_array);
				
				cl[0] = -cl[0];
				cl[1] = -cl[1];
				cl[2] = -cl[2];
				
				return cl;
			};
			
			return fn;
		}
	}
);