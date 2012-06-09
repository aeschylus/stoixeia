// var width = window.innerWidth,
//     height = window.innerHeight;
var width = 940,
    height = 600;

var color = d3.scale.category20();

    var force = d3.layout.force()
    .charge(-170)
.linkDistance(190)
    .size([width, height]);

    var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("filter", "url(#blur)");

    d3.json("euclidData.json", function(json) {
        force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll("line.link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")

        var node = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("circle")
        .attr("r", 12)
        .attr("class", "node")
        .call(force.drag)
        
        node
        .on("click", function() {d3.select(this).attr("class", "node irrelevant")})

        // var node = svg.selectAll("circle.node")
        // .data(json.nodes)
        // .enter().append("circle")
        // .attr("class", "node")
        // .attr("r", 12)
        // .call(force.drag)

        node.append("title")
            .text(function(d) { return d.prop;});

    var references = function (d) {return d.propDependencies;};

        node.append("svg:foreignobject")
            .attr("x", function(d) { return d.x;})
            .attr("y", function(d) { return d.y;})
            .attr("height", 30)
            .attr("width", 30)
            .append("p")
            .text(references);
            // .text(function(d) { return d.prop;});

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        });

    var filter = svg.append("svg:defs")
        .append("svg:filter")
        .attr("id", "blur")
        .append("svg:feGaussianBlur")
        .attr("stdDeviation", 0);

    d3.select("#blur").on("click", blur);
    d3.select("#unblur").on("click", unblur);

    function blur() {
        filter.attr("stdDeviation", 5);
    }

    function unblur() {
        filter.attr("stdDeviation", 0);
    }

    // function references(d) {return d.propDependencies;};

    function referencedBy(proposition) {

    }

    });
