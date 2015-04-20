# simple instrument javascript proposal

- using debug lib (https://www.npmjs.com/package/debug)


#### install debug

```
npm i
```

#### run

```
DEBUG=* ./file1.js
```

![alt text](https://files.gitter.im/debug-print/nEwd/blob "Result")


## Proposal

- [x] create a **debug-log-my-code** npm package based on this `debug-print.js` file

- [x] insert snippet below at top of the file
```js
var debug = require('debug')('__FILE_NAME_HERE__');
var __astLoggerPrint__ = require('debug-print');
```

- [x] insert snippet below on top of each function
```js
var __debug_data__ = {
  name: '__FUNCTION_NAME__',
  arguments: arguments,
  line: {original_line: __ORIGINAL_LINE_NUMBER__}
};
```

- [x] insert snippet below before each return statement
```js
__debug_data__.return_data = __RETURN_STATEMENT__;
__astLoggerPrint__(debug, __debug_data__);
return __debug_data__.return_data;
```
