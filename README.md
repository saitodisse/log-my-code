# ast-cyborg (Log My Code)

`log-my-code` will parse all the code searching functions.
Allow to add and remove instrumentation code.

code -> SourceCode1 -> Searcher.searchFunction -> Modifier.excludeFunction -> ast -> SourceCode2.code

log-my-code can receive code / AST / filepath (JavaScript file) and parse its contents
to a SourceCode class that will contain a version of the code and AST.

log-my-code can also search inside the AST, and modify parts of it. It will then return
a new copy of the existing code / AST / filepath.

- **src**:  all files will transpiled with babel to lib/src
- **spec**: all files will transpiled with babel to lib/spec
- **bin**:  no ocours transpilation here

#### (TODO)

[ ] get functions name in all cases below:

```js
var f1 = function() {}  //f1
function f2() {}        //f2
class F3() {
  constructor() {}      //new F3()
  get f5() {}           //get f5
  set f6(value) {}      //set f6
  f7() {}               //f7
}
var obj = {
  f8: function() {}     //f8
}
() => {}                //anonymous
(function(){})          //anonymous
```

[ ] add a `/*-debug-*/` on each line to make easy to remove


#### Usage

`./some-file.js`:

```js
function sum(a, b) {
  return a + b;
}
```

**Instrument**:

```js
var sourceCode = new SourceCode({ file: './some-file.js' });
var new_code = Instrumenter.instrumentAllFunctions(sourceCode);
```

Result:

```js
var debug = require('debug')('./some-file.js');
var __astLoggerPrint__ = require('debug-print');

function sum(a, b) {
  var __debug_data__ = {
    name: 'sum',
    arguments: arguments,
    line: {original_line: 3}
  };

  __debug_data__.return_data = (a + b);
  __astLoggerPrint__(debug, __debug_data__);
  return __debug_data__.return_data;
}
```

obs: will need to install this lib: `npm install debug-print`

#### before start

```
$ npm install
```

#### test + lint (no watch)

```
$ gulp
```

#### test + lint + watch

```
$ gulp test
```

#### test + watch (no-lint)

```
$ gulp test-no-lint
```

#### publish a patch to npm

```
$ npm run-script patch
```
