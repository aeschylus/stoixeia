var _ = require('underscore'),
x2j = require('xml2json'),
fs = require('fs'),
$ = require('jquery');

var book1 = book1 = fs.readFileSync('book1.html', 'utf8', function(){console.log('did somehting');});

(function () {
  'use strict';

  var env = require('jsdom').env;

  // first argument can be html string, filename, or url
  env(book1, function (errors, window) {

    var $ = require('jquery')(window),
    elemnts = {},
    book = {};

    $('div2').eq(3).find('div3').each(function(index, item) {
      item = $(item);

      var prop = {
        deps: extractDeps(item),
        enunciation: extractEnunc(item),
        proof: extractProof(item),
        qed: extractQed(item),
        notes: extractNotes(item)
      };
      
      book[item.attr('id')] = prop;
    });

    function extractDeps(xmlTurd) {
      var deps = [];
      var refElements = xmlTurd.find('div4[type="Proof"]').find('ref');
      refElements.each(function(index, ref) {
        deps.push($(ref).attr('target'));
      });
      return deps;
    }
    
    function extractEnunc(xmlTurd) {
      return xmlTurd.find('div4[type="Enunc"]').html();
    }

    function extractProof(xmlTurd) {
      return xmlTurd.find('div4[type="Proof"]').html();
    }
    
    function extractQed(xmlTurd) {
      return xmlTurd.find('div4[type="QED"]').html();
    }

    function extractNotes(xmlTurd) {
      return xmlTurd.find('div4[type="note"]').html();
    }

    console.log(book);

  });
}());
