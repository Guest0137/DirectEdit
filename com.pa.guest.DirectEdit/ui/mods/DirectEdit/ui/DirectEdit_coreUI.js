
/* ==================== Miscellaneous UI stuff ==================== */

model.dEdit.opChar = function(str) {
	if		(str === "BO_Add") 		{return "+";}
	else if	(str === "BO_Subtract") {return "-";}
	else 							{return "?";}
};

model.dEdit.brushDetail = {};

model.dEdit.brushDetail.active = ko.observable(false);

model.dEdit.brushDetail.show = function() {
	model.dEdit.brushDetail.active(true);
};
model.dEdit.brushDetail.hide = function() {
	model.dEdit.brushDetail.active(false);
};

/* ==================== Brush operation UI ==================== */

model.dEdit.currentBrushFunction = {
	type: ko.observable(dEdit.brushFunctions.centerReflect),
	vector: [ko.observable(),ko.observable(),ko.observable()],
	relative: ko.observable(),
	absolute: ko.observable(),
	angle: ko.observable()
};

model.dEdit.currentBrushFunction.isValid = ko.computed(function() {
	var active = model.dEdit.currentBrushFunction.type().activeFields;
	
	// TODO make sure a brush is selected
	
	return( (!active.vector || ($.isNumeric(model.dEdit.currentBrushFunction.vector[0]()) && $.isNumeric(model.dEdit.currentBrushFunction.vector[1]()) &&	$.isNumeric(model.dEdit.currentBrushFunction.vector[2]())) ) &&
			(!active.relative || ($.isNumeric(model.dEdit.currentBrushFunction.relative())) ) &&
			(!active.absolute || ($.isNumeric(model.dEdit.currentBrushFunction.absolute())) ) &&
			(!active.angle || ($.isNumeric(model.dEdit.currentBrushFunction.angle())) )
		);
});

dEdit.getCurrentBrushFunction = function() {
	var c = model.dEdit.currentBrushFunction;
	if(c.isValid()) {
		return c.type().getFunction( {
			vector: [c.vector[0](), c.vector[1](), c.vector[2]()],
			relative: c.relative(),
			absolute: c.absolute(),
			angle: dEdit.degToRad(c.angle())
		} );
	}
	else {
		throw "Function not valid";
	}
};

console.log("[DirectEdit] Core UI components loaded");
