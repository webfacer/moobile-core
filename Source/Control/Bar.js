/*
---

name: Bar

description: Provides a control that displays a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Bar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Bar = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('bar');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._item = null;
		this.parent();
	},

	// <0.2-compat>

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setItem: function(item) {

		console.log('[DEPRECATION NOTICE] The method "setItem" will be removed in 0.5, all the methods from the "BarItem" class were moved to "Bar" class');

		if (this._item === item)
			return this;

		if (this._item) {
			this._item.replaceWithComponent(item, true);
		} else {
			this.addChildComponentInside(item, this.contentElement);
		}

		this._item = item;
		this._item.addClass('bar-item');

		return this;
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function() {
		console.log('[DEPRECATION NOTICE] The method "getItem" will be removed in 0.5, all the methods from the "BarItem" class were moved to "Bar" class');
		return this._item;
	}

	// </0.2-compat>

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Component.defineStyle('light', Moobile.Bar, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});
