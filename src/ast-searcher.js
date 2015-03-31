// var _ = require('lodash');

var recast = require('recast');
var ConsoleLogSnippet = require('./snippets/console.log');

/**
 * AstSearcher
 */
class AstSearcher {

  constructor() {
    this._original_code = null;
    this._ast = null;
  }

  set original_code(string_code) {
    this._original_code = string_code;
    this._ast = recast.parse(string_code);
  }

  get original_code() {
    return this._original_code;
  }

  get ast() {
    return this._ast;
  }

  get code() {
    return recast.print(this.ast).code;
  }

  insertConsole() {
    var types = recast.types;
    types.visit(this.ast, {
      visitFunction: function(path) {
        var node = path.node;
        var consoleLogSnippet = new ConsoleLogSnippet();
        node.body.body.unshift(consoleLogSnippet.ast);
        this.traverse(path);
      },
    });
  }

}

module.exports = AstSearcher;
