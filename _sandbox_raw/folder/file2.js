var debug = require('debug')(__filename);
var __astLoggerPrint__ = require('ast-logger-print');
module.exports = {
  sum_inner: function(a, b) {
    var __debug_data__ = {
      name: 'anonymous',
      arguments: arguments,
      line: {original_line: 2}
    };

    __debug_data__.return_data = (a + b);
    __astLoggerPrint__(debug, __debug_data__);
    return __debug_data__.return_data;
  }
};
