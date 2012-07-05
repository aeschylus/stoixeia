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

d3.json("data/euclidData.json", function(json) {
    force
    .nodes(json.nodes)
    .links(json.links)
    .start();

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

var references = function (d) {return d.propDependencies;};

force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

// creates empty object literal 
var linkedByIndex = {};

// selects the links property of the d3 force layout json property,
// which is an array, and runs the forEach built-in javascript array method on it, iterating over each.
json.links.forEach(function(d) {

    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

function isConnected(a, b) {
    return linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

function references(a, b) {
}

function referencedBy(a, b) {
}

function fade(opacity) {
    // Sets the opacity of the link and node elements based on the value of the "isConnected" function.
    return function(d) {
        node.style("stroke-opacity", function(o) {
            // Ternary operator syntax in javascript.
            // Checks the return value of the function.
            // If true, thisOpacity will equal 1, if false, it will equal the 
            // supplied opacity value, "o."
            thisOpacity = isConnected(d, o) ? 1 : opacity;
            // "this" evaluates to the matched node, since this finction is
            // called as a method on a jQuery or d3 matched set.
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
        });

        link.style("stroke-opacity", opacity).style("stroke-opacity", function(o) {
            return o.target === d ? 1 : opacity;
        });
    };
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

$('#infoContainer').click(function() {
    $("#infoButton").click();
});

$('#infoWrap').click(function(event){
    event.stopPropagation();
});

var text = {
    propNumber : 48,
    dummyElement : "Derpety Derpet Derpety",
    addProps : function() {
        for (i=0; i<this.propNumber; i++) {
            $("<div id='prop"+i+"'>"+this.dummyElement+"</div>").appendTo("body");
        }
    }
}

//text.addProps();
});
