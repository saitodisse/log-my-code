#!/usr/bin/env node

var debug = require('debug')('file1.js');
var astLoggerPrint = require('ast-logger-print');

var inner = require('./folder/file2.js');

function sum(a, b) {
  var __debug_data__ = {
    name: 'sum',
    arguments: arguments,
    line: {original_line: 9}
  };

  __debug_data__.return_data = a + b;
  astLoggerPrint.log(debug, __debug_data__);
  return a + b;
}

var times = function (options) {
  var __debug_data__ = {
    name: 'times',
    arguments: arguments,
    line: {original_line: 21}
  };

  __debug_data__.return_data = { result: options.a * options.b };
  astLoggerPrint.log(debug, __debug_data__);
  return { result: options.a * options.b };
};

// RUN async
var total = 0;

total = total + sum(1, 1);
setTimeout(function () {
  total = total + times({a: 1, b: 2}).result;
  setTimeout(function () {
    total = total + inner.sum_inner(0, 2);
    // TOTAL
    console.log('total:', total);
  }, 200);
}, 200);
total = total + inner.sum_inner(-4, 6);
