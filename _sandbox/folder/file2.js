var debug = require('debug')('inner/file2.js');
var __debug_log = require('../__debug_log');

module.exports = {
  sum_inner: function(a, b) {
    var __debug_data__ = {
        name: 'sum_inner',
        arguments: arguments,
        line: {original_line: 6}
    };

    __debug_data__.return_data = a + b;
    __debug_log.log(debug, __debug_data__);
    return a + b;
  }
};
