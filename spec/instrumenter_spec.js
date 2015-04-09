import h from './spec-helper';
import Instrumenter from '../src/instrumenter';
import { SourceCode } from 'castborg';

/**
 * instrumenter (static class)
 */
describe('Instrumenter:', function() {

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new Instrumenter()) ).to.throw(Error);
  });
  //---------------------------------------------------------------

  describe('addDebugRequire:', function () {

    it('should insert require on top of main body', function() {
      var sourceCode = new SourceCode({
        code: [
          "var path = require('path');",
          "",
          "var sum = function(a, b) {",
          "  return a + b;",
          "}",
        ].join('\n'),
        file: './some-file.js' });

      var new_code = Instrumenter.addDebugRequire(sourceCode);

      h.expect(new_code).to.eql([
        "var debug = require('debug')('./some-file.js');",
        "var __astLoggerPrint__ = require('ast-logger-print');",
        "var path = require('path');",
        "",
        "var sum = function(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

  describe('addDebugToAllFunctionsCalls:', function () {

    it('should insert __debug_data__ on top of the function', function() {
      var sourceCode = new SourceCode({
        code: [
          "var path = require('path');",
          "",
          "function sum(a, b) {",
          "  return a + b;",
          "}",
        ].join('\n'),
        file: './some-file.js' });

      var new_code = Instrumenter.addDebugToAllFunctionsCalls(sourceCode);

      h.expect(new_code).to.eql([
        "var path = require('path');",
        "",
        "function sum(a, b) {",
        "  var __debug_data__ = {",
        "    name: 'sum',",
        "    arguments: arguments,",
        "    line: {original_line: 3}",
        "  };",
        "",
        "  return a + b;",
        "}",
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

  describe('addDebugToAllFunctionsReturnStatements:', function () {

    it('should insert __debug_data__ on top of the function', function() {
      var sourceCode = new SourceCode({
        code: [
          "var path = require('path');",
          "",
          "function sum(a, b) {",
          "  return a + b;",
          "}",
        ].join('\n'),
        file: './some-file.js' });

      var new_code = Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);

      h.expect(new_code).to.eql([
        "var path = require('path');",
        "",
        "function sum(a, b) {",
        "  __debug_data__.return_data = (a + b);",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}",
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

  describe('instrumentAllFunctions:', function () {

    it('should full instrument all functions', function() {
      var sourceCode = new SourceCode({
        code: [
          "var path = require('path');",
          "",
          "function sum(a, b) {",
          "  return a + b;",
          "}",
          "",
          "function times(a, b) {",
          "  return a * b;",
          "}",
        ].join('\n'),
        file: './some-file.js' });

      var new_code = Instrumenter.instrumentAllFunctions(sourceCode);

      h.expect(new_code).to.eql([
        "var debug = require('debug')('./some-file.js');",
        "var __astLoggerPrint__ = require('ast-logger-print');",
        "var path = require('path');",
        "",
        "function sum(a, b) {",
        "  var __debug_data__ = {",
        "    name: 'sum',",
        "    arguments: arguments,",
        "    line: {original_line: 3}",
        "  };",
        "",
        "  __debug_data__.return_data = (a + b);",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}",
        "",
        "function times(a, b) {",
        "  var __debug_data__ = {",
        "    name: 'times',",
        "    arguments: arguments,",
        "    line: {original_line: 7}",
        "  };",
        "",
        "  __debug_data__.return_data = (a * b);",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}",
      ].join('\n'));
    });

    it('should full instrument strange functions', function() {
      var sourceCode = new SourceCode({
        code: [
          "setTimeout(function () {",
          "  total = total + times({a: 1, b: 2}).result;",
          "  setTimeout(function () {",
          "    total = total + inner.sum_inner(0, 2);",
          "    // TOTAL",
          "    console.log('total:', total);",
          "  }, 200);",
          "}, 200);",
        ].join('\n'),
        file: './some-file.js' });

      var new_code = Instrumenter.instrumentAllFunctions(sourceCode);

      h.expect(new_code).to.eql([
        "var debug = require('debug')('./some-file.js');",
        "var __astLoggerPrint__ = require('ast-logger-print');",
        "setTimeout(function () {",
        "  var __debug_data__ = {",
        "    name: 'anonymous',",
        "    arguments: arguments,",
        "    line: {original_line: 1}",
        "  };",
        "",
        "  total = total + times({a: 1, b: 2}).result;",
        "  setTimeout(function () {",
        "    var __debug_data__ = {",
        "      name: 'anonymous',",
        "      arguments: arguments,",
        "      line: {original_line: 3}",
        "    };",
        "",
        "    total = total + inner.sum_inner(0, 2);",
        "    // TOTAL",
        "    console.log('total:', total);",
        "    __debug_data__.return_data = ('no_ret');",
        "    __astLoggerPrint__(debug, __debug_data__);",
        "    return __debug_data__.return_data;",
        "  }, 200);",
        "  __debug_data__.return_data = ('no_ret');",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}, 200);",
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

});
