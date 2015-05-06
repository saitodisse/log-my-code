import h from '../spec-helper';
import Instrumenter from '../../src/instrumenter';
import { SourceCode } from 'castborg';
// var path = require('path');

/**
 * instrumenter (static class)
 */
describe.skip('Complex Real Codes:', function() {
  var instrumentAllFunctions = function (path, callback) {
    var sourceCodePromise = new SourceCode({ file: path });
    sourceCodePromise.then(function (sourceCodeInstance) {
      var new_code = Instrumenter.instrumentAllFunctions(sourceCodeInstance);
      h.expect(new_code).to.not.be.undefined;
      callback();
    });
  };

  it('should instrument lib api.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/api.js', done);
  });

  it('should instrument lib app.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/app.js', done);
  });

  it('should instrument lib balancer.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/balancer.js', done);
  });

  it('should instrument lib client.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/client.js', done);
  });

  it('should instrument lib configure.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/configure.js', done);
  });

  it('should instrument lib index.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/index.js', done);
  });

  it('should instrument lib migrations.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/migrations.js', done);
  });

  it('should instrument lib server.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/server.js', done);
  });

  it('should instrument lib ssh.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/ssh.js', done);
  });

  it('should instrument lib tools.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/tools.js', done);
  });

  it('should instrument lib vm.js', function(done) {
    instrumentAllFunctions('/home/julio/_git/azk/lib/azk/agent/vm.js', done);
  });
});
