dEdit.api.registerMetalTool(
	{
		label: "Reflect through plane",
		description: "Reflect the metal spot across the plane normal to the input vector.",
		warning: "Rotations may not be set properly for vectors other than [0,0,1].",
		
		activeFields: {
			vec_direction: "Normal vector"
		},
		
		getFunction: function(fields) {
			var fn = {};
			fn.planeVector = fields.vec_direction;
			
			fn.applyTo = function(location_array) {
				var cl = _.cloneDeep(location_array);
				
				// Change position
				var p = dEdit.innerProduct(cl,fn.planeVector) / dEdit.innerProduct(fn.planeVector,fn.planeVector);
				cl = dEdit.vAdd(cl,dEdit.vMult(fn.planeVector,-2*p));
				return cl;
			};
			
			return op;
		}
	}
);