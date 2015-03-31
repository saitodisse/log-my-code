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

});
