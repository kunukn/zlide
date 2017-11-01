(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.zlide = factory());
}(this, (function () { 'use strict';

var rAF = window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : function (callback) { return setTimeout(callback, 0); };

var log = console.log.bind(console);
var TRANSITION_END = 'transitionend';
var AEL = 'addEventListener';
var REL = 'removeEventListener';
var BCR = 'getBoundingClientRect';
var qs = function (expr, context) { return (context || document).querySelector(expr); };
var qsa = function (expr, context) { return [].slice.call((context || document).querySelectorAll(expr), 0); };

function parseProps(props) {
  if (typeof props === 'string') {
    return { element: qs(props) };
  } else if (props instanceof Element) {
    return { element: props };
  } else if (typeof props === 'function') {
    return parseProps(props());
  }
  return props || {};
}

function setToCollapsed(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var doneCallback = ref.doneCallback;

  element.classList.add('zlide-inert');
  element.classList.remove('zlide-collapsing');
  element.classList.remove('zlide-expanded');
  element.classList.add('zlide-collapsed');
  element.style.maxHeight = '0px';
  if (doneCallback) {
    doneCallback({ type: 'collapsed' });
  }

  return this;
}

function setToExpanded(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var doneCallback = ref.doneCallback;

  element.style.maxHeight = '';
  element.classList.remove('zlide-inert');
  element.classList.remove('zlide-collapsed');
  element.classList.remove('zlide-expanding');
  element.classList.add('zlide-expanded');
  if (doneCallback) {
    doneCallback({ type: 'expanded' });
  }

  return this;
}

function collapse(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var beforeCallback = ref.beforeCallback;
  var doneCallback = ref.doneCallback;

  if (beforeCallback) {
    beforeCallback({ type: 'collapsing' });
  }

  element.classList.remove('zlide-expanded');
  element.classList.add('zlide-collapsing');
  var ref$1 = element[BCR]();
  var height = ref$1.height;

  if (height === 0) {
    setToCollapsed({ element: element, doneCallback: doneCallback });
    return this;
  }

  var elTransitionBackup = element.style.transition;
  element.style.transition = 'max-height 0s !important';

  var transitionEvent = function (event) {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToCollapsed({ element: element, doneCallback: doneCallback });
    }
  };

  rAF(function () {
    element.style.maxHeight = height + "px";
    element.style.transition = elTransitionBackup;
    element[AEL](TRANSITION_END, transitionEvent);
    rAF(function () {
      element.style.maxHeight = '0px';
    });
  });

  return this;
}

function expand(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var beforeCallback = ref.beforeCallback;
  var doneCallback = ref.doneCallback;

  if (beforeCallback) {
    beforeCallback({ type: 'expanding' });
  }

  element.classList.remove('zlide-inert');
  element.classList.remove('zlide-collapsed');
  element.classList.add('zlide-expanding');

  var transitionEvent = function (event) {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element: element, doneCallback: doneCallback });
    }
  };

  var elTransitionBackup = element.style.transition;
  element.style.transition = 'max-height 0s !important';
  element.style.maxHeight = '';
  var ref$1 = element[BCR]();
  var height = ref$1.height;
  element.style.transition = elTransitionBackup;
  element.style.maxHeight = '0px';

  rAF(function () {
    /*
      Same level of nested rAF as collapse to synchronize timing of animation.
    */
    element[AEL](TRANSITION_END, transitionEvent);

    rAF(function () {
      element.style.maxHeight = height + "px";
    });
  });
}

function toggle(props) {
  var ref = parseProps(props);
  var element = ref.element;
  var beforeCallback = ref.beforeCallback;
  var doneCallback = ref.doneCallback;
  if (element.classList.contains('zlide-collapsed')) {
    expand({ element: element, beforeCallback: beforeCallback, doneCallback: doneCallback });
  } else {
    collapse({ element: element, beforeCallback: beforeCallback, doneCallback: doneCallback });
  }
  return this;
}

function applyDefaultStyleSheet() {
  if (!qs('#zlide-stylesheet')) {
    var sheet = document.createElement('style');
    sheet.setAttribute('id', 'zlide-stylesheet');
    sheet.innerHTML = "\n      .zlide-inert{display:none !important;}\n    ";
    document.head.appendChild(sheet);
  }
  return this;
}

var zlide = function () {};

zlide.toggle = toggle;
zlide.collapse = collapse;
zlide.up = collapse;
zlide.expand = expand;
zlide.down = expand;
zlide.setToCollapsed = setToCollapsed;
zlide.setToExpanded = setToExpanded;
zlide.applyDefaultStyleSheet = applyDefaultStyleSheet;
zlide.rAF = rAF;
zlide.qs = qs;
zlide.qsa = qsa;
zlide.VERSION = '0.0.9';

return zlide;

})));
