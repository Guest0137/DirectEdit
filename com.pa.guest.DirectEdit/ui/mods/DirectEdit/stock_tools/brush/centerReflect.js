dEdit.api.registerBrushTool(
	{
		label: "Reflect through center",
		description: "Flip this brush to the position on the opposite side of the planet.",
		
		activeFields: {},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				// Flip X and Y
				cl.position[0] = -cl.position[0];
				cl.position[1] = -cl.position[1];
				
				// Reverse orientation, flipping Z
				cl.mirrored = !cl.mirrored;
				
				// Rotate
				cl.rotation = cl.rotation + Math.PI;
				
				return cl;
			};
			
			return fn;
		}
	}
);