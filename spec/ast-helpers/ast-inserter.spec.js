import h from '../spec-helper';
import AstInserter from '../../src/ast-helpers/ast-inserter';

/**
 * debug-insert
 */
describe('AstInserter:', function() {

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new AstInserter()) ).to.throw(Error);
  });
  //---------------------------------------------------------------

  describe('instrument Insert ConsoleLog Arguments Before Function:', function () {

    it.skip('should insert console log before', function() {
      var debugInsert = new AstInserter([
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
