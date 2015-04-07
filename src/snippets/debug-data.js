var recast = require('recast');

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
    var full_ast = recast.parse(this._from_code);
    return full_ast.program.body;
  }
}

module.exports = DebugDataSnippet;
