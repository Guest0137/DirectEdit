dEdit.api.registerBrushTool(
	{
		label: "[T] Translate",
		description: "Adjust the translation vector encoded in the transform matrix.",
		warning: "I hope you know what you're doing.",
		
		activeFields: {
			vec_translate: "Translation",
		},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.vector = fields.vector;
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				cl.transform[3] += fn.vector[0];
				cl.transform[7] += fn.vector[1];
				cl.transform[11] += fn.vector[2];
				
				return cl;
			};
			
			return fn;
		}
	}
);