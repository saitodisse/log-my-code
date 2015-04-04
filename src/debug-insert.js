// var _ = require('lodash');

import AstSearcher  from './ast-searcher';
// var ConsoleLogSnippet = require('./snippets/console.log');

/**
 * DebugInsert
 */
class DebugInsert {

  constructor() {
    this._original_code = null;
    this._ast = null;
    this._searcher = new AstSearcher();
  }

  _addDebugLibRequire(file_name) {
    // find main body
    // var body = AstSearcher.searchMainBody(this._ast);

    // add debug lib snippet with the current filename
    file_name = file_name;
  }

}

module.exports = DebugInsert;
