const rAF =
  window.requestAnimationFrame || (callback => setTimeout(callback, 0));

const TRANSITION_END = 'transitionend';
const AEL = 'addEventListener';
const REL = 'removeEventListener';

function setToCollapsed({ element, callback }) {
  const el = element;
  el.style.display = 'none'; // inert
  el.setAttribute('inert', '');
  el.style.maxHeight = '0px';
  if (callback) {
    callback({ element: el });
  }
}

function setToExpanded({ element, callback }) {
  const el = element;
  el.style.display = '';
  el.style.maxHeight = '';
  element.removeAttribute('inert');
  if (callback) {
    callback({ element: el });
  }
}

function collapse({ element, callback }) {
  const el = element;
  const height = element.scrollHeight;
  const elTransitionBackup = element.style.transition;
  el.style.transition = 'max-height 0s !important';
  const transitionEvent = (event) => {
    if (event.propertyName === 'max-height') {
      el[REL](TRANSITION_END, transitionEvent);
      setToCollapsed({ element: el, callback });
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

function expand({ element, callback }) {
  const el = element;
  el.style.display = '';

  const transitionEvent = (event) => {
    if (event.propertyName === 'max-height') {
      element[REL](TRANSITION_END, transitionEvent);
      setToExpanded({ element: el, callback });
    }
  };

  element.addEventListener(TRANSITION_END, transitionEvent);
  // Same level of nested rAF as collapse to synchronize timing of animation.
  rAF(() => {
    rAF(() => {
      el.style.maxHeight = `${element.scrollHeight}px`;
    });
  });
}

function toggle({ element, callback }) {
  if (element.style.maxHeight === '0px') {
    expand({ element, callback });
  } else {
    collapse({ element, callback });
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
