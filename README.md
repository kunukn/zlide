# zlide

### about

slider functionality from `jQuery.slideToggle`, `jQuery.slideUp`, `jQuery.slideDown` but with CSS transition on max-height. Same idea as this https://github.com/BrentonCozby/dom-slider but minimalistic. You have to apply css transition styling to your element. Inert is supported. (uses display: none when collapsed)

### demo

Collapsibles with inert support: https://codepen.io/kunukn/full/pWBvEo
Accordion with inert support:    https://codepen.io/kunukn/full/xXePEv

### Usage example

Look in dist/index.html for css setup example.


```css
.my-element {
  transition: max-height 200ms;
  padding-top: 0;
  padding-bottom: 0;
}
```


```javascript
var myElement = document.querySelector('.my-element');

function doneCallback(props) {
  console.log('done');
}

zlide.down({element: myElement, doneCallback: doneCallback});

zlide.up({element: myElement, doneCallback: doneCallback});

zlide.toggle({element: myElement, doneCallback: doneCallback});
```

### api

```javascript
var myElement = document.querySelector('.my-element');
function doneCallback(props){ console.log('done, your element is available in props.element') }
```

* `zlide.up({element: myElement, doneCallback: doneCallback)` (same as `zlide.collapse`)
* `zlide.down({element: myElement, doneCallback: doneCallback)` (same as `zlide.expand`)
* `zlide.toggle({element: myElement, doneCallback: doneCallback)`
* `zlide.setToCollapsed({element: myElement, doneCallback: doneCallback)`
* `zlide.setToExpanded({element: myElement, doneCallback: doneCallback)`


### cdn

https://unpkg.com/zlide


### how does it work?

CSS transition on dynamically max-height value and transitionend event.
