dEdit.api.registerSpawnTool(
	{
		label: "Reflect through plane",
		description: "Reflect the landing zone across the plane normal to the input vector.",
		
		activeFields: {
			vec_direction: "Normal vector"
		},
		
		getFunction: function(fields) {
			var fn = {};
			fn.planeVector = fields.vec_direction;
			
			fn.applyTo = function(spawn) {
				var cl = _.cloneDeep(spawn);
				
				// Change position
				var p = dEdit.innerProduct(cl.location,fn.planeVector) / dEdit.innerProduct(fn.planeVector,fn.planeVector);
				cl.location = dEdit.vAdd(cl.location,dEdit.vMult(fn.planeVector,-2*p));
				
				return cl;
			};
			
			return op;
		}
	}
);