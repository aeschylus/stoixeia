var _ = require('underscore'),
fs = require('fs'),

elementsJSON = JSON.parse(fs.readFileSync('euclidElements.json', 'utf8', function(){ console.log('Beginning dependency tree calculation.'); }));

(function () {
  'use strict';

  var depsJSON = elementsJSON.map(function(book, index) {
    var bookNumber = index + 1;
    return book.propositions.map(function(prop) {
      return {
        book: bookNumber,
        prop: prop.id, 
        propDependencies: prop.deps
      };
    });
  });

  fs.writeFileSync('euclidElementsDeps.json', JSON.stringify(depsJSON));

}());
