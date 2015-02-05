// You'd think some of this stuff would be in Math already
dEdit.radToDeg = function (rad) {
	try {
		return rad*(180/Math.PI);
	}
	catch(e) {
		return 0;
	}
};
dEdit.degToRad = function (deg) {
	try {
		return deg*(Math.PI/180);
	}
	catch(e) {
		return 0;
	}
};
dEdit.innerProduct = function(a,b) {
	if(a.length===b.length) {
		var s = 0;
		for(var i = 0; i < a.length; i++) {
			s += a[i]*b[i];
		}
		return s;
	}
};
dEdit.outerProduct = function(a,b) {
	// Preallocate (maybe useful?)
	var M = Array(a.length);
	for(var i = 0; i < a.length; i++) {
		M[i] = Array(b.length);
	}
	
	for(var i = 0; i < a.length; i++) {
		for(var j = 0; j < b.length; i++) {
			M[i][j] = a[i]*b[j];
		}
	}
	
	return M;
};
dEdit.columnize = function(v) {
	var A = new Array(v.length);
	for(var i = 0; i < v.length; i++) {
		A[i] = [v[i]];
	}
	return A;
};
dEdit.flatten2D = function(A) {
	
	var v = _.cloneDeep(A);
	
	if(A[0].length === 1) {
		for(var i = 0; i < A.length; i++) {
			v[i] = A[i][0];
		}
	}
	if(A.length === 1) {
		v = v[0];
	}
	
	return v;
};
dEdit.matMult = function(A,B) {
	var rowsA = A.length;
	var colsA = A[0].length;
	var rowsB = B.length;
	var colsB = B[0].length;
	if(colsA === rowsB) {
		// Preallocate
		var M = new Array(rowsA);
		for(var i = 0; i < rowsA; i++) {
			M[i] = new Array(colsB);
		}
		
		// Multiply
		for(var i = 0; i < rowsA; i++) {
			for(var j = 0; j < colsB; j++) {
				M[i][j] = 0;
				for(var k = 0; k < colsA; k++) {
					M[i][j] += A[i][k] * B[k][j];
				}
			}
		}
		
		return M;
	}
};
dEdit.vMult = function(v,d) {
	var y = new Array(v.length);
	for(var i = 0; i < v.length; i++) {
		y[i] = v[i] * d;
	}
	return y;
};
dEdit.vAdd = function(a,b) {
	if(a.length===b.length) {
		var c = new Array(a.length);
		for(var i = 0; i < a.length; i++) {
			c[i] = a[i] + b[i];
		}
		return c;
	}
};

console.log("DirectEdit vector math loaded");

/* Selectable functions
   This is a really weird implementation, might redo it later
   At least it's extensible!
   
   Detailed comments on the first one
*/

dEdit.brushOps = {
	// This object is a "type" of operation from which instances may be derived
	centerReflect: {
		// Name of this op in the Select box
		name: "Reflect through center",
		
		// Which fields should be visible when constructing the op
		// This is the jankiest part right here
		activeFields: {
			vector: false,
			relative: false,
			absolute: false,
			angle: false
		},
		
		// This function constructs the actual function which acts on brushes
		// It is called when all necessary fields have been set
		getOp: function(fields) {
			
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
			
			// This function is used to create a representative JS object
			op.getWritable = function() {
				var obj = {};
				obj.name = "centerReflect";
				obj.fields = {};
			};
			
			return op;
		}
	},
	
	rotate: {
		name: "Rotate about axis",
		activeFields: {
			vector: true,
			relative: false,
			absolute: false,
			angle: true
		},
		getOp: function(fields) {
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
				
				return cl;
			};
			
			op.getWritable = function() {
				var obj = {};
				obj.name = "rotate";
				obj.fields = {vector: op.axis, angle: op.angle};
			};
			
			return op;
		}
	},
	
	planeReflect: {
		name: "Reflect through plane",
		activeFields: {
			vector: true,
			relative: false,
			absolute: false,
			angle: false
		},
		getOp: function(fields) {
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
			
			op.getWritable = function() {
				var obj = {};
				obj.name = "planeReflect";
				obj.fields = {vector: op.planeVector};
			};
			
			return op;
		}
	},
	
	multiplyScale: {
		name: "Multiply brush scale",
		activeFields: {
			vector: false,
			relative: true,
			absolute: false,
			angle: false
		},
		getOp: function(fields) {
			var op = {};
			op.factor = fields.relative;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.scale = dEdit.vMult(cl.scale,op.factor);
				return cl;
			};
			
			op.getWritable = function() {
				var obj = {};
				obj.name = "multiplyScale";
				obj.fields = {relative: op.factor};
			};
			
			return op;
		}
	},
	
	addElevation: {
		name: "Add elevation",
		activeFields: {
			vector: false,
			relative: false,
			absolute: true,
			angle: false
		},
		getOp: function(fields) {
			var op = {};
			op.delta = fields.absolute;
			
			op.applyTo = function(brushSpec) {
				var cl = _.cloneDeep(brushSpec);
				cl.height += delta;
				return cl;
			};
			
			op.getWritable = function() {
				var obj = {};
				obj.name = "addElevation";
				obj.fields = {absolute: op.delta};
			};
			
			return op;
		}
	}
}

// List of objects used to populate a Select box
model.dEdit.brushOpsArray = [	dEdit.brushOps.centerReflect,
								dEdit.brushOps.rotate,
								dEdit.brushOps.planeReflect,
								dEdit.brushOps.multiplyScale,
								dEdit.brushOps.addElevation ];

// If you want to define a new brush op, just add an object with the right structure to this array

console.log("DirectEdit brush operations loaded");