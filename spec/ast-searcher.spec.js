import h from './spec-helper';
import AstSearcher from '../src/ast-searcher';

/**
 * ast-logger spec example
 * uses mocha and chai
 */
describe('AstSearcher', function() {

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

  it('should insert a console.log(arguments) on body of a function', function() {
    astSearcher.original_code = [
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n');

    astSearcher.insertConsole();
    h.expect(astSearcher.code).to.eql([
      'var sum = function(a, b) {',
      '  console.log(arguments);',
      '  return a + b;',
      '}',
    ].join('\n'));
  });

  it('should insert a console.log(arguments) on various functions', function() {
    astSearcher.original_code = [
      'var sum = function(a, b) {',
      '  return a + b;',
      '};',
      '',
      'function sum2(a, b) {',
      '  return a + b;',
      '};',
      '',
      'class Sum3 {',
      '  constructor(a, b) {',
      '    return a + b;',
      '  }',
      '};',
      '',
    ].join('\n');

    astSearcher.insertConsole();
    h.expect(astSearcher.code).to.eql([
      'var sum = function(a, b) {',
      '  console.log(arguments);',
      '  return a + b;',
      '};',
      '',
      'function sum2(a, b) {',
      '  console.log(arguments);',
      '  return a + b;',
      '};',
      '',
      'class Sum3 {',
      '  constructor(a, b) {',
      '    console.log(arguments);',
      '    return a + b;',
      '  }',
      '};',
      '',
    ].join('\n'));
  });

});
