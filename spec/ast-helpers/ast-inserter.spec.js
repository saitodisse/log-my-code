import h from '../spec-helper';
import AstInserter from '../../src/ast-helpers/ast-inserter';
import AstSearcher from '../../src/ast-helpers/ast-searcher';

// import RequireDebugSnippet from '../../src/snippets/require-debug';
import DebugDataSnippet    from '../../src/snippets/debug-data';
import DebugReturnSnippet    from '../../src/snippets/debug-return';

import SourceCode from '../../src/source-code';

/**
 * debug-insert
 */
describe('AstInserter:', function() {

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new AstInserter()) ).to.throw(Error);
  });
  //---------------------------------------------------------------

  describe('insertSnippetBeforeFunctionBody:', function () {

    it('should insert console log before', function() {

      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var first_function_ast = functions_list[0];

      // get snippet AST
      var snippet_instance = new DebugDataSnippet('FUNCTION_NAME', first_function_ast.loc.start.line);
      var snippet_ast = snippet_instance.ast;

      // ! insert Snippet Before Function Body
      AstInserter.insertSnippetBeforeFunctionBody(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  var __debug_data__ = {",
        "    name: 'FUNCTION_NAME',",
        "    arguments: arguments,",
        "    line: {original_line: 1}",
        "  };",
        "",
        "  return a + b;",
        "}",
      ].join('\n'));

    });

  });
  //---------------------------------------------------------------

  describe('Insert return statement:', function () {

    it('should insert snippet on return statement', function() {
      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var first_function_ast = functions_list[0];

      // get snippet AST
      var snippet_instance = new DebugReturnSnippet('a + b');
      var snippet_ast = snippet_instance.ast;

      // ! insert Snippet On Return Function
      AstInserter.replaceFunctionReturnWithSnippet(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  __debug_data__.return_data = (a + b);",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}",
      ].join('\n'));

    });

    it('should insert on last line if no return was found', function() {
      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  this.result = a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list = AstSearcher.searchFunctions(sourceCode.ast);
      var first_function_ast = functions_list[0];

      // get snippet AST
      var snippet_instance = new DebugReturnSnippet('a + b');
      var snippet_ast = snippet_instance.ast;

      // ! insert Snippet On Return Function
      AstInserter.replaceFunctionReturnWithSnippet(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  this.result = a + b;",
        "  __debug_data__.return_data = (a + b);",
        "  __astLoggerPrint__(debug, __debug_data__);",
        "  return __debug_data__.return_data;",
        "}",
      ].join('\n'));

    });

  });
  //---------------------------------------------------------------
});
