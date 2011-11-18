/*
---

name: ViewPanel

description: Provides the view used in a ViewControllerPanel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewPanel

...
*/

Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	sidePanel: null,

	mainPanel: null,

	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	getMainPanel: function() {
		return this.content.getMainPanel();
	},
	
	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-panel');
		}
	},

	willUnload: function() {
		this.sidePanel = null;
		this.mainPanel = null;	
		this.parent();		
	}	

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.ViewPanel, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewPanelContent, element, null, name);
	if (instance instanceof Moobile.ViewPanelContent) {
		this.addChild(instance);
		this.content = instance;
	}

	return instance;
});

