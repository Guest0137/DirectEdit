dEdit.api.registerBrushTool(
	{
		label: "Multiply brush scale",
		description: "Multiply the scale of the brush along each axis by the corresponding vector component.",
		warning: "Scale with x != y may result in skewing.",
		
		activeFields: {
			vec_scaling: "Factor"
		},
		
		getFunction: function(fields) {
			var fn = {};
			fn.factor = fields.vec_scaling;
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.scale = [cl.scale[0]*fn.factor[0], cl.scale[1]*fn.factor[1], cl.scale[2]*fn.factor[2]];
				return cl;
			};
			
			return fn;
		}
	}
);