/*
---

name: ViewControllerStack

description: Manages a view stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerStack

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_animating: false,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#pushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	pushViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		if (this.getTopViewController() === viewController)
			return this;

		var childViewControllers = this.getChildViewControllers();

		viewController.removeFromParentViewController();
		viewController.setViewControllerStack(this);
		this.willPushViewController(viewController);
		this.addChildViewController(viewController);

		var viewControllerPushed = viewController;
		var viewControllerBefore = childViewControllers.lastItemAt(1);

		var viewToShow = viewControllerPushed.getView();
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.getView()
					   : null;

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			childViewControllers.length === 1
		);

		this._animating = true;

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onPushTransitionStart: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.lastItemAt(0);
		var viewControllerBefore = childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onPushTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.lastItemAt(0);
		var viewControllerBefore = childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();

		this._animating = false;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#popViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	popViewController: function() {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerPopped = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);

		this.willPopViewController(viewControllerPopped);

		var viewTransition = viewControllerPopped.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.view,
			viewControllerPopped.view,
			this.view
		);

		this._animating = true;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#popViewControllerUntil
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	popViewControllerUntil: function(viewController) {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.getChildViewControllerIndex(viewController);
		if (viewControllerIndex > -1) {
			for (var i = childViewControllers.length - 2; i > viewControllerIndex; i--) {
				var viewControllerToRemove = this.getChildViewControllerAt(i);
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				viewControllerToRemove.removeFromParentViewController();
				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onPopTransitionStart: function(e) {
		var childViewControllers = this.getChildViewControllers();
		var viewControllerBefore = childViewControllers.lastItemAt(1);
		var viewControllerPopped = childViewControllers.lastItemAt(0);
		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onPopTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPopped = childViewControllers.lastItemAt(0);
		var viewControllerBefore = childViewControllers.lastItemAt(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();
		viewControllerPopped.removeFromParentViewController();

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;

		this._animating = false;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#getTopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTopViewController: function() {
		return this.getChildViewControllers().getLast();
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#willPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#didPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#willPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewControllerStack#didPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPopViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_viewControllerStack: null,

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setViewControllerStack: function(viewControllerStack) {
		this._viewControllerStack = viewControllerStack;
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewControllerStack: function() {
		return this._viewControllerStack;
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		if (viewController.getViewControllerStack() == null) {
			viewController.setViewControllerStack(this._viewControllerStack);
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(null);
	}

});
