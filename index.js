module.exports = {
  Instrumenter: require('./lib/src/instrumenter'),
  SourceCode  : require('./lib/src/source-code'),
  FileUtils   : require('./lib/src/file-utils'),
  AstSearcher : require('./lib/src/ast-helpers/ast-searcher'),
  AstInserter : require('./lib/src/ast-helpers/ast-inserter'),
};
