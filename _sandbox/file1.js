#!/usr/bin/env node

var debug = require('debug')('file1.js');
var inner = require('./folder/file2.js');

function sum(a, b) {
  var __debug_data__ = {
    name: 'sum',
    arguments: arguments,
    line: {original_line: 9}
  };

  __debug_data__.return_data = a + b;
  debug(__debug_data__);
  return a + b;
}

var times = function (a, b) {
  var __debug_data__ = {
    name: 'times',
    arguments: arguments,
    line: {original_line: 21}
  };

  __debug_data__.return_data = a * b;
  debug(__debug_data__);
  return a * b;
};

// RUN async
var total = 0;

total = total + sum(1, 1);
setTimeout(function () {
  total = total + times(1, 2);
  setTimeout(function () {
    total = total + inner.sum_inner(0, 2);
    // TOTAL
    console.log('total:', total);
  }, 200);
}, 200);
total = total + inner.sum_inner(-4, 6);
