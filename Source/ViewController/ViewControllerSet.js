/*
---

name: ViewControllerSet

description: Manages a view set.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerSet

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewControllerSet = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_tabBar: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_selectedViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_incomingViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	loadView: function() {
		this.view = new Moobile.ViewSet();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidLoad: function() {
		this.parent();
		this._tabBar = this.view.getTabBar();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllers: function(viewControllers) {

		this._selectedViewController = null;
		this._incomingViewController = null;
		this.removeAllChildViewControllers(true);

		for (var i = 0; i < viewControllers.length; i++) this.addChildViewController(viewControllers[i]);

		return this.setSelectedViewController(viewControllers[0])
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setSelectedViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		if (this._selectedViewController === null) {
			this.willSelectViewController(viewController);
			this._selectedViewController = viewController;
			this._selectedViewController.viewWillEnter();
			this._selectedViewController.showView();
			this._selectedViewController.viewDidEnter();
			this.didSelectViewController(viewController);
			return this;
		}

		if (this._selectedViewController === viewController)
			return this;

		this._upcomingViewController = viewController;

		var upcomingViewIndex = this.getChildViewControllerIndex(this._upcomingViewController);
		var selectedViewindex = this.getChildViewControllerIndex(this._selectedViewController);

		var method = upcomingViewIndex > selectedViewindex
		           ? 'enter'
		           : 'leave';

		var viewToShow = this._upcomingViewController.getView();
		var viewToHide = this._selectedViewController.getView();

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onSelectTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onSelectTransitionComplete'));
		viewTransition[method].call(
			viewTransition,
			viewToShow,
			viewToHide,
			this.view
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setSelectedViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedViewControllerIndex: function(index, viewTransition) {

		var viewController = this.getChildViewControllerAt(index);
		if (viewController) {
			this.setSelectedViewController(viewController, viewTransition)
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#getSelectedViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedViewController: function() {
		return this._selectedViewController;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionStart: function(e) {
		this.willSelectViewController(this._upcomingViewController);
		this._selectedViewController.viewWillLeave();
		this._upcomingViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionComplete: function(e) {

		this._selectedViewController.viewDidLeave();
		this._upcomingViewController.viewDidEnter();
		this.didSelectViewController(this._upcomingViewController);

		this._selectedViewController = this._upcomingViewController;
		this._upcomingViewController = null;
		this._animating = false;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerSet(this);
		viewController.getView().hide();
		this._tabBar.addChildComponent(new Moobile.Button().setLabel(viewController.getTitle()));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerSet(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#willSelectViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willSelectViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#didSelectViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didSelectViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_viewControllerSet: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllerSet: function(viewControllerSet) {

		if (this._viewControllerSet === viewControllerSet)
			return this;

		this.parentViewControllerSetWillChange(viewControllerSet);
		this._viewControllerSet = viewControllerSet;
		this.parentViewControllerSetDidChange(viewControllerSet);

		if (this instanceof Moobile.ViewControllerSet)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerSet);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerSet', viewControllerSet);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#getViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getViewControllerSet: function() {
		return this._viewControllerSet;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#parentViewControllerSetWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#parentViewControllerSetDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(this._viewControllerStack);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(null);
	}

});