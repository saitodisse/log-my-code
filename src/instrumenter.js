var R = require('ramda');
var debug = require('debug')('logmycode:instrumenter');

import { SourceCode, AstSearcher, AstModifier, hightLightCode, hightLightAST } from 'castborg';

var DebugReturnSnippet  = require('./snippets/debug-return');

/**
 * Instrumenter (static class)
 * use directly: Instrumenter.addDebugRequire(sourceCode);
 */
class Instrumenter {

  constructor() {
    throw new Error('use directly: Instrumenter.addDebugRequire(sourceCode);');
  }

  static _checkReturnWasInstrumented(ast) {
    var is_debug_print_require = ast         &&
      ast.type === 'CallExpression'          &&
      ast.callee                             &&
      ast.callee.object                      &&
      ast.callee.object.arguments            &&
      ast.callee.object.arguments.length > 0 &&
      ast.callee.object.arguments[0].value === 'debug-print';

    return is_debug_print_require;
  }

  static addDebugToAllFunctionsReturnStatements(sourceCode) {

    // debug('addDebugToAllFunctionsReturnStatements()');
    // debug(hightLightCode('sourceCode', sourceCode.code));

    // get all functions
    var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
    R.map(function (func_path) {
      var return_argument_ast, return_argument_source_code, return_statement_code;

      var func = func_path.node;

      // get function's name
      var func_name = AstSearcher.getNameFromFunctionPath(func_path);

      debug('> next function:');
      debug(hightLightCode(func_name, func));

      // get snippet AST
      var line = (func_path.node.loc && func_path.node.loc.start.line) || null;
      if (line === null) {
        // try get location from mother
        line = (func_path.parent.node.loc && func_path.parent.node.loc.start.line) || null;
      }

      // get current return statement (TODO: more them one return statement)
      var return_statement_path = AstSearcher.getReturnStatementFromFunctionPath(func);
      var has_return_statement = return_statement_path.length > 0;
      debug('has_return_statement:');
      debug(has_return_statement);

      var return_argument = has_return_statement && return_statement_path[0].value.argument;

      debug(hightLightCode('return_argument', return_argument));

      // check if return was instrumented before
      var was_intrumented = Instrumenter._checkReturnWasInstrumented(return_argument);
      debug('> was_intrumented:');
      debug(was_intrumented);
      // do not instrument again
      if (!was_intrumented) {
        var hasReturn = false;
        if (return_statement_path.length > 0) {
          // has return statement
          return_argument_ast = return_statement_path[0].value.argument;

          try {
            return_argument_source_code = new SourceCode({ ast: return_argument_ast });
          } catch (err) {
            debug('Error parsing AST', err.message);
            debug(hightLightAST(return_argument_ast));
            throw err;
          }

          return_statement_code = return_argument_source_code.code;
          hasReturn = true;
        }

        // get snippet AST
        var snippet_instance = new DebugReturnSnippet(hasReturn, func_name, line, return_statement_code);
        var snippet_ast = snippet_instance.ast;

        // insert Snippet On Return Function
        AstModifier.insertSnippetBeforeReturns(func, snippet_ast);
      }

    }, R.reverse(functions_list_path)); // reverse order, first functions most inside

    var source_code_new = new SourceCode({ ast: sourceCode.ast });

    debug(hightLightCode('source_code_new', source_code_new));

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
