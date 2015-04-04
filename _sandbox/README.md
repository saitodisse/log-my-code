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

![alt text](https://files.gitter.im/saitodisse/nEwd/blob "Result")


## Proposal

- [ ] create a **debug-ast-logger** npm package based on this `__debug_log.js` file

- [ ] insert snippet below at top of the file
```js
var debug = require('debug')('__FILE_NAME_HERE__');
var __debug_ast_logger__ = require('debug-ast-logger');
```

- [ ] insert snippet below on top of each function
```js
var __debug_data__ = {
  name: '__FUNCTION_NAME__',
  arguments: arguments,
  line: {original_line: __ORIGINAL_LINE_NUMBER__}
};
```

- [ ] insert snippet below before each return statement
```js
__debug_data__.return_data = __RETURN_EXPRESSION__;
__debug_log.log(debug, __debug_data__);
```
