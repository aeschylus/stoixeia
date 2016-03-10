$(function() {

  var nodes = null,
      connections = null,
      propositions = {},
      focusedProposition = 'elem.1.1',
      focusedDependencies = [],
      currentLayout = hairballLayout;


  var width = window.innerWidth,
      height = window.innerHeight;

  var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

  var container = svg.append('g');

  var fill = d3.scale.category10();
  var zoom = d3.behavior.zoom()
        .scaleExtent([0.2, 10])
        .on("zoom", zoomed);

  function zoomed() {
    container.attr("transform",
                   "translate(" + zoom.translate() + ") " +
                   "scale(" + zoom.scale() + ")"
                  );
  }

  svg.call(zoom);

  var force = d3.layout.force()
        .gravity(0.23)
        .charge(-230)
        .distance(200)
        .size([width, height]);

  d3.json("data/euclidElements.json", function(json) {
    var propositionsArray = [].concat.apply([],
                                   json.map(function(book){
                                     return book.propositions;
                                   }).concat([])
                                  );
    propositionsArray.forEach(function(prop) {
      propositions[prop.id] = prop;
    });
  });

  d3.json("data/euclidElementsDeps.json", function(json) {
    nodes = json.nodes;
    connections = json.links.filter(function(link, index){
      return link.target;
    });

    hairballLayout(nodes,connections);
  });

  function hairballLayout() {
    nodes.forEach(function(node) {
      node.x = undefined;
      node.y = undefined;
    });
    var link = container.selectAll(".link")
          .data(connections);

    link.enter().append("line")
      .attr("class", "link");

    var node = container.selectAll("g.node")
          .data(nodes);
          // .style ('fill-opacity', function() {

          // })
          // .style('');

    var nodeEnter = node
          .enter().append("g")
          .attr("class", 'node');

    container.selectAll('.bookTitle')
      .transition()
      .style('opacity', 0)
      .remove();

    nodeEnter.append('circle')
      .style("fill", function(d, i) { return fill(d.book); })
      .attr("x", 0)
      .attr("y", 0)
      .attr("r", 7);

    nodeEnter.append("text")
      .attr("dx", 6)
      .attr("dy", "-.3em")
      .text(function(d) {
        return d.prop.split('.')[2];
      });

    node.on("mouseover", fade(0.08)).on("mouseout", fade(1));
    // node.on("mouseenter", focusProposition);
    node.on("click", displayProp);

    force
      .nodes(nodes)
      .links(connections)
      .on("tick", tick);

    force.start();

    var dependencies = function (d) {return d.propDependencies;};


    function tick(d) {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function fade(opacity) {
      // Sets the opacity of the link and node elements based on the value of the "isConnected" function.
      return function(d) {
        node
          .style("stroke-opacity", opacity)
          .style("fill-opacity", opacity)
          .filter(function(o) {
            var isDependency = d.propDependencies.filter(function(dep){
              return o.prop === dep;
            });
            console.log(isDependency);
            return o.prop === d.prop || isDependency.length > 0;
          })
          .style("stroke-opacity", 1)
          .style("fill-opacity", 1);

        link
          .style("stroke-opacity", opacity)
          .filter(function(o){
            return o.source === d;
          })
          .style("stroke-opacity", 1)
          .style("stroke-width", 4);
      };
    }
  }

  function columnLayout() {
    force.stop();

    nodes.forEach(function(node) {
      node.x = (node.book * 250)-50;
      node.y = 100 + (parseInt(node.prop.split('.')[2]) * 35);
    });

    var books = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    container.selectAll('.node')
      .data(nodes)
      .transition()
      .duration(2000)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    container.selectAll('.bookTitle')
      .data(books)
      .enter()
      .append('text')
      .attr('class', 'bookTitle')
      .attr("dx", function(d) {
        return (d * 250)-50;
      })
      .attr("dy", 100)
      .text(function(d) {
        return 'Book ' + d;
      })
      .style('opacity', 0)
      .transition()
      .duration(2000)
      .style('opacity', 1);

    container.selectAll('.node text')
      .transition()
      .duration(2000)
      .attr("dx", -13)
      .attr("dy", 6)
      .attr("class", 'overview')
      .text(function(d){
        return d.prop.split('.')[2];
      });

    container.selectAll('.link')
      .transition()
      .duration(2000)
      .attr("x1", function(d) {
        return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    console.log('shifting');
    zoomTo();
  }

  function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(2000).tween("zoom", function () {
      var iTranslate = d3.interpolate(zoom.translate(), translate),
          iScale = d3.interpolate(zoom.scale(), scale);
      return function (t) {
        zoom
          .scale(iScale(t))
          .translate(iTranslate(t));
        zoomed();
      };
    });
  }

  function zoomTo() {
    var translate = zoom.translate(),
        scale = 0.42,
        view = {x: 0, y: 0, k: scale};

    interpolateZoom([view.x, view.y], view.k);
  }

  function displayProp(e) {
    // console.log(e);
    // console.log(propositions[e.prop]);

    // $('<div>').addClass('focusedProp').html(propositions[e.prop].text).prependTo('body');
    // $('.focusedProp').flowtype({
    //   fontRatio:30
    // });

    // e.propDependencies.forEach(function(propId) {
    //   $('<div>').addClass('requiredProps').html(propositions[propId].text).prependTo('body');
    //   $('.requiredProps').flowtype({
    //     fontRatio:30
    //   });
    // });
  }

  var eventMappings = {
    'l': function() { console.log('L'); },
    'k': function() { console.log('K'); },
    'j': function() { console.log('J'); },
    'h': function() { console.log('H'); },
    'right': function() {
      currentLayout = columnLayout;
      currentLayout();
    },
    'left': function() {
      currentLayout = hairballLayout;
      currentLayout();
    }
  };

  Object.keys(eventMappings).forEach(function(mapping) {
    key(mapping, eventMappings[mapping]);
  });

  function focusProposition(node) {
    // console.log('focusing');
    // console.log(this);
    // console.log(node);
  }
  function unfocusProposition(node) {
    console.log('unfocusing');
    console.log(this);
    console.log(node);
  }

  $("#infoButton").toggle(
    function() {
      $("#infoContainer").stop().fadeIn(800);
      $("#chart").stop().fadeTo(400, 0.05);
      $("#infoButton").addClass("selected");
    }, function() {
      $("#infoContainer").stop().fadeOut(400);
      $("#chart").stop().fadeTo(400, 1);
      $("#infoButton").removeClass("selected");
    });

  $('#infoContainer').click(function() {
    $("#infoButton").click();
  });

  $('#infoWrap').click(function(event){
    event.stopPropagation();
  });

});
