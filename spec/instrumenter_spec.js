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
        "  return require('debug-print').debug({ name: 'sum', arguments: arguments, line: {original_line: 3},",
        "    return_data: (a + b) }, __filename);",
        "}",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

    it('should work with constructors', function() {

      // original code
      var original_code = [
        "class SomeClass {",
        "",
        "  constructor(opts) {",
        "    this._opts = opts || {};",
        "  }",
        "",
        "}",
      ];
      var sourceCode = new SourceCode({
        code: original_code.join('\n')
      });

      // convert
      var new_code = Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);
      var new_code_splited = new_code.split('\n');

      // check
      var code_expected = [
        "class SomeClass {",
        "",
        "  constructor(opts) {",
        "    this._opts = opts || {};",
        "    return require('debug-print').debug({ name: 'new SomeClass()', arguments: arguments, line: {original_line: 3},",
        "      return_data: ('VOID') }, __filename);",
        "  }",
        "",
        "}",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

    it('should work with callbacks', function() {

      // original code
      var original_code = [
        "() => {",
        "  var handler = function (err, data) {",
        "    return data;",
        "  };",
        "}",
      ];
      var sourceCode = new SourceCode({
        code: original_code.join('\n')
      });

      // convert
      var new_code = Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);
      var new_code_splited = new_code.split('\n');

      // check
      var code_expected = [
        "",
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
        "  return require('debug-print').debug({ name: 'sum', arguments: arguments, line: {original_line: 3},",
        "    return_data: (a + b) }, __filename);",
        "}",
        "",
        "function times(a, b) {",
        "  return require('debug-print').debug({ name: 'times', arguments: arguments, line: {original_line: 7},",
        "    return_data: (a * b) }, __filename);",
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
        "    return require('debug-print').debug({ name: 'anonymous', arguments: arguments, line: {original_line: 3},",
        "      return_data: ('VOID') }, __filename);",
        "  }, 200);",
        "  return require('debug-print').debug({ name: 'anonymous', arguments: arguments, line: {original_line: 1},",
        "    return_data: ('VOID') }, __filename);",
        "}, 200);",
      ];
      h.expect(new_code_splited).to.eql(code_expected);

    });

  });
  //---------------------------------------------------------------

  // jscs:enable maximumLineLength
});
