Create a file <a type="workspace/new-file">**server.js** with content:

```
setTimeout(function() {
  console.log('one');
  console.log('two');
  console.log('three');
  setTimeout(function() {}, 1000)
}, 100)
```
</a>