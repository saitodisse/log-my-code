var R = require('ramda');

import { SourceCode, AstSearcher, AstModifier, printCode }  from 'castborg';

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

    printCode('initial', sourceCode.code);

    // get all functions
    var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
    R.map(function (func_path) {
      var return_argument_ast, return_argument_source_code, return_statement_code;

      var func = func_path.node;

      printCode('func', func);

      // get function's name
      var func_name = AstSearcher.getNameFromFunctionPath(func_path);

      // get snippet AST
      var line = (func_path.node.loc && func_path.node.loc.start.line) || null;
      if (line === null) {
        // try get location from mother
        line = (func_path.parent.node.loc && func_path.parent.node.loc.start.line) || null;
      }

      // get current return statement (TODO: more them one return statement)
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

      printCode('replaceFunctionReturnWithSnippet', func);

    }, R.reverse(functions_list_path));

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
