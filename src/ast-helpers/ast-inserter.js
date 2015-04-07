// var _ = require('lodash');

import AstSearcher from './ast-searcher';
// var RequireDebugSnippet = require('./snippets/require-debug');

/**
 * AstInserter (static class)
 * use directly: AstInserter.addDebugRequireOnTop(souceCode.ast);
 */
class AstInserter {

  constructor() {
    throw new Error('use directly: AstInserter.addDebugRequireOnTop(souceCode.ast);');
  }

  /**
   * Insert an AST on main program body start
   * @param {ast object}   original_ast     AST node
   * @param {ast object}   snippet_ast      AST node
   */
  static insertSnippetBeforeMainProgramBody(original_ast, snippet_ast) {
    var original_body_ast = AstSearcher.searchMainBody(original_ast);
    original_body_ast = snippet_ast.concat(original_body_ast);
    original_ast.program.body = original_body_ast;
    return original_ast;
  }

  /**
   * Insert an AST on function's body start
   * @param {ast object}   function_node      AST node
   * @param {ast object}   snippet_ast      AST node
   */
   static insertSnippetBeforeFunctionBody(function_node, snippet_ast) {
    function_node.body.body.unshift(snippet_ast);
  }

  // /**
  //  * Insert a console.log(arguments) AST on function's body start
  //  * @param {ast object}   function_node    AST node
  //  */
  // static instrumentInsertConsoleLogArgumentsBeforeFunction(function_node, console_content = 'arguments') {
  //   var snippet_instance = new ConsoleLogSnippet(console_content);
  //   this.insertSnippetBeforeFunctionBody(function_node, snippet_instance.ast);
  // }
  //
  // /**
  //  * Insert a console.log(arguments) AST on ALL function's body start
  //  */
  // static instrumentInsertConsoleLogArgumentsBeforeAllFunctions(console_content = 'arguments') {
  //   var functions_list = this.searchFunctions();
  //   return _.map( functions_list, function(func_node) {
  //     this.instrumentInsertConsoleLogArgumentsBeforeFunction(func_node, console_content);
  //   }, this);
  // }

}

module.exports = AstInserter;
