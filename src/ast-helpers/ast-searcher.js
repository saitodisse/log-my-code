var recast = require('recast');
var ast_types = recast.types;
// var R = require('ramda');

/**
 * AstSearcher (static class)
 * use directly: AstSearcher.getAllFunctionsPaths(souceCode.ast);
 */
module.exports = class AstSearcher {

  constructor() {
    throw new Error('use directly: AstSearcher.searchMainBody(souceCode.ast)');
  }

  /**
   * Search for all functions node on ast
   * @return {ast paths Array}   All functions AST nodes
   */
  static getAllFunctionsPaths(ast) {
    var functions_list_path = [];
    ast_types.visit(ast, {
      visitFunction: function(path) {
        functions_list_path.push(path);
        this.traverse(path);
      },
    });
    return functions_list_path;
  }

  /**
   * Search for a functions on specified location
   * @return {ast path}   the function node
   */
  static getOnLocationFunctionPath(ast, current_line, current_column) {
    var selected_function_path = null;
    var _isLocInsideFunction = this._isLocInsideFunction;
    ast_types.visit(ast, {
      visitFunction: function(path) {
        var node = path.node;
        var loc = node.loc;

        // loc start check
        if (_isLocInsideFunction(current_line, current_column, loc)) {
          selected_function_path = path;
          return false;
        } else {
          this.traverse(path);
        }
      },
    });
    return selected_function_path;
  }

  /**
   * Check if current_line, current_column is inside a location
   * @return {Boolean}   isInside?
   */
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
  static getNameFromFunctionPath(func_path) {
    var func_ast = func_path.node;
    if (func_ast.id && func_ast.id.name) {
      return func_ast.id.name;
    } else {
      return 'anonymous';
    }
  }

  /**
   * Search function's return expression
   * @return {ast path}   function's return expression AST
   */
  static getReturnStatementFromFunctionPath(func_ast) {
    var paths_to_return = [];

    ast_types.visit(func_ast, {
      visitReturnStatement: function(path) {
        paths_to_return.push(path);
        this.traverse(path);
      },
    });

    return paths_to_return;
  }

};
