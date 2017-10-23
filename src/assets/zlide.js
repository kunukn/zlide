const rAF =
  window.requestAnimationFrame || (callback => setTimeout(callback, 0));

const TRANSITION_END = 'transitionend';
const AEL = 'addEventListener';
const REL = 'removeEventListener';

function setToCollapsed({ element, doneCallback }) {
  const el = element;
  el.style.display = 'none'; // inert
  el.setAttribute('inert', '');
  el.style.maxHeight = '0px';
  if (doneCallback) {
    doneCallback({ element: el });
  }
}

function setToExpanded({ element, doneCallback }) {
  const el = element;
  el.style.display = '';
  el.style.maxHeight = '';
  element.removeAttribute('inert');
  if (doneCallback) {
    doneCallback({ element: el });
  }
}

function collapse({ element, doneCallback }) {
  const el = element;
  const height = element.scrollHeight;
  const elTransitionBackup = element.style.transition;
  el.style.transition = 'max-height 0s !important';
  const transitionEvent = (event) => {
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

function expand({ element, doneCallback }) {
  const el = element;
  el.style.display = '';

  const transitionEvent = (event) => {
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

function toggle({ element, doneCallback }) {
  if (element.style.maxHeight === '0px') {
    expand({ element, doneCallback });
  } else {
    collapse({ element, doneCallback });
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
