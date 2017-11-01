const rAF = window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : callback => setTimeout(callback, 0);

const log = console.log.bind(console);
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
  const { element, doneCallback } = parseProps(props);

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
  const { element, beforeCallback, doneCallback } = parseProps(props);

  if (beforeCallback) {
    beforeCallback({ type: 'collapsing' });
  }

  element.classList.remove('zlide-expanded');
  element.classList.add('zlide-collapsing');
  const { height } = element[BCR]();

  if (height === 0) {
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
    element.style.maxHeight = `${height}px`;
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
  element.classList.remove('zlide-collapsed');
  element.classList.add('zlide-expanding');

  const transitionEvent = event => {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element, doneCallback });
    }
  };

  const elTransitionBackup = element.style.transition;
  element.style.transition = 'max-height 0s !important';
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.maxHeight = '';
  const { height } = element[BCR]();
  element.style.transition = elTransitionBackup;
  element.style.maxHeight = '0px';

  rAF(() => {
    /*
      Same level of nested rAF as collapse to synchronize timing of animation.
    */
    element[AEL](TRANSITION_END, transitionEvent);
    element.style.position = '';
    element.style.visibility = '';

    rAF(() => {
      element.style.maxHeight = `${height}px`;
    });
  });
}

function toggle(props) {
  const { element, beforeCallback, doneCallback } = parseProps(props);
  if (element.classList.contains('zlide-collapsed')) {
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
zlide.VERSION = '0.0.9';

export default zlide;
