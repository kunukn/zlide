# zlide

### about

slider functionaliter from jQuery.slideToggle, jQuery.slideUp, jQuery.slideDown but with css transition on calculated max-height. Same idea as this https://github.com/BrentonCozby/dom-slider but minimalistic. You have to add css transition styling to your element.

### demo

https://codepen.io/kunukn/pen/pWBvEo?editors=0010



### Usage example

Look in dist/index.html for css setup example.


```css
.my-element {
  transition: max-height 200ms;
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
