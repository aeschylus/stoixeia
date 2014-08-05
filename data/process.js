var _ = require('underscore'),
x2j = require('xml2json'),
fs = require('fs'),
$ = require('jquery');

// var book1 = book1 = fs.readFileSync('book1.html', 'utf8', function(){ console.log('did something'); });
var elementsXML = fs.readFileSync('euclid.xml', 'utf8', function(){ console.log('did something'); });

(function () {
  'use strict';

  var env = require('jsdom').env;

  // first argument can be html string, filename, or url
  env(elementsXML, function (errors, window) {

    var $ = require('jquery')(window),

    elements = [];

    $('div1[type="book"]').each(function(index, book) {

      var bookObj = {
        definitions: null,
        postulates: null,
        commonNotions: null,
        propositions: []
      };

      $(book).find('div2[n="Prop"]').find('div3').each(function(index, item) {
        item = $(item);


        var prop = {
          id: item.attr('id'),
          title: item.find('head').text(),
          deps: extractDeps(item),
          enunciation: extractEnunc(item),
          proof: extractProof(item),
          qed: extractQed(item),
          notes: extractNotes(item)
        };
        
        if (index !== 1) {
          prop = {
            id: item.attr('id'),
            title: item.find('head').text(),
            deps: extractDepsFromDumbText(item),
            text: extractDumbText(item),
            notes: extractNotes(item)
          };
        }

        bookObj.propositions.push(prop);
      });

      elements.push(bookObj);

    });

    var elementsJson = JSON.stringify(elements, null, 4);

    fs.writeFileSync('euclidElements.json', elementsJson);


    function extractDeps(xmlTurd) {
      var deps = [];
      var refElements = xmlTurd.find('div4[type="Proof"]').find('ref');
      refElements.each(function(index, ref) {
        deps.push($(ref).attr('target'));
      });
      return deps;
    }

    function extractDepsFromDumbText(xmlTurd) {
      var deps = [];
      var refElements = xmlTurd.find('ref');
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
    
    function extractDumbText(xmlTurd) {
      return xmlTurd.html();
    }

    function extractQed(xmlTurd) {
      return xmlTurd.find('div4[type="QED"]').html();
    }

    function extractNotes(xmlTurd) {
      return xmlTurd.find('div4[type="note"]').html();
    }

  });
}());
