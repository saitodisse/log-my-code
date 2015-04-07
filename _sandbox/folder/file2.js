var debug = require('debug')('inner/file2.js');
var __astLoggerPrint__ = require('ast-logger-print');

module.exports = {
  sum_inner: function(a, b) {
    var __debug_data__ = {
        name: 'sum_inner',
        arguments: arguments,
        line: {original_line: 6}
    };

    __debug_data__.return_data = a + b;
    __astLoggerPrint__(debug, __debug_data__);
    return __debug_data__.return_data;
  }
};
