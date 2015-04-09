// var R = require('ramda');

import { SourceCode, AstSearcher, AstModifier }  from 'castborg';

var RequireDebugSnippet = require('./snippets/require-debug');
var DebugDataSnippet    = require('./snippets/debug-data');
var DebugReturnSnippet  = require('./snippets/debug-return');

/**
 * Instrumenter (static class)
 * use directly: Instrumenter.addDebugRequire(sourceCode);
 */
class Instrumenter {

  constructor() {
    throw new Error('use directly: Instrumenter.addDebugRequire(sourceCode);');
  }

  static addDebugRequire(sourceCode) {

    // get snippet AST
    var snippet_instance = new RequireDebugSnippet(sourceCode.filepath);
    var snippet_ast = snippet_instance.ast;

    var new_ast = AstModifier.insertSnippetBeforeMainProgramBody(sourceCode.ast, snippet_ast);
    var source_code_new = new SourceCode({ ast: new_ast });

    return source_code_new.code;
  }

  static addDebugToAllFunctionsCalls(sourceCode) {

    // get all functions
    var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);

    functions_list_path.forEach(function (func_path) {
      // get function's name
      var func_name = AstSearcher.getNameFromFunctionPath(func_path);

      // get snippet AST
      var line = func_path.node.loc && func_path.node.loc.start.line;
      var snippet_instance = new DebugDataSnippet(func_name, line);
      var snippet_ast = snippet_instance.ast;

      AstModifier.insertSnippetBeforeFunctionBody(func_path.node, snippet_ast);
    });

    var source_code_new = new SourceCode({ ast: sourceCode.ast });

    return source_code_new.code;
  }

  static addDebugToAllFunctionsReturnStatements(sourceCode) {

    // get all functions
    var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);

    functions_list_path.forEach(function (func_path) {
      var func = func_path.node;

      // get current return statement
      var return_statement_path = AstSearcher.getReturnStatementFromFunctionPath(func);

      var return_argument_ast, return_argument_source_code, return_statement_code = '';

      if (return_statement_path.length > 0) {
        return_argument_ast = return_statement_path[0].value.argument;
        return_argument_source_code = new SourceCode({ ast: return_argument_ast });
        return_statement_code = return_argument_source_code.code;
      }

      // get snippet AST
      var snippet_instance = new DebugReturnSnippet(return_statement_code);
      var snippet_ast = snippet_instance.ast;

      // insert Snippet On Return Function
      AstModifier.replaceFunctionReturnWithSnippet(func, snippet_ast);
    });

    var source_code_new = new SourceCode({ ast: sourceCode.ast });
    return source_code_new.code;
  }

  static instrumentAllFunctions(sourceCode) {
    // require
    Instrumenter.addDebugRequire(sourceCode);

    // func info
    Instrumenter.addDebugToAllFunctionsCalls(sourceCode);

    // func return
    Instrumenter.addDebugToAllFunctionsReturnStatements(sourceCode);

    // get new code
    var source_code_new = new SourceCode({ ast: sourceCode.ast });
    return source_code_new.code;
  }

}

module.exports = Instrumenter;
