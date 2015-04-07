var recast = require('recast');

class RequireDebugSnippet {
  constructor(filename) {
    this._from_code = [
      'var debug = require(\'debug\')(\'' + filename + '\');',
      'var __astLoggerPrint__ = require(\'ast-logger-print\');',
      '',
    ].join('\n');
  }

  get ast() {
    var full_ast = recast.parse(this._from_code);
    return full_ast.program.body;
  }
}

module.exports = RequireDebugSnippet;
