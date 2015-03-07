dEdit.TabController = function(tabLabels) {
	var self = this;
	
	self.tabs = ko.observableArray();
	self.selectedTab = ko.observable();
	
	for(var i = 0; i < tabLabels.length; i++) {
		self.tabs.push(new dEdit.Tab(tabLabels[i]));
	}
	
	self.selectTab = function(tab) {
		if(typeof self.selectedTab() !== "undefined") {
			self.selectedTab().isSelected(false);
		}
		self.selectedTab(tab);
		tab.isSelected(true);
	}
	
	if(self.tabs().length > 0) {
		self.selectTab(self.tabs()[0]);
	}
}

dEdit.Tab = function(label) {
	this.isSelected = ko.observable(false);
	this.label = label;
}