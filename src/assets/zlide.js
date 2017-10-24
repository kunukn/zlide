const rAF =
  window.requestAnimationFrame || (callback => setTimeout(callback, 0));

const TRANSITION_END = 'transitionend';
const AEL = 'addEventListener';
const REL = 'removeEventListener';

function parseProps(props) {
  if (typeof props === 'function') {
    return { element: props() };
  } else if (typeof props === 'string') {
    return { element: document.querySelector(props) };
  }
  return props || {};
}

function setToCollapsed(props) {
  const { element, doneCallback } = parseProps(props);

  const el = element;
  el.classList.add('zlide-inert');
  el.setAttribute('inert', '');
  el.style.maxHeight = '0px';
  if (doneCallback) {
    doneCallback({ type: 'collapsed' });
  }
}

function setToExpanded(props) {
  const { element, doneCallback } = parseProps(props);

  const el = element;
  el.style.display = '';
  el.style.maxHeight = '';
  element.removeAttribute('inert');
  if (doneCallback) {
    doneCallback({ type: 'expanded' });
  }
}

function collapse(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);

  if (beforeCallback) {
    beforeCallback({ type: 'collapsing' });
  }
  const el = element;
  const height = element.scrollHeight;
  const elTransitionBackup = element.style.transition;
  el.style.transition = 'max-height 0s !important';
  const transitionEvent = event => {
    if (event.propertyName === 'max-height') {
      el[REL](TRANSITION_END, transitionEvent);
      setToCollapsed({ element: el, doneCallback });
    }
  };

  rAF(() => {
    el.style.maxHeight = `${height}px`;
    el.style.transition = elTransitionBackup;
    el[AEL](TRANSITION_END, transitionEvent);
    rAF(() => {
      el.style.maxHeight = '0px';
    });
  });
}

function expand(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);

  if (beforeCallback) {
    beforeCallback({ type: 'expanding' });
  }
  const el = element;
  el.classList.remove('zlide-inert');

  const transitionEvent = event => {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element: el, doneCallback });
    }
  };

  element.addEventListener(TRANSITION_END, transitionEvent);
  rAF(() => {
    /* Same level of nested rAF as collapse to synchronize timing of animation.
     The extra rAF can be removed, but looks bad if used to build an
     accordion component. */
    rAF(() => {
      el.style.maxHeight = `${element.scrollHeight}px`;
    });
  });
}

function toggle(props) {
  const { element, beforeCallback, doneCallback } = props;
  if (element.style.maxHeight === '0px') {
    expand({ element, beforeCallback, doneCallback });
  } else {
    collapse({ element, beforeCallback, doneCallback });
  }
}

const zlide = () => {};

zlide.toggle = toggle;
zlide.collapse = collapse;
zlide.up = collapse;
zlide.expand = expand;
zlide.down = expand;
zlide.setToCollapsed = setToCollapsed;
zlide.setToExpanded = setToExpanded;

module.exports = zlide;
