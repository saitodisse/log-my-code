import h from '../spec-helper';
import SourceCode from '../../src/source-code';
import AstSearcher from '../../src/ast-helpers/ast-searcher';

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

  describe('searchFunctionName:', function () {

    it('should get "sum" name', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var function_name = AstSearcher.searchFunctionName(functions_list[0]);
      h.expect(function_name).to.equal('sum');
    });

    it('should not get name from anonymous function', function() {
      var sourceCode = new SourceCode({ code: [
        'var f = function (a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var function_name = AstSearcher.searchFunctionName(functions_list[0]);
      h.expect(function_name).to.equal('anonymous');
    });

  });
  //---------------------------------------------------------------

  describe('searchFunctionReturnExpression:', function () {

    it('should get return expression', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var return_statements_ast = AstSearcher.searchFunctionReturnExpression(functions_list[0]);

      var sourceCodeReturnExpression = new SourceCode({ ast: return_statements_ast[0] });
      h.expect(sourceCodeReturnExpression.code).to.equal('return a + b;');
    });

    it('should get not get return expression if does not exist', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  var result = a + b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var return_statements_ast = AstSearcher.searchFunctionReturnExpression(functions_list[0]);

      h.expect(return_statements_ast).to.deep.equal([]);
    });

    it('should get two returns', function() {
      var sourceCode = new SourceCode({ code: [
        'function max(a, b) {',
        '  if (a => b) return a;',
        '  else return b;',
        '}',
      ].join('\n') });

      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var return_statements_ast = AstSearcher.searchFunctionReturnExpression(functions_list[0]);

      h.expect(return_statements_ast.length).to.deep.equal(2);
    });

  });
  //---------------------------------------------------------------

  describe('_isLocInsideFunction:', function () {

    it('should be inside only if it is inside', function() {
      var loc = { start: { line: 2, column: 10 },
          end: { line: 4, column: 1 },
          lines: {},
          indent: 0 };

      h.expect(AstSearcher._isLocInsideFunction(1, 0, loc)).to.eql(false);
      h.expect(AstSearcher._isLocInsideFunction(1, 1, loc)).to.eql(false);
      h.expect(AstSearcher._isLocInsideFunction(2, 9, loc)).to.eql(false);
      h.expect(AstSearcher._isLocInsideFunction(2, 10, loc)).to.eql(true);
      h.expect(AstSearcher._isLocInsideFunction(3, 1, loc)).to.eql(true);
      h.expect(AstSearcher._isLocInsideFunction(3, 10, loc)).to.eql(true);
      h.expect(AstSearcher._isLocInsideFunction(3, 100, loc)).to.eql(true);
      h.expect(AstSearcher._isLocInsideFunction(4, 1, loc)).to.eql(true);
      h.expect(AstSearcher._isLocInsideFunction(4, 2, loc)).to.eql(false);
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

});
