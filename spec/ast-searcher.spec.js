import h from './spec-helper';
import SourceCode from '../src/source-code';
import AstSearcher from '../src/ast-searcher';

/**
 * ast-logger spec example
 * uses mocha and chai
 */
describe('AstSearcher (static class):', function() {

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new AstSearcher()) ).to.throw(Error);
  });

  describe('searchMainBody:', function () {

    it('should search for the main body', function() {
      var sourceCode = new SourceCode({ code: [
        'var path = require(\'path\');',
        '',
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var bodyArray = AstSearcher.searchMainBody(sourceCode.ast);
      h.expect(bodyArray).to.be.an.array;
      h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
      h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');
    });

  });
  //---------------------------------------------------------------

  describe('searchFunctions:', function () {

    it('should search for one function', function() {
      var sourceCode = new SourceCode({ code: [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      h.expect(functions_list).to.have.length(1);
    });

    it('should search for two functions', function() {
      var sourceCode = new SourceCode({ code: [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
        'var sum2 = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      h.expect(functions_list).to.have.length(2);
    });

    it('should search for inner functions', function() {
      var sourceCode = new SourceCode({ code: [
        'var sum = function(a, b) {',
        '  return (function() { return a + b })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  var sumInner = function(a, b) {',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      h.expect(functions_list).to.have.length(4);
    });

  });
  //---------------------------------------------------------------

  describe('_isInside:', function () {

    it('should be inside only if it is inside', function() {
      var loc = { start: { line: 2, column: 10 },
          end: { line: 4, column: 1 },
          lines: {},
          indent: 0 };

      h.expect(AstSearcher._isInside(1, 0, loc)).to.eql(false);
      h.expect(AstSearcher._isInside(1, 1, loc)).to.eql(false);
      h.expect(AstSearcher._isInside(2, 9, loc)).to.eql(false);
      h.expect(AstSearcher._isInside(2, 10, loc)).to.eql(true);
      h.expect(AstSearcher._isInside(3, 1, loc)).to.eql(true);
      h.expect(AstSearcher._isInside(3, 10, loc)).to.eql(true);
      h.expect(AstSearcher._isInside(3, 100, loc)).to.eql(true);
      h.expect(AstSearcher._isInside(4, 1, loc)).to.eql(true);
      h.expect(AstSearcher._isInside(4, 2, loc)).to.eql(false);
    });

  });
  //---------------------------------------------------------------

  describe('searchFunctionOnLocation:', function () {

    it('should search for one function', function() {
      var sourceCode = new SourceCode({ code: [
        'var number = 5;',
        'var sum = function(a, b) {',
        '  return a + b;',
        '};',
      ].join('\n') });

      h.expect(AstSearcher.searchFunctionOnLocation(sourceCode.ast, 1, 1)).to.be.null;
      h.expect(AstSearcher.searchFunctionOnLocation(sourceCode.ast, 3, 1)).to.not.be.null;
    });

  });
  //---------------------------------------------------------------

  // describe('instrument Insert ConsoleLog Arguments Before Function:', function () {
  //
  //   it('should insert console log before', function() {
  //     // parse code
  //     AstSearcher.original_code = [
  //       'var sum = function(a, b) {',
  //       '  return a + b;',
  //       '}',
  //     ].join('\n');
  //     var functions_list = AstSearcher.searchFunctions();
  //
  //     // insert snippet
  //     AstSearcher.instrumentInsertConsoleLogArgumentsBeforeFunction(functions_list[0]);
  //
  //     h.expect(AstSearcher.code).to.eql([
  //       'var sum = function(a, b) {',
  //       '  console.log(arguments);',
  //       '  return a + b;',
  //       '}',
  //     ].join('\n'));
  //   });
  //
  //   it('should insert console log before inner function', function() {
  //     // parse code
  //     AstSearcher.original_code = [
  //       'var sum = function(a, b) {',
  //       '  return (function() {',
  //       '    return a + b;',
  //       '  })(a, b);',
  //       '}',
  //       'var sum2 = function(a, b) {',
  //       '  var sumInner = function(a, b) {',
  //       '    return a + b;',
  //       '  }',
  //       '  return sumInner(a, b);',
  //       '}',
  //     ].join('\n');
  //     var functions_list = AstSearcher.searchFunctions();
  //
  //     // insert snippet
  //     AstSearcher.instrumentInsertConsoleLogArgumentsBeforeFunction(functions_list[1]);
  //
  //     h.expect(AstSearcher.code).to.eql([
  //       'var sum = function(a, b) {',
  //       '  return (function() {',
  //       '    console.log(arguments);',
  //       '    return a + b;',
  //       '  })(a, b);',
  //       '}',
  //       'var sum2 = function(a, b) {',
  //       '  var sumInner = function(a, b) {',
  //       '    return a + b;',
  //       '  }',
  //       '  return sumInner(a, b);',
  //       '}',
  //     ].join('\n'));
  //   });
  //
  // });
  // //---------------------------------------------------------------
  //
  // describe('instrument Insert ConsoleLog Arguments Before All Functions:', function () {
  //
  //   it('should insert before all', function() {
  //     // parse code
  //     AstSearcher.original_code = [
  //       'var sum = function(a, b) {',
  //       '  return (function() {',
  //       '    return a + b;',
  //       '  })(a, b);',
  //       '}',
  //       'var sum2 = function(a, b) {',
  //       '  var sumInner = function(a, b) {',
  //       '    return a + b;',
  //       '  }',
  //       '  return sumInner(a, b);',
  //       '}',
  //     ].join('\n');
  //
  //     // insert snippet
  //     AstSearcher.instrumentInsertConsoleLogArgumentsBeforeAllFunctions();
  //
  //     h.expect(AstSearcher.code).to.eql([
  //       'var sum = function(a, b) {',
  //       '  console.log(arguments);',
  //       '  return (function() {',
  //       '    console.log(arguments);',
  //       '    return a + b;',
  //       '  })(a, b);',
  //       '}',
  //       'var sum2 = function(a, b) {',
  //       '  console.log(arguments);',
  //       '  var sumInner = function(a, b) {',
  //       '    console.log(arguments);',
  //       '    return a + b;',
  //       '  }',
  //       '  return sumInner(a, b);',
  //       '}',
  //     ].join('\n'));
  //   });
  //
  // });
  // //---------------------------------------------------------------

});
