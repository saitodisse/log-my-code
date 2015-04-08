var recast = require('recast');

class DebugReturnSnippet {
  constructor(return_statement_code) {
    this._from_code = [
      "__debug_data__.return_data = (" + return_statement_code + ");",
      "__astLoggerPrint__(debug, __debug_data__);",
      "return __debug_data__.return_data;",
    ].join('\n');
  }

  /**
  [ { type: 'ExpressionStatement',
    expression: [Object],
    loc: [Object] },
  { type: 'ExpressionStatement',
    expression: [Object],
    loc: [Object] },
  { type: 'ReturnStatement',
    argument: [Object],
    loc: [Object] } ]
   */
  get ast() {
    var full_ast = recast.parse(this._from_code);
    return full_ast.program.body;
  }
}

module.exports = DebugReturnSnippet;
