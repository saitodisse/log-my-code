import h from './spec-helper';
import Instrumenter from '../src/instrumenter';
import { SourceCode } from 'castborg';

/**
 * instrumenter (static class)
 */
describe('Instrumenter:', function() {

  // jscs:disable maximumLineLength

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new Instrumenter()) ).to.throw(Error);
  });

  describe('addDebugToAllFunctionsReturnStatements:', function () {

    it('should insert replaces returns on function', function() {

      // original code
      var sourceCode = new SourceCode({
        code: [
          "var path = require('path');",
          "",
          "function sum(a, b) {",
          "  return a + b;",
          "}",
        ].join('\n'),
        file: './some-file.js' });

      // convert
      var new_code = Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);
      var new_code_splited = new_code.split('\n');

      // check
      var code_expected = [
        "var path = require('path');",
        "",
        "function sum(a, b) {",
        "  var __return__ = require('../index').debug({ name: 'a + b', arguments: arguments, line: {original_line: undefined}, return_data: 'no_ret' }, __filename);",
        "  return __return__;",
        "}",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

  });
  //---------------------------------------------------------------

  describe('instrumentAllFunctions:', function () {

    it('should full instrument all functions', function() {

      // original code
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

      // convert
      var new_code = Instrumenter.instrumentAllFunctions(sourceCode);
      var new_code_splited = new_code.split('\n');

      // check
      var code_expected = [
        "var path = require('path');",
        "",
        "function sum(a, b) {",
        "  var __return__ = require('../index').debug({ name: 'a + b', arguments: arguments, line: {original_line: undefined}, return_data: 'no_ret' }, __filename);",
        "  return __return__;",
        "}",
        "",
        "function times(a, b) {",
        "  var __return__ = require('../index').debug({ name: 'a * b', arguments: arguments, line: {original_line: undefined}, return_data: 'no_ret' }, __filename);",
        "  return __return__;",
        "}",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

    it('should full instrument strange functions', function() {

      // original code
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

      // convert
      var new_code = Instrumenter.instrumentAllFunctions(sourceCode);
      var new_code_splited = new_code.split('\n');

      // check
      var code_expected = [
        "setTimeout(function () {",
        "  total = total + times({a: 1, b: 2}).result;",
        "  setTimeout(function () {",
        "    total = total + inner.sum_inner(0, 2);",
        "    // TOTAL",
        "    console.log('total:', total);",
        "    var __return__ = require('../index').debug({ name: '', arguments: arguments, line: {original_line: undefined}, return_data: 'no_ret' }, __filename);",
        "    return __return__;",
        "  }, 200);",
        "  var __return__ = require('../index').debug({ name: '', arguments: arguments, line: {original_line: undefined}, return_data: 'no_ret' }, __filename);",
        "  return __return__;",
        "}, 200);",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

  });
  //---------------------------------------------------------------

  // jscs:enable maximumLineLength
});
