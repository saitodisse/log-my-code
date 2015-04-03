import h from './spec-helper';
import DebugInsert from '../src/debug-insert';

/**
 * debug-insert
 */
describe('DebugInsert:', function() {

  // beforeEach(function () {
  //   debugInsert = new DebugInsert();
  // });

  it('should be instatiable', function() {
    var debugInsert = new DebugInsert();
    h.expect(debugInsert).to.not.be.undefined;
  });
  //---------------------------------------------------------------

});
