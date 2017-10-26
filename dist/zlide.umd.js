(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.zlide = factory());
}(this, (function () { 'use strict';

var rAF =
  window.requestAnimationFrame || (function (callback) { return setTimeout(callback, 0); });

var TRANSITION_END = 'transitionend';
var AEL = 'addEventListener';
var REL = 'removeEventListener';

function parseProps(props) {
  if (typeof props === 'function') {
    return { element: props() };
  } else if (typeof props === 'string') {
    return { element: document.querySelector(props) };
  }
  return props || {};
}

function setToCollapsed(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var doneCallback = ref.doneCallback;

  var el = element;
  el.classList.add('zlide-inert');
  el.setAttribute('inert', '');
  el.style.maxHeight = '0px';
  if (doneCallback) {
    doneCallback({ type: 'collapsed' });
  }
}

function setToExpanded(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var doneCallback = ref.doneCallback;

  var el = element;
  el.style.display = '';
  el.style.maxHeight = '';
  element.removeAttribute('inert');
  if (doneCallback) {
    doneCallback({ type: 'expanded' });
  }
}

function collapse(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var beforeCallback = ref.beforeCallback;
  var doneCallback = ref.doneCallback;

  if (beforeCallback) {
    beforeCallback({ type: 'collapsing' });
  }
  var el = element;
  var height = element.scrollHeight;
  var elTransitionBackup = element.style.transition;
  el.style.transition = 'max-height 0s !important';
  var transitionEvent = function (event) {
    if (event.propertyName === 'max-height') {
      el[REL](TRANSITION_END, transitionEvent);
      setToCollapsed({ element: el, doneCallback: doneCallback });
    }
  };

  rAF(function () {
    el.style.maxHeight = height + "px";
    el.style.transition = elTransitionBackup;
    el[AEL](TRANSITION_END, transitionEvent);
    rAF(function () {
      el.style.maxHeight = '0px';
    });
  });
}

function expand(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var beforeCallback = ref.beforeCallback;
  var doneCallback = ref.doneCallback;

  if (beforeCallback) {
    beforeCallback({ type: 'expanding' });
  }
  var el = element;
  el.classList.remove('zlide-inert');

  var transitionEvent = function (event) {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element: el, doneCallback: doneCallback });
    }
  };

  element.addEventListener(TRANSITION_END, transitionEvent);
  rAF(function () {
    /* Same level of nested rAF as collapse to synchronize timing of animation.
     The extra rAF can be removed, but looks bad if used to build an
     accordion component. */
    rAF(function () {
      el.style.maxHeight = (element.scrollHeight) + "px";
    });
  });
}

function toggle(props) {
  var element = props.element;
  var beforeCallback = props.beforeCallback;
  var doneCallback = props.doneCallback;
  if (element.style.maxHeight === '0px') {
    expand({ element: element, beforeCallback: beforeCallback, doneCallback: doneCallback });
  } else {
    collapse({ element: element, beforeCallback: beforeCallback, doneCallback: doneCallback });
  }
}

var zlide = function () {};

zlide.toggle = toggle;
zlide.collapse = collapse;
zlide.up = collapse;
zlide.expand = expand;
zlide.down = expand;
zlide.setToCollapsed = setToCollapsed;
zlide.setToExpanded = setToExpanded;


//module.exports = zlide;

return zlide;

})));
