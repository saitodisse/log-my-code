// var R = require('ramda');

import { SourceCode, AstSearcher, AstModifier }  from 'castborg';

var DebugReturnSnippet  = require('./snippets/debug-return');

/**
 * Instrumenter (static class)
 * use directly: Instrumenter.addDebugRequire(sourceCode);
 */
class Instrumenter {

  constructor() {
    throw new Error('use directly: Instrumenter.addDebugRequire(sourceCode);');
  }

  static addDebugToAllFunctionsReturnStatements(sourceCode) {

    // get all functions
    var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);

    functions_list_path.forEach(function (func_path) {
      var func = func_path.node;

      // get function's name
      var func_name = AstSearcher.getNameFromFunctionPath(func_path);

      // get snippet AST
      var line = func_path.node.loc && func_path.node.loc.start.line;

      // get current return statement (TODO: more them one return statement)
      var return_argument_ast, return_argument_source_code, return_statement_code;
      var return_statement_path = AstSearcher.getReturnStatementFromFunctionPath(func);
      if (return_statement_path.length > 0) {
        return_argument_ast = return_statement_path[0].value.argument;
        return_argument_source_code = new SourceCode({ ast: return_argument_ast });
        return_statement_code = return_argument_source_code.code;
      }

      // get snippet AST
      var snippet_instance = new DebugReturnSnippet(func_name, line, return_statement_code);
      var snippet_ast = snippet_instance.ast;

      // insert Snippet On Return Function
      AstModifier.replaceFunctionReturnWithSnippet(func, snippet_ast);
    });

    var source_code_new = new SourceCode({ ast: sourceCode.ast });
    return source_code_new.code;
  }

  static instrumentAllFunctions(sourceCode) {
    // func return
    Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);

    // get new code
    var source_code_new = new SourceCode({ ast: sourceCode.ast });
    return source_code_new.code;
  }

}

module.exports = Instrumenter;
