describe('Component/Component', function() {

	var MyComponent = new Class({
		Extends: Moobile.Component
	});

	// initialize

	it('should create a component with a div element from a string', function() {
		var c = new Moobile.Component('<div></div>');
		expect(c.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element from an element', function() {
		var c = new Moobile.Component(new Element('div'));
		expect(c.getElement().get('tag')).toEqual('div');
	});

	it('should create a component with a div element by default', function() {
		var c = new Moobile.Component();
		expect(c.getElement().get('tag')).toEqual('div');
	});

	it('should read string options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="foo"></div>');
		expect(c.options.styleName).toEqual('foo');
	});

	it('should read numeric options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="1"></div>');
		expect(c.options.styleName).toEqual(1);
	});

	it('should read boolean options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="true"></div>');
		expect(c.options.styleName).toEqual(true);
	});

	it('should read array options using data-attribute', function() {
		var c = new Moobile.Component('<div data-option-style-name="[1]"></div>');
		expect(c.options.styleName).toContain(1);
	});

	// addEvent, removeEvent

	it('should handler events handler properly', function() {
		var c  = new Moobile.Component();
		var f1 = function(){};
		var f2 = function(){};
		var f3 = function(){};
		spyOn(c.element, 'addEvent');
		spyOn(c.element, 'removeEvent');
		c.addEvent('tap', f1);
		c.addEvent('tap', f2);
		c.addEvent('tap', f3);
		c.removeEvent('tap', f1);
		c.removeEvent('tap', f2);
		c.removeEvent('tap', f3);
		expect(c.element.addEvent).toHaveBeenCalled();
		expect(c.element.addEvent.calls.length).toEqual(1);
		expect(c.element.removeEvent).toHaveBeenCalled();
		expect(c.element.removeEvent.calls.length).toEqual(1);
	});

	// addChildComponent

	it('should add a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		spyOn(p, 'willAddChildComponent');
		spyOn(p, 'didAddChildComponent');
		p.addChildComponent(c1);
		expect(p.getChildComponents()[0]).toEqual(c1);
		expect(p.willAddChildComponent).toHaveBeenCalledWith(c1);
		expect(p.didAddChildComponent).toHaveBeenCalledWith(c1)
	});

	it('should add a child at the top', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2, 'top');
		expect(p.getChildComponentAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	it('should add a child at the bottom', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2, 'bottom');
		expect(p.getChildComponentAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	it('should properly manage component indexes', function() {
		var p = new Moobile.Component(
			'<div>' +
				'<div data-role="button" data-name="b1">B1</div>' +
					'<div>' +
						'<div data-role="button" data-name="b2">B2</div>' +
					'</div>' +
				'<div data-role="button" data-name="b3">B1</div>' +
			'</div>'
		);
		var b1 = p.getChildComponent('b1');
		var b2 = p.getChildComponent('b2');
		var b3 = p.getChildComponent('b3');
		expect(p.getChildComponentIndex(b1)).toEqual(0);
		expect(p.getChildComponentIndex(b2)).toEqual(1);
		expect(p.getChildComponentIndex(b3)).toEqual(2);
		var b4 = new Moobile.Button();
		p.addChildComponentAfter(b4, b2);
		expect(p.getChildComponentIndex(b1)).toEqual(0);
		expect(p.getChildComponentIndex(b2)).toEqual(1);
		expect(p.getChildComponentIndex(b3)).toEqual(3);
		expect(p.getChildComponentIndex(b4)).toEqual(2);
	});

	// addChildComponentInside

	it('should add a child inside an element', function() {
		var p  = new Moobile.Component('<div><div class="me"></div>');
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentInside(c2, '.me');
		expect(c2.getElement().getParent().get('class')).toEqual('me');
	});

	// addChildComponentAfter

	it('should add a child after another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentAfter(c2, c1);
		expect(p.getChildComponentAt(1)).toEqual(c2);
		expect(p.getElements()[1]).toEqual(c2.getElement());
	});

	// addChildComponentBefore

	it('should add a child before another component', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponentBefore(c2, c1);
		expect(p.getChildComponentAt(0)).toEqual(c2);
		expect(p.getElements()[0]).toEqual(c2.getElement());
	});

	// getChildComponent

	it('should find a child using its name', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		p.addChildComponent(c1);
		expect(p.getChildComponent('me')).toEqual(c1);
	});

	// getChildComponentOfType

	it('should find a child of a given type using its name', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component(null, null, 'me');
		var c2 = new MyComponent(null, null, 'me');
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		expect(p.getChildComponentOfType(MyComponent, 'me')).toEqual(c2);
	});

	// getChildComponentAt

	it('should find a child using its index', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.getChildComponentAt(0)).toEqual(c1);
	});

	// getChildComponentOfTypeAt

	it('should find a child of a given type using its index', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		expect(p.getChildComponentOfTypeAt(MyComponent, 0)).toEqual(c2);
	});

	// getChildComponentIndex

	it('should find the index of a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.getChildComponentIndex(c1)).toEqual(0);
	});

	// getChildComponents

	it('should return all children', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		var children = p.getChildComponents();
		expect(children[0]).toEqual(c1);
		expect(children[1]).toEqual(c2);
	});

	// getChildComponentsOfType

	it('should return all children of a given type', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.addChildComponent(c3);
		var children = p.getChildComponentsOfType(MyComponent);
		expect(children[0]).toEqual(c3);
	});

	// hasChildComponent

	it('should know if a child exists', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		expect(p.hasChildComponent(c1)).toEqual(true);
	});

	// hasChildComponentOfType

	it('should know if a child of a given type exists', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		expect(p.hasChildComponentOfType(MyComponent)).toEqual(true);
	});

	// getDescendantComponent

	it('should find a descendant using its name', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component(null, null, 'me');
		p.addChildComponent(c1);
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);
		expect(p.getDescendantComponent('me')).toEqual(c3);
	});

	// replaceChildComponent

	it('should replace a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.replaceChildComponent(c1, c2);
		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

 	// replaceWithComponent

	it('should a child be replaced with another', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		c1.replaceWithComponent(c2);
		expect(p.getChildComponentAt(0)).toEqual(c2);
	});

	// removeChildComponent

	it('should remove a child', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		spyOn(p, 'willRemoveChildComponent');
		spyOn(p, 'didRemoveChildComponent');
		p.removeChildComponent(c1);
		expect(p.getChildComponentAt(0)).toEqual(null);
		expect(p.willRemoveChildComponent).toHaveBeenCalledWith(c1);
		expect(p.didRemoveChildComponent).toHaveBeenCalledWith(c1);
	});

	// removeAllChildComponents

	it('should remove all children', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponents();
		expect(p.getChildComponents().length).toEqual(0);
	});

 	// removeAllChildComponentsOfType

	it('should remove all children of a given type', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new MyComponent();
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.removeAllChildComponentsOfType(MyComponent);
		expect(p.getChildComponents().length).toEqual(1);
	});

	// removeFromParentComponent

	it('should remove itself', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		p.addChildComponent(c1);
		c1.removeFromParentComponent();
		expect(p.getChildComponents().length).toEqual(0);
	});

	// setParentComponent, getParentComponent, hasParentComponent

	it('should set the parent', function() {
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		spyOn(c1, 'parentComponentWillChange');
		spyOn(c1, 'parentComponentDidChange');
		c1.setParentComponent(p);
		expect(c1.getParentComponent()).toEqual(p);
		expect(c1.hasParentComponent()).toEqual(true);
		expect(c1.parentComponentWillChange).toHaveBeenCalledWith(p);
		expect(c1.parentComponentDidChange).toHaveBeenCalledWith(p);
	});

	// setWindow, getWindow, hasWindow

	it('should set the window through all child', function() {
		var w  = new Moobile.Window();
		var p  = new Moobile.Component();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		spyOn(c1, 'windowWillChange');
		spyOn(c1, 'windowDidChange');
		spyOn(c2, 'windowWillChange');
		spyOn(c2, 'windowDidChange');
		p.addChildComponent(c1);
		p.addChildComponent(c2);
		p.setWindow(w);
		expect(p.getWindow()).toEqual(w);
		expect(p.hasWindow()).toEqual(true);
		expect(c1.getWindow()).toEqual(w);
		expect(c2.getWindow()).toEqual(w);
		expect(c1.windowWillChange).toHaveBeenCalledWith(w);
		expect(c1.windowDidChange).toHaveBeenCalledWith(w);
		expect(c2.windowWillChange).toHaveBeenCalledWith(w);
		expect(c2.windowDidChange).toHaveBeenCalledWith(w);
	});

	// setReady, isReady

	it('should handle the ready flag through all child', function() {
		var w = new Moobile.Window();
		var c1 = new Moobile.Component();
		var c2 = new Moobile.Component();
		var c3 = new Moobile.Component();
		spyOn(c1, 'didBecomeReady');
		spyOn(c2, 'didBecomeReady');
		spyOn(c3, 'didBecomeReady');
		c1.addChildComponent(c2);
		c2.addChildComponent(c3);
		w.addChildComponent(c1);
		expect(c1.didBecomeReady).toHaveBeenCalled();
		expect(c2.didBecomeReady).toHaveBeenCalled();
		expect(c3.didBecomeReady).toHaveBeenCalled();
		expect(c1.didBecomeReady.calls.length).toEqual(1);
		expect(c2.didBecomeReady.calls.length).toEqual(1);
		expect(c3.didBecomeReady.calls.length).toEqual(1);
		expect(c1.isReady()).toEqual(true);
		expect(c2.isReady()).toEqual(true);
		expect(c3.isReady()).toEqual(true);
	});

	// getName

	it('should return the name', function() {
		var c = new Moobile.Component(null, null, 'foo');
		expect(c.getName()).toEqual('foo');
	});

	// setStyle, getStyle

	it('should set the style', function() {
		var attached = false;
		var detached = false;
		Moobile.Component.defineStyle('test', null, {
			attach: function() { attached = true; },
			detach: function() { detached = true; }
		});
		var c = new Moobile.Component();
		c.setStyle('test');
		c.setStyle(null);
		expect(attached).toEqual(true);
		expect(detached).toEqual(true);
		c.setStyle('test');
		expect(c.getStyle()).toEqual('test');
	});

	// addClass

	it('should add a CSS class name to the component element', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	// removeClass

	it('should remove a CSS class name', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.removeClass('foo');
		expect(c.hasClass('foo')).toEqual(false);
	});

	// toggleClass

	it('should add a CSS class name if not existent', function() {
		var c = new Moobile.Component();
		c.toggleClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	it('should remove a CSS class name if existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo');
		expect(c.hasClass('foo')).toEqual(false);
	});

	it('should force add a CSS class name if not existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo', true);
		expect(c.hasClass('foo')).toEqual(true);
	});

	it('should force remove a CSS class name if existent', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		c.toggleClass('foo', false);
		expect(c.hasClass('foo')).toEqual(false);
	});

	// hasClass

	it('should indicate whether a CSS class', function() {
		var c = new Moobile.Component();
		c.addClass('foo');
		expect(c.hasClass('foo')).toEqual(true);
	});

	// getElement

	it('should return the component element or an element from a selector', function() {
		var c = new Moobile.Component('<div><p></p></div>');
		expect(c.getElement().get('tag')).toEqual('div');
		expect(c.getElement('p').get('tag')).toEqual('p');
	});

	it('should return the component elements or elements that matches a selector', function() {
		var c = new Moobile.Component('<div><p></p><p></p><div></div></div>');
		expect(c.getElements().length).toEqual(3);
		expect(c.getElements('p').length).toEqual(2);
	});

	// hasElement

	it('should know if an element exists', function() {
		var d = new Element('div');
		var s = new Element('span').inject(d);
		var c = new Moobile.Component(d);
		expect(c.hasElement(s)).toEqual(true);
	});

	// getRoleElement

	it('should return the component elements or elements that matches a selector', function() {
		Moobile.Component.defineRole('test-element', null, null, function(){});
		Moobile.Component.defineRole('test-content', null, null, function(){});
		Moobile.Component.defineRole('test-wrapper', null, {traversable:true}, function(){});
		var CustomComponent = new Class({
			Extends: Moobile.Component,
			willBuild: function() {
				expect(this.getRoleElement('test-element')).toBeNull();
				expect(this.getRoleElement('test-wrapper')).not.toBeNull();
				expect(this.getRoleElement('test-content')).not.toBeNull();
			}
		});
		new CustomComponent(
			'<div>' +
				'<div data-role="test-wrapper">' +
					'<div data-role="test-content">' +
						'<div data-role="test-element"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
	});

	// TODO: Test Size
	// TODO: Test Position
	// TODO: Test visibility

});