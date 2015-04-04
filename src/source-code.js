var recast = require('recast');
var fileUtils = require('./file-utils');
var bb = require('bluebird');

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
    this.__file_path = null;

    // validate
    var doesNotHaveOpt = !opts.file && !opts.code && !opts.ast;
    if (doesNotHaveOpt) {
      throw new Error(instructions);
    }

    // from code string
    if (opts.code) {
      this.__initialize(opts.code, null);
    }

    // from source-code file
    if (opts.file) {
      this.__file_path = opts.file;
      return this.__loadFromFile(opts.file);
    }

    // from ast string
    if (opts.ast) {
      this.__initialize(null, opts.ast);
    }
  }

  __initialize(code, ast) {
    if (code) {
      this.__code = code;
      this.__ast = recast.parse(code);
    } else if (ast) {
      this.__ast = ast;
      this.__code = recast.print(ast).code;
    }
  }

  // async call.
  // bb.coroutine(function* -> returns a promise and can use 'yield'
  __loadFromFile(full_path) {
    return bb.coroutine(function* (full_path) {
      var file_content = yield fileUtils.read(full_path);
      this.__initialize(file_content, null);
      return this;
    }.bind(this))(full_path);
  }

  get code() {
    return this.__code;
  }

  get ast() {
    return this.__ast;
  }

  get filepath() {
    return this.__file_path;
  }

}

module.exports = SourceCode;
