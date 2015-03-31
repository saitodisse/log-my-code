var recast = require('recast');

class ConsoleLogSnippet {
  constructor(param) {
    this._from_code = [
      'console.log(' + param + ')'
    ].join('\n');
  }

  get ast() {
    var full_ast = recast.parse(this._from_code);
    return full_ast.program.body[0];
  }
}

module.exports = ConsoleLogSnippet;
