// var _ = require('lodash');

import AstInserter  from './ast-helpers/ast-inserter';
import SourceCode  from './source-code';
var RequireDebugSnippet = require('./snippets/require-debug');

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
}

module.exports = Instrumenter;
