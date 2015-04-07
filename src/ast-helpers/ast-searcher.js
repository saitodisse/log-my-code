var recast = require('recast');

/**
 * AstSearcher (static class)
 * use directly: AstSearcher.searchMainBody(souceCode.ast);
 */
module.exports = class AstSearcher {

  constructor() {
    throw new Error('use directly: AstSearcher.searchMainBody(souceCode.ast)');
  }

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
   static searchFunctions(ast) {
    var functions_list = [];
    var types = recast.types;
    types.visit(ast, {
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
   static searchFunctionOnLocation(ast, current_line, current_column) {
    var selected_function = null;
    var types = recast.types;
    var _isLocInsideFunction = this._isLocInsideFunction;
    types.visit(ast, {
      visitFunction: function(path) {
        var node = path.node;
        var loc = node.loc;

        // loc start check
        if (_isLocInsideFunction(current_line, current_column, loc)) {
          selected_function = node;
          return false;
        } else {
          this.traverse(path);
        }
      },
    });
    return selected_function;
  }

  static _isLocInsideFunction(current_line, current_column, loc) {
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

  /**
   * Search function name
   * @return {string}   function name
   */
  static searchFunctionName(func_ast) {
    if (func_ast.id && func_ast.id.name) {
      return func_ast.id.name;
    } else {
      return 'anonymous';
    }
  }

  /**
   * Search function's return expression
   * @return {AST}   function's return expression AST
   */
  static searchFunctionReturnExpression(func_ast) {
    var return_statements = [];
    var types = recast.types;
    types.visit(func_ast, {
      visitReturnStatement: function(path) {
        return_statements.push(path.value);
        this.traverse(path);
      },
    });
    return return_statements;
  }

};
