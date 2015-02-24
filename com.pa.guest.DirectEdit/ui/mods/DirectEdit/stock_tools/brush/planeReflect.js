dEdit.api.registerBrushTool(
	{
		label: "Reflect through plane",
		description: "Reflect the brush across the plane normal to the input vector.",
		warning: "Rotations may not be set properly for vectors other than [0,0,1].",
		
		activeFields: {
			vec_direction: "Normal vector"
		},
		
		getFunction: function(fields) {
			var fn = {};
			fn.planeVector = fields.vec_direction;
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				// Change position
				var p = dEdit.innerProduct(cl.position,fn.planeVector) / dEdit.innerProduct(fn.planeVector,fn.planeVector);
				cl.position = dEdit.vAdd(cl.position,dEdit.vMult(fn.planeVector,-2*p));
				
				// Reverse orientation
				cl.mirrored = ! cl.mirrored;
				cl.position[2] = -cl.position[2]
				
				// TODO set rotation properly
				
				return cl;
			};
			
			return op;
		}
	}
);