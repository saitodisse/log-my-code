# ast-logger (Log My Code)

`ast-logger` will parse all the code searching functions.
Allow to add and remove instrumentation code.

- **src**:  all files will transpiled with babel to lib/src
- **spec**: all files will transpiled with babel to lib/spec
- **bin**:  no ocours transpilation here

#### Usage

`./some-file.js`:

```js
var path = require('path');

function sum(a, b) {
  return a + b;
}

function times(a, b) {
  return a * b;
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
var __astLoggerPrint__ = require('ast-logger-print');
var path = require('path');

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

function times(a, b) {
  var __debug_data__ = {
    name: 'times',
    arguments: arguments,
    line: {original_line: 7}
  };

  __debug_data__.return_data = (a * b);
  __astLoggerPrint__(debug, __debug_data__);
  return __debug_data__.return_data;
}
```

obs: will need to install this lib: `npm install ast-logger-print`

#### (TODO)

```js
// one file
var debugInsert           = new DebugInsert();
var original_file_path    = './original_file.js';
var destination_file_path = './destination_file.js';
debugInsert.transpileFile(original_file_path, destination_file_path);

// all files TODO
var debugInsert = new DebugInsert();
debugInsert.transpileAllFiles('./src/**/*.js', './lib-debug');
```

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
