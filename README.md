# ast-logger

`ast-logger` will parse all the code searching functions.
Allow to add and remove instrumentation code.

- **src**:  all files will transpiled with babel to lib/src
- **spec**: all files will transpiled with babel to lib/spec
- **bin**:  no ocours transpilation here

#### DebugInsert proposal (TODO)

```js
// one file
var debugInsert           = new DebugInsert();
var original_file_path    = './original_file.js';
var destination_file_path = './destination_file.js';
debugInsert.transpileFile(original_file_path, destination_file_path);

// all files
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
