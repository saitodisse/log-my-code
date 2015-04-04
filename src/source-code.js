var recast = require('recast');
var fileUtils = require('./file-utils');
var bb = require('bluebird');
var spawn = bb.coroutine;

var instructions = [
  'You should create SourceCodeFile instance with code or filename:',
  ' code: `new SourceCodeFile( { code: \'var a = 1;\' } )`',
  ' file: `new SourceCodeFile( { file: \'./full/path/to/file.js\' } )`',
].join(' ');

/**
 * SourceCode
 */
class SourceCode {

  constructor(opts) {
    this.__code = null;
    this.__ast = null;

    // validate
    var doesNotHaveOpt = !opts.file && !opts.code;
    var hasToManyOpts = !opts.file && !opts.code;
    if (doesNotHaveOpt || hasToManyOpts) {
      throw new Error(instructions);
    }

    // from code
    if (opts.code) {
      this.__initialize(opts.code);
    }

    // from file
    if (opts.file) {
      return this.__loadFromFile(opts.file);
    }
  }

  __initialize(code) {
    this.__code = code;
    this.__ast = recast.parse(code);
  }

  // async call.
  // spawn(function* -> returns a promise and can use 'yield'
  __loadFromFile(full_path) {
    return spawn(function* (full_path) {
      var file_content = yield fileUtils.read(full_path);
      this.__initialize(file_content);
      return this;
    }.bind(this))(full_path);
  }

  get code() {
    return this.__code;
  }

  get ast() {
    return this.__ast;
  }

}

module.exports = SourceCode;
