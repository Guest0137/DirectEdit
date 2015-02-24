dEdit.api.registerBrushTool(
	{
		label: "Add elevation",
		description: "Add to or subtract from the brush's height.",
		
		activeFields: {
			num_add: "Height change"
		},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.delta = fields.num_sum;
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.height += fn.delta;
				return cl;
			};
			
			return fn;
		}
	}
);