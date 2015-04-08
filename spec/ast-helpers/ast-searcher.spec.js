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

  describe('program body Array:', function () {

    it('should search for the main body', function() {
      var sourceCode = new SourceCode({ code: [
        'var path = require(\'path\');',
        '',
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var bodyArray = sourceCode.ast.program.body;
      h.expect(bodyArray).to.be.an.array;
      h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
      h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');
    });

  });
  //---------------------------------------------------------------

  describe('getAllFunctionsPaths:', function () {

    it('should search for one function', function() {
      var sourceCode = new SourceCode({ code: [
        'var sum = function(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      h.expect(functions_list_path).to.have.length(1);
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

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      h.expect(functions_list_path).to.have.length(2);
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

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      h.expect(functions_list_path).to.have.length(4);
    });

  });
  //---------------------------------------------------------------

  describe('getNameFromFunctionPath:', function () {

    it('should get "sum" name', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var function_name = AstSearcher.getNameFromFunctionPath(functions_list_path[0]);
      h.expect(function_name).to.equal('sum');
    });

    it('should get name from variable declaration associated to function', function() {
      var sourceCode = new SourceCode({ code: [
        'var f1 = function (a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var function_name = AstSearcher.getNameFromFunctionPath(functions_list_path[0]);
      h.expect(function_name).to.equal('f1');
    });

    it('should get name from object declaration', function() {
      var sourceCode = new SourceCode({ code: [
        'var obj = {',
        '  f2: function() {}',
        '};',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var function_name = AstSearcher.getNameFromFunctionPath(functions_list_path[0]);
      h.expect(function_name).to.equal('f2');
    });

  });
  //---------------------------------------------------------------

  describe('getReturnStatementFromFunctionPath:', function () {

    it('should get return expression', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  return a + b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var return_statements_path = AstSearcher.getReturnStatementFromFunctionPath(functions_list_path[0]);

      var sourceCodeReturnExpression = new SourceCode({ ast: return_statements_path[0].value });
      h.expect(sourceCodeReturnExpression.code).to.equal('return a + b;');
    });

    it('should get not get return expression if does not exist', function() {
      var sourceCode = new SourceCode({ code: [
        'function sum(a, b) {',
        '  var result = a + b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var return_statements_path = AstSearcher.getReturnStatementFromFunctionPath(functions_list_path[0]);

      h.expect(return_statements_path).to.deep.equal([]);
    });

    it('should get two returns', function() {
      var sourceCode = new SourceCode({ code: [
        'function max(a, b) {',
        '  if (a => b) return a;',
        '  else return b;',
        '}',
      ].join('\n') });

      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var return_statements_path = AstSearcher.getReturnStatementFromFunctionPath(functions_list_path[0]);

      h.expect(return_statements_path.length).to.deep.equal(2);
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

  describe('getOnLocationFunctionPath:', function () {

    it('should search for one function', function() {
      var sourceCode = new SourceCode({ code: [
        'var number = 5;',
        'var sum = function(a, b) {',
        '  return a + b;',
        '};',
      ].join('\n') });

      h.expect(AstSearcher.getOnLocationFunctionPath(sourceCode.ast, 1, 1)).to.be.null;
      h.expect(AstSearcher.getOnLocationFunctionPath(sourceCode.ast, 3, 1)).to.not.be.null;
    });

  });
  //---------------------------------------------------------------

});
