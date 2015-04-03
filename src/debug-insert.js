// var _ = require('lodash');

import AstSearcher from './ast-searcher';
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

}

module.exports = DebugInsert;
