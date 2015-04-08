// var R = require('ramda');

import AstSearcher  from './ast-helpers/ast-searcher';
import AstInserter  from './ast-helpers/ast-inserter';
import SourceCode  from './source-code';

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

    var new_ast = AstInserter.insertSnippetBeforeMainProgramBody(sourceCode.ast, snippet_ast);
    var source_code_new = new SourceCode({ ast: new_ast });

    return source_code_new.code;
  }

  static addDebugToAllFunctionsCalls(sourceCode) {

    // get all functions
    var allFunctions = AstSearcher.searchFunctions(sourceCode.ast);

    allFunctions.forEach(function (func) {
      // get function's name
      var func_name = AstSearcher.searchFunctionName(func);

      // get snippet AST
      var line = func.loc && func.loc.start.line;
      var snippet_instance = new DebugDataSnippet(func_name, line);
      var snippet_ast = snippet_instance.ast;

      AstInserter.insertSnippetBeforeFunctionBody(func, snippet_ast);
    });

    var source_code_new = new SourceCode({ ast: sourceCode.ast });

    return source_code_new.code;
  }

  static addDebugToAllFunctionsReturnStatements(sourceCode) {

    // get all functions
    var allFunctions = AstSearcher.searchFunctions(sourceCode.ast);

    allFunctions.forEach(function (func) {

      // get current return statement
      var return_statement_path = AstSearcher.searchFunctionReturnExpression(func);

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
      AstInserter.replaceFunctionReturnWithSnippet(func, snippet_ast);
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
