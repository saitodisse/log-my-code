import { SourceCode }  from 'castborg';

class DebugReturnSnippet {
  constructor(function_name, original_line_number, return_statement_code) {
    if (!return_statement_code) {
      return_statement_code = "'no_ret'";
    }

    // jscs:disable maximumLineLength
    this._from_code = [
      "var __return__ = require('debug-print').debug({ name: '" + function_name + "', arguments: arguments, line: {original_line: " + original_line_number + "}, return_data: " + return_statement_code + " }, __filename);",
      "return __return__;",
    ].join('\n');
    // jscs:enable maximumLineLength
  }

  get ast() {
    var source_code = new SourceCode( {code: this._from_code} );
    return source_code.ast.program.body;
  }
}

module.exports = DebugReturnSnippet;
