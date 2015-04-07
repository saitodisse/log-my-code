import h from './spec-helper';
import Instrumenter from '../src/instrumenter';
import SourceCode from '../src/source-code';

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

});
