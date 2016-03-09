$(function() {

  var nodes = null;
  var connections = null;

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
    console.log('something is happening');
  }

  svg.call(zoom);

  var force = d3.layout.force()
        .gravity(0.03)
        .charge(-230)
        .distance(200)
        .size([width, height]);

  d3.json("data/euclidElementsDeps.json", function(json) {
    nodes = json.nodes;
    connections = json.links.filter(function(link, index){
      return link.target;
    });

    console.log(nodes);
    console.log(connections);

    hairballLayout(nodes,connections);
  });

  function hairballLayout(nodes, connections) {
    force
      .nodes(nodes)
      .links(connections)
      .start();

    var link = container.selectAll(".link")
          .data(connections)
          .enter().append("line")
          .attr("class", "link");

    var node = container.selectAll(".node")
          .data(nodes)
          .enter().append("g")
          .attr("class", 'node')
          .style("fill", function(d, i) { return fill(d.book); });

    node.on("mouseover", fade(0.08)).on("mouseout", fade(1));

    node.append("circle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("r", 7);


    node.append("text")
      .attr("dx", 6)
      .attr("dy", "-.3em")
      .text(function(d) {
        return d.prop;
      });

    var dependencies = function (d) {return d.propDependencies;};

    force.on("tick", tick);

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    // Creates empty object literal into which we will place an assigned boolean value to each source-target pair.
    var linkedByIndex = {};

    function references(a, b) {
      return linkedByIndex[a.index + "," + b.index] || b.index == a.index;
    }

    function referencedBy(a, b) {
      return linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function fade(opacity) {
      // Sets the opacity of the link and node elements based on the value of the "isConnected" function.
      return function(d) {
        node.style("stroke-opacity", function(o) {
          // Ternary operator syntax in javascript.
          // Checks the return value of the function.
          // If true, thisOpacity will equal 1, if false, it will equal the
          // supplied opacity value.
          thisOpacity = references(d, o) ? 1 : opacity;
          // "this" evaluates to the matched node, since this finction is
          // called as a method on a jQuery or d3 matched set.
          this.setAttribute('fill-opacity', thisOpacity);
          return thisOpacity;
        });

        link.style("stroke-opacity", opacity).style("stroke-opacity", function(o) {
          return o.source === d ? 1 : opacity;
        });
      };
    }
  }

  function columnLayout() {
    force.stop();

    nodes.forEach(function(node) {
      node.x = (node.book * 250);
      node.y = parseInt(node.prop.split('.')[2]) * 35;
    });

    container.selectAll('.node')
      .data(nodes)
      .transition()
      .duration(2000)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

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
        console.log(d);
        return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    console.log('shifting');
  }

  key('right', function() { columnLayout(); });
  key('left', function() { hairballLayout(nodes, connections); });

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
  $("#setDirection").click(
    function () {
      console.log(depDirection);
      if ( depDirection == "up" ) { depDirection = "down";
                                    $('.direction').html(depDirection+"2");
                                  }
      else { depDirection = "up";}
      $('.direction').html(depDirection);
    });

  $('#infoContainer').click(function() {
    $("#infoButton").click();
  });

  $('#infoWrap').click(function(event){
    event.stopPropagation();
  });

});
