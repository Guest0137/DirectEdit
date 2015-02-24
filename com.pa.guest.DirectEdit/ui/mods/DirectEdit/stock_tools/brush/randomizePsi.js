dEdit.api.registerBrushTool(
	{
		label: "Randomize rotation",
		description: "Set the brush's rotation property to a random angle.",
		
		activeFields: {},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.rotation = Math.random()*2*Math.PI;
				return cl;
			};
			
			return fn;
		}
	}
);