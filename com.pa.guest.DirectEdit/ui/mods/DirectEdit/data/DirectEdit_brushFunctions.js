
/* ==================== Selectable functions ====================
   This is a really weird implementation, might redo it later
   At least it's extensible!
   
   Detailed comments on the first one
*/

dEdit.brushFunctions = {
	// This object is a "type" of operation from which instances may be derived
	centerReflect: {
		// Name of this op in the Select box
		label: "Reflect through center",
		
		// Which fields should be visible when constructing the function
		// This is the jankiest part right here
		activeFields: {
			vector: false,
			relative: false,
			absolute: false,
			angle: false
		},
		
		// This function constructs the actual function which acts on brushes
		// It is called when all necessary fields have been set
		getFunction: function(fields) {
			
			// op is a container for both the function and any necessary field values
			var op = {};
			
			// This function gets the result of applying the instantiated operation to
			// a particular brushSpec; note that it does not modify the input
			op.applyTo = function(brushSpec) {
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
			
			return op;
		}
	},
	
	rotate: {
		label: "Rotate about axis",
		activeFields: {
			vector: true,
			relative: false,
			absolute: false,
			angle: true
		},
		getFunction: function(fields) {
			var op = {};
			op.axis = fields.vector;
			op.angle = fields.angle; // This should be passed in as radians
			
			// Make rotation matrix
			
			op.axisNormal = dEdit.vMult(op.axis,1/Math.sqrt(dEdit.innerProduct(op.axis,op.axis)));
			
			var u = op.axisNormal; // just a pointer
			var c = Math.cos(op.angle);
			var s = Math.sin(op.angle);
			op.matrix = [ [c + u[0]*u[0]*(1-c),       u[0]*u[1]*(1-c) - u[2]*s,  u[0]*u[2]*(1-c) + u[1]*s],
			              [u[1]*u[0]*(1-c) + u[2]*s,  c + u[1]*u[1]*(1-c),       u[1]*u[2]*(1-c) - u[0]*s],
						  [u[2]*u[0]*(1-c) - u[1]*s,  u[2]*u[1]*(1-c) + u[0]*s,  c + u[2]*u[2]*(1-c)     ] ];
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				cl.position = dEdit.flatten2D(dEdit.matMult(op.matrix,dEdit.columnize(cl.position)));
				
				// TODO set rotation properly
				cl.rotation += op.angle;
				
				return cl;
			};
			
			return op;
		}
	},
	
	planeReflect: {
		label: "Reflect through plane",
		activeFields: {
			vector: true,
			relative: false,
			absolute: false,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			op.planeVector = fields.vector;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				// Change position
				var p = dEdit.innerProduct(cl.position,op.planeVector) / dEdit.innerProduct(op.planeVector,op.planeVector);
				cl.position = dEdit.vAdd(cl.position,dEdit.vMult(op.planeVector,-2*p));
				
				// Reverse orientation
				cl.mirrored = ! cl.mirrored;
				cl.position[2] = -cl.position[2]
				
				// TODO set rotation properly
				
				return cl;
			};
			
			return op;
		}
	},
	
	multiplyScale: {
		label: "Multiply brush scale",
		activeFields: {
			vector: false,
			relative: true,
			absolute: false,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			op.factor = fields.relative;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.scale = dEdit.vMult(cl.scale,op.factor);
				return cl;
			};
			
			return op;
		}
	},
	
	addElevation: {
		label: "Add elevation",
		activeFields: {
			vector: false,
			relative: false,
			absolute: true,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			op.delta = fields.absolute;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.height += op.delta;
				return cl;
			};
			
			return op;
		}
	},
	
	randomizePsi: {
		label: "Randomize rotation property",
		activeFields: {
			vector: false,
			relative: false,
			absolute: false,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.rotation = Math.random()*2*Math.PI;
				return cl;
			};
			
			return op;
		}
	},
	
	invert: {
		label: "Invert",
		activeFields: {
			vector: false,
			relative: false,
			absolute: false,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			
			op.applyTo = function(brushSpec) {
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
			
			return op;
		}
	}/*,
	
	t_translate: {
		label: "[T] Translate",
		activeFields: {
			vector: true,
			relative: false,
			absolute: false,
			angle: false
		},
		getFunction: function(fields) {
			var op = {};
			
			op.vector = fields.vector;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				
				cl.transform[3] += op.vector[0];
				cl.transform[7] += op.vector[1];
				cl.transform[11] += op.vector[2];
				
				return cl;
			};
			
			return op;
		}
	}*/
}

// List of objects used to populate a Select box
model.dEdit.brushFunctionsArray = [	dEdit.brushFunctions.centerReflect,
								dEdit.brushFunctions.rotate,
								dEdit.brushFunctions.planeReflect,
								dEdit.brushFunctions.multiplyScale,
								dEdit.brushFunctions.addElevation,
								dEdit.brushFunctions.randomizePsi,
								dEdit.brushFunctions.invert/*,
								dEdit.brushFunctions.t_translate*/ ];

// If you want to define a new brush function, just add an object with the right structure to this array

console.log("[DirectEdit] Brush operations loaded");