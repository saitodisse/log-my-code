import h from './spec-helper';
import SourceCode from '../src/source-code';

var bb = require('bluebird');
var spawn = bb.coroutine;

/**
 * source-code
 */
describe('SourceCode:', function() {

  var sourceCode;

  beforeEach(function () {
    // this will initialize with a code directly
    var sample_code = [
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return path.resolvea + b;',
      '}',
    ].join('\n');
    sourceCode = new SourceCode({ code: sample_code });
  });

  it('should be instatiable', function() {
    h.expect(sourceCode).to.not.be.undefined;
  });

  it('should have ast', function() {
    h.expect(sourceCode.ast).to.not.be.undefined;
    var bodyArray = sourceCode.ast.program.body;
    h.expect(bodyArray).to.be.an.array;
    h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
    h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');
  });

  it('should have code', function() {
    h.expect(sourceCode.code).to.not.be.undefined;
    h.expect(sourceCode.code).to.equal([
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return path.resolvea + b;',
      '}',
    ].join('\n'));
  });

  it('should load a javascript file (promises)', function() {
    var sourceCodePromise = new SourceCode({ file: __filename });
    sourceCodePromise.then(function (sourceCodeInstance) {
      h.expect(sourceCodeInstance.code).to.not.be.undefined;
      h.expect(sourceCodeInstance.ast).to.not.be.undefined;
    });
  });

  it('should load a javascript file (promises + generators yield)', function() {
    return spawn(function* () {
      sourceCode = yield new SourceCode({ file: __filename });
      h.expect(sourceCode.code).to.not.be.undefined;
      h.expect(sourceCode.ast).to.not.be.undefined;
    })();
  });

  //---------------------------------------------------------------

});
