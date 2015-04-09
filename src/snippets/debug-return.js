import { SourceCode }  from 'castborg';

class DebugReturnSnippet {
  constructor(return_statement_code) {
    if (!return_statement_code) {
      return_statement_code = "'no_ret'";
    }

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
    var source_code = new SourceCode( {code: this._from_code} );
    return source_code.ast.program.body;
  }
}

module.exports = DebugReturnSnippet;
