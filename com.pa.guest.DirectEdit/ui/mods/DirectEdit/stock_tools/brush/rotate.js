dEdit.api.registerBrushTool(
	{
		label: "Rotate about axis",
		description: "Rotate this brush a certain number of degrees about a certain axis.",
		warning: "Rotations may not be set properly for vectors other than [0,0,1].",
		
		activeFields: {
			vec_direction: "Axis",
			num_angle: "Angle (deg)"
		},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.axis = fields.vec_direction;
			fn.angle = fields.num_angle; // This should be passed in as radians
			
			// Make rotation matrix
			
			fn.axisNormal = dEdit.vMult(fn.axis,1/Math.sqrt(dEdit.innerProduct(fn.axis,fn.axis)));
			
			var u = fn.axisNormal; // just a pointer
			var c = Math.cos(fn.angle);
			var s = Math.sin(fn.angle);
			fn.matrix = [ [c + u[0]*u[0]*(1-c),       u[0]*u[1]*(1-c) - u[2]*s,  u[0]*u[2]*(1-c) + u[1]*s],
			              [u[1]*u[0]*(1-c) + u[2]*s,  c + u[1]*u[1]*(1-c),       u[1]*u[2]*(1-c) - u[0]*s],
						  [u[2]*u[0]*(1-c) - u[1]*s,  u[2]*u[1]*(1-c) + u[0]*s,  c + u[2]*u[2]*(1-c)     ] ];
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				cl.position = dEdit.flatten2D(dEdit.matMult(fn.matrix,dEdit.columnize(cl.position)));
				
				// TODO set rotation prfnerly
				cl.rotation += fn.angle;
				
				return cl;
			};
			
			return fn;
		}
	}
);