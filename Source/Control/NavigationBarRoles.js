/*
---

name: NavigationBarRoles

description: Provides the behavior for roles used in list item controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- NavigationBarRoles

...
*/

Moobile.NavigationBarRoles = {
	
	'bar-title': {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-title') || Moobile.BarTitle;
			return Class.instanciate(c, element, o, n);
		}
	},
	
	'bar-button-left': {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-left-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, element, o, n);
		}
	},
	
	'bar-button-right': {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-left-bar-button') || Moobile.BarButton;
			return Class.instanciate(c, element, o, n);
		}
	}	
	
};