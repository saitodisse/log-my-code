import h from './spec-helper';
import DebugInsert from '../src/debug-insert';

/**
 * debug-insert
 */
describe('DebugInsert:', function() {

  it('should be instatiable', function() {
    var debugInsert = new DebugInsert();
    h.expect(debugInsert).to.not.be.undefined;
  });
  //---------------------------------------------------------------

  describe('instrument Insert ConsoleLog Arguments Before Function:', function () {

    it.skip('should insert console log before', function() {
      var debugInsert = new DebugInsert([
        "var path = require('path');",
        "",
        "var sum = function(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n'));

      debugInsert._addDebugLibRequire('some-file.js');
      var code = debugInsert.code;

      h.expect(code).to.eql([
        "var debug = require('debug')('some-file.js');",
        "var __debug_ast_logger__ = require('debug-ast-logger');",
        "",
        "var path = require('path');",
        "",
        "var sum = function(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

});
