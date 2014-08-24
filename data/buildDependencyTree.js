var _ = require('underscore'),
fs = require('fs'),

elementsJSON = JSON.parse(fs.readFileSync('euclidElements.json', 'utf8', function(){ console.log('Beginning dependency tree calculation.'); }));

(function () {
  'use strict';
  
  if ( !String.prototype.contains ) {
        String.prototype.contains = function() {
                  return String.prototype.indexOf.apply( this, arguments ) !== -1;
                      
        };
  }

  var depsJSON = elementsJSON.map(function(book, index) {
    var bookNumber = index + 1;
    return book.propositions.map(function(prop) {
      return {
        book: bookNumber,
        prop: prop.id, 
        propDependencies: prop.deps.filter(function(dep) {
          console.log(typeof dep);
          if (dep.contains('post') || dep.contains('def') || dep.contains('c')) {
            return false;
          }
          return true;
        }),
        axiomDependencies: prop.deps.filter(function(dep) {
          if (dep.contains('post') || dep.contains('def') || dep.contains('c')) {
            return true;
          }
          return false;
        })
      };
    });
  }),
  mergedDeps = [],
  mergedDeps = mergedDeps.concat.apply(mergedDeps, depsJSON),
  nodeIndex = (function() {
    var nodeIndex = {};
    mergedDeps.forEach(function(node, index) {
      nodeIndex[node.prop] = index;
    });
    console.log(nodeIndex);
    return nodeIndex;
  })(),
  nodesAndLinks = {
    nodes: mergedDeps,
    links: mergedDeps.map(function(node) {
      return node.propDependencies.map(function(dep, depIndex) {
        return {
          source: nodeIndex[node.prop],
          target: nodeIndex[dep]
        }
      });
    }).reduce(function(propAlinks, propBlinks) {
      return propAlinks.concat(propBlinks);
    })
  };

  fs.writeFileSync('euclidElementsDeps.json', JSON.stringify(nodesAndLinks));

}());
