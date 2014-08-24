var depDirection = "down";
$(function() {

  var width = window.innerWidth, height = window.innerHeight;
  // var width = 940,
  //     height = 600;

  var svg = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height)

  var force = d3.layout.force()
  .gravity(.03)
  .charge(-230)
  .distance(200)
  .size([width, height]);

  d3.json("data/euclidElementsDeps.json", function(json) {
    console.log(json);
    force
    .nodes(json.nodes)
    .links(json.links)
    .start();

    var node_drag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

    function dragstart(d, i) {
      force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy; 
      tick(); // this is the key to make it work together with updating both px,py,x,y on d!
    };

    function dragend(d, i) {
      tick();
      force.resume();
    };

    function dragOn() {
    };

    var link = svg.selectAll(".link")
    .data(json.links)
    .enter().append("line")
    .attr("class", "link")

    var node = svg.selectAll(".node")
    .data(json.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

    node.on("mouseover", fade(.08)).on("mouseout", fade(1));

    node.append("circle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("r", 7);

    function clipTitle(prop) {
      return prop.substr(prop.indexOf(".") + 1); 
    }

    var prop = function(d) { return clipTitle(d.prop) };

    node.append("text")
    .attr("dx", 6)
    .attr("dy", "-.3em")
    .text(prop); 

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

    // Selects the links property of the d3 force layout json property,
    // Which is an array, and runs the forEach built-in javascript array method on it, iterating over each.
    json.links.forEach(function(d) {

      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function references(a, b) {
      return linkedByIndex[a.index + "," + b.index] || b.index == a.index;
    }

    function referencedBy(a, b) {
      return linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function fade(opacity) {
      // Sets the opacity of the link and node elements based on the value of the "isConnected" function.
      if ( depDirection === "up" ) {
        console.log("was up, now:" + depDirection);
        return function(d) {
          node.style("stroke-opacity", function(o) {
            // Ternary operator syntax in javascript.
            // Checks the return value of the function.
            // If true, thisOpacity will equal 1, if false, it will equal the 
            // supplied opacity value, "o."
            thisOpacity = referencedBy(d, o) ? 1 : opacity;
            // "this" evaluates to the matched node, since this finction is
            // called as a method on a jQuery or d3 matched set.
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
          });

          link.style("stroke-opacity", opacity).style("stroke-opacity", function(o) {
            return o.target === d ? 1 : opacity;
          });
        };
      } else {
        console.log("was up, now:" + depDirection);
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

    function showEnunciation() {
      a = 2;
    }

  });

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

  var text = {
    propNumber : 48,
    dummyElement : "Derpety Derpety Derpety",
    addProps : function() {
      for (i=0; i<this.propNumber; i++) {
        $("<div id='prop"+i+"'>"+this.dummyElement+"</div>").appendTo("body");
      }
    }
  }

  //text.addProps();
});
