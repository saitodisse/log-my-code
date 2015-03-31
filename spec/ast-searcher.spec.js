import h from './spec-helper';
import AstSearcher from '../src/ast-searcher';

/**
 * ast-logger spec example
 * uses mocha and chai
 */
describe('AstSearcher:', function() {

  var astSearcher;

  beforeEach(function () {
    astSearcher = new AstSearcher();
  });

  it('should be instatiable', function() {
    h.expect(astSearcher).to.not.be.undefined;
  });

  it('should not have code and ast', function() {
    h.expect(astSearcher.original_code).to.be.null;
    h.expect(astSearcher.ast).to.be.null;
  });
  //---------------------------------------------------------------

  describe('searchFunctions:', function () {

    it('should search for one function', function() {
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n');

      var functions_list = astSearcher.searchFunctions();
      h.expect(functions_list).to.have.length(1);
    });

    it('should search for two functions', function() {
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
        'var sum2 = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n');

      var functions_list = astSearcher.searchFunctions();
      h.expect(functions_list).to.have.length(2);
    });

    it('should search for inner functions', function() {
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return (function() { return a + b })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  var sumInner = function(a, b) {',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n');

      var functions_list = astSearcher.searchFunctions();
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

      h.expect(astSearcher._isInside(1, 0, loc)).to.eql(false);
      h.expect(astSearcher._isInside(1, 1, loc)).to.eql(false);
      h.expect(astSearcher._isInside(2, 9, loc)).to.eql(false);
      h.expect(astSearcher._isInside(2, 10, loc)).to.eql(true);
      h.expect(astSearcher._isInside(3, 1, loc)).to.eql(true);
      h.expect(astSearcher._isInside(3, 10, loc)).to.eql(true);
      h.expect(astSearcher._isInside(3, 100, loc)).to.eql(true);
      h.expect(astSearcher._isInside(4, 1, loc)).to.eql(true);
      h.expect(astSearcher._isInside(4, 2, loc)).to.eql(false);
    });

  });
  //---------------------------------------------------------------

  describe('searchFunctionOnLocation:', function () {

    it('should search for one function', function() {
      astSearcher.original_code = [
        'var number = 5;',
        'var sum = function(a, b) {',
        '  return a + b;',
        '};',
      ].join('\n');

      h.expect(astSearcher.searchFunctionOnLocation(1, 1)).to.be.null;
      h.expect(astSearcher.searchFunctionOnLocation(3, 1)).to.not.be.null;
    });

  });
  //---------------------------------------------------------------

  describe('instrument Insert ConsoleLog Arguments Before Function:', function () {

    it('should insert console log before', function() {
      // parse code
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n');
      var functions_list = astSearcher.searchFunctions();

      // insert snippet
      astSearcher.instrumentInsertConsoleLogArgumentsBeforeFunction(functions_list[0]);

      h.expect(astSearcher.code).to.eql([
        'var sum = function(a, b) {',
        '  console.log(arguments);',
        '  return a + b;',
        '}',
      ].join('\n'));
    });

    it('should insert console log before inner function', function() {
      // parse code
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return (function() {',
        '    return a + b;',
        '  })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  var sumInner = function(a, b) {',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n');
      var functions_list = astSearcher.searchFunctions();

      // insert snippet
      astSearcher.instrumentInsertConsoleLogArgumentsBeforeFunction(functions_list[1]);

      h.expect(astSearcher.code).to.eql([
        'var sum = function(a, b) {',
        '  return (function() {',
        '    console.log(arguments);',
        '    return a + b;',
        '  })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  var sumInner = function(a, b) {',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

  describe('instrument Insert ConsoleLog Arguments Before All Functions:', function () {

    it('should insert before all', function() {
      // parse code
      astSearcher.original_code = [
        'var sum = function(a, b) {',
        '  return (function() {',
        '    return a + b;',
        '  })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  var sumInner = function(a, b) {',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n');

      // insert snippet
      astSearcher.instrumentInsertConsoleLogArgumentsBeforeAllFunctions();

      h.expect(astSearcher.code).to.eql([
        'var sum = function(a, b) {',
        '  console.log(arguments);',
        '  return (function() {',
        '    console.log(arguments);',
        '    return a + b;',
        '  })(a, b);',
        '}',
        'var sum2 = function(a, b) {',
        '  console.log(arguments);',
        '  var sumInner = function(a, b) {',
        '    console.log(arguments);',
        '    return a + b;',
        '  }',
        '  return sumInner(a, b);',
        '}',
      ].join('\n'));
    });

  });
  //---------------------------------------------------------------

});
