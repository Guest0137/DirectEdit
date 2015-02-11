
/* ==================== Math functions necessary for various stuff ==================== */

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

console.log("[DirectEdit] Vector math loaded");