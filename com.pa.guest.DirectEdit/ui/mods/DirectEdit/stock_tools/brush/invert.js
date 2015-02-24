dEdit.api.registerBrushTool(
	{
		label: "Invert",
		description: "Flip the brush upside-down and change its op type.",
		
		activeFields: {},
		
		getFunction: function(fields) {
			var fn = {};
			
			fn.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				cl.position[0] = -cl.position[0];
				cl.position[1] = -cl.position[1];
				cl.position[2] = -cl.position[2];
				
				cl.height = -cl.height;
				
				if(cl.op === "BO_Add") {
					cl.op = "BO_Subtract";
				}
				else if(cl.op === "BO_Subtract") {
					cl.op = "BO_Add";
				}
				
				return cl;
			};
			
			return fn;
		}
	}
);