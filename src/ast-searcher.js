// var _ = require('lodash');

var recast = require('recast');
// var _ = require('lodash');
// var ConsoleLogSnippet = require('./snippets/console.log');

/**
 * AstSearcher
 */
class AstSearcher {

  /**
   * Search for main body of the program
   * @return {Array}   main body array AST node
   */
   static searchMainBody(ast) {
    var body = ast.program.body;
    return body;
  }

  /**
   * Search for all functions node on ast
   * @return {Array}   All functions AST nodes
   */
  searchFunctions() {
    var functions_list = [];
    var types = recast.types;
    types.visit(this.ast, {
      visitFunction: function(path) {
        var node = path.node;
        functions_list.push(node);
        this.traverse(path);
      },
    });
    return functions_list;
  }

  /**
   * Search for a functions on specified location
   * @return {ast object}   the function node
   */
  searchFunctionOnLocation(current_line, current_column) {
    var selected_function = null;
    var types = recast.types;
    var _isInside = this._isInside;
    types.visit(this.ast, {
      visitFunction: function(path) {
        var node = path.node;
        var loc = node.loc;

        // loc start check
        if (_isInside(current_line, current_column, loc)) {
          selected_function = node;
          return false;
        } else {
          this.traverse(path);
        }
      },
    });
    return selected_function;
  }

  _isInside(current_line, current_column, loc) {
    // check if is inside lines
    if (current_line < loc.start.line || current_line > loc.end.line) {
      return false;
    }

    // if on first line, check column
    if (current_line === loc.start.line) {
      return current_column >= loc.start.column &&
             current_column <= loc.start.column;
    }

    // if on last line, check column
    if (current_line === loc.end.line) {
      return current_column >= loc.end.column &&
             current_column <= loc.end.column;
    }

    // must be inside
    return true;
  }

  // /**
  //  * Insert an AST on function's body start
  //  * @param {ast object}   function_node    AST node
  //  * @param {ast object}   snippet_ast      AST node
  //  */
  // insertSnippetBeforeFunctionBody(function_node, snippet_ast) {
  //   function_node.body.body.unshift(snippet_ast);
  // }
  //
  // /**
  //  * Insert a console.log(arguments) AST on function's body start
  //  * @param {ast object}   function_node    AST node
  //  */
  // instrumentInsertConsoleLogArgumentsBeforeFunction(function_node, console_content = 'arguments') {
  //   var snippet_instance = new ConsoleLogSnippet(console_content);
  //   this.insertSnippetBeforeFunctionBody(function_node, snippet_instance.ast);
  // }
  //
  // /**
  //  * Insert a console.log(arguments) AST on ALL function's body start
  //  */
  // instrumentInsertConsoleLogArgumentsBeforeAllFunctions(console_content = 'arguments') {
  //   var functions_list = this.searchFunctions();
  //   return _.map( functions_list, function(func_node) {
  //     this.instrumentInsertConsoleLogArgumentsBeforeFunction(func_node, console_content);
  //   }, this);
  // }

}

module.exports = AstSearcher;
