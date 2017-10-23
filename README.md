# zlide

### Usage example

Look in dist/index.html for css setup example.

```javascript
var myElement = document.querySelector('.my-element');

function doneCallback() {
  console.log('done');
}

zlide.down({element: myElement, callback: doneCallback});

zlide.up({element: myElement, callback: doneCallback});

zlide.toggle({element: myElement, callback: doneCallback});
```
