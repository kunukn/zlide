'use strict';

const rAF = window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : callback => setTimeout(callback, 0);

const TRANSITION_END = 'transitionend';
const AEL = 'addEventListener';
const REL = 'removeEventListener';
const BCR = 'getBoundingClientRect';
const qs = (expr, context) => (context || document).querySelector(expr);
const qsa = (expr, context) =>
  [].slice.call((context || document).querySelectorAll(expr), 0);

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
  const { element, doneCallback } = parseProps(props);

  element.classList.add('zlide-inert');
  element.setAttribute('inert', '');
  element.style.maxHeight = '0px';
  if (doneCallback) {
    doneCallback({ type: 'collapsed' });
  }

  return this;
}

function setToExpanded(props) {
  const { element, doneCallback } = parseProps(props);

  element.style.display = '';
  element.style.maxHeight = '';
  element.removeAttribute('inert');
  if (doneCallback) {
    doneCallback({ type: 'expanded' });
  }

  return this;
}

function collapse(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);

  if (beforeCallback) {
    beforeCallback({ type: 'collapsing' });
  }

  const rect = element[BCR]();

  if (rect.height === 0) {
    setToCollapsed({ element, doneCallback });
    return this;
  }

  const elTransitionBackup = element.style.transition;
  element.style.transition = 'max-height 0s !important';

  const transitionEvent = event => {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToCollapsed({ element, doneCallback });
    }
  };

  rAF(() => {
    element.style.maxHeight = `${rect.height}px`;
    element.style.transition = elTransitionBackup;
    element[AEL](TRANSITION_END, transitionEvent);
    rAF(() => {
      element.style.maxHeight = '0px';
    });
  });

  return this;
}

function expand(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);

  if (beforeCallback) {
    beforeCallback({ type: 'expanding' });
  }
  element.classList.remove('zlide-inert');

  const transitionEvent = event => {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element, doneCallback });
    }
  };

  const elTransitionBackup = element.style.transition;
  element.style.transition = 'max-height 0s !important';
  element.style.maxHeight = '';

  element.addEventListener(TRANSITION_END, transitionEvent);
  rAF(() => {
    /*
      Same level of nested rAF as collapse to synchronize timing of animation.
    */
    const rect = element[BCR]();
    element.style.transition = elTransitionBackup;
    element.style.maxHeight = '0px';

    rAF(() => {
      element.style.maxHeight = `${rect.height}px`;
    });
  });
}

function toggle(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);
  if (element.style.maxHeight === '0px') {
    expand({ element, beforeCallback, doneCallback });
  } else {
    collapse({ element, beforeCallback, doneCallback });
  }
  return this;
}

function applyDefaultStyleSheet() {
  if (!qs('#zlide-stylesheet')) {
    const sheet = document.createElement('style');
    sheet.setAttribute('id', 'zlide-stylesheet');
    sheet.innerHTML = `
      .zlide-inert{display:none !important;}
    `;
    document.head.appendChild(sheet);
  }
  return this;
}

const zlide = () => {};

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
zlide.VERSION = '0.0.8';

module.exports = zlide;
