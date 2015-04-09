import { SourceCode }  from 'castborg';

class DebugDataSnippet {
  constructor(function_name, original_line_number) {
    this._from_code = [
      "var __debug_data__ = {",
      "  name: '" + function_name + "',",
      "  arguments: arguments,",
      "  line: {original_line: " + original_line_number + "}",
      "};",
      "",
      "",
    ].join('\n');
  }

  get ast() {
    var source_code = new SourceCode( {code: this._from_code} );
    return source_code.ast.program.body;
  }
}

module.exports = DebugDataSnippet;
