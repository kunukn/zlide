# zlide

### about

slider functionality from `jQuery.slideToggle`, `jQuery.slideUp`, `jQuery.slideDown` but with CSS transition on max-height. Same idea as this https://github.com/BrentonCozby/dom-slider but minimalistic. You have to apply css transition styling to your element. Inert is supported. (uses display: none when collapsed)

### demo

* Collapsibles with inert support: https://codepen.io/kunukn/full/pWBvEo
* Accordion with inert support:    https://codepen.io/kunukn/full/xXePEv

### Usage example

Look in dist/index.html for css setup example.


```css
.zlide-inert{
  display: none !important;
}

.my-element {
  transition: max-height 200ms;
  padding-top: 0;
  padding-bottom: 0;
}
```


```javascript
var myElement = document.querySelector('.my-element');

function doneCallback(props) {
  console.log('done ' + props.type);
}

function beforeCallback(props) {
  console.log('doing ' + props.type);
}

zlide.down({element: myElement, beforeCallback, doneCallback});

zlide.up({element: myElement, beforeCallback, doneCallback});

zlide.toggle({element: myElement, beforeCallback, doneCallback});
```

### api

```javascript
var myElement = document.querySelector('.my-element');

function doneCallback(props) {
  console.log('done ' + props.type);
}

function beforeCallback(props) {
  console.log('doing ' + props.type);
}

```

* `zlide.up({element: myElement, beforeCallback, doneCallback)` (same as `zlide.collapse`)
* `zlide.down({element: myElement, beforeCallback, doneCallback)` (same as `zlide.expand`)
* `zlide.toggle({element: myElement, beforeCallback, doneCallback)`
* `zlide.setToCollapsed({element: myElement, beforeCallback, doneCallback)`
* `zlide.setToExpanded({element: myElement, beforeCallback, doneCallback)`


### cdn

https://unpkg.com/zlide


### development

* git clone/download project
* npm install
* npm start
* go to localhost:3000

### build

* npm run clean
* npm run build
* npm run minify-dist-umd
* look in dist folder


### how does it work?

CSS transition on dynamically max-height value and transitionend event.
