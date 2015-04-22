import { SourceCode }  from 'castborg';

class DebugReturnSnippet {
  constructor(function_name = "anonymous", original_line_number = -1, return_statement_code = "'VOID'") {
    this._from_code = [
      "return require('debug-print').debug({ name: '",
      function_name,
      "', arguments: arguments, line: {original_line: ",
      original_line_number,
      "},",
      "\n  return_data: (",
      return_statement_code,
      ") }, __filename);"
    ].join('');
  }

  get ast() {
    var source_code = new SourceCode( {code: this._from_code} );
    return source_code.ast.program.body;
  }
}

module.exports = DebugReturnSnippet;
