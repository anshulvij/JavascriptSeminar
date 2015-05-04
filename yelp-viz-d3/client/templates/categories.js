Template.categories.rendered = function() {

    var width = 650,
        height = 500,
        radius = Math.min(width, height) / 2,
        legendRectSize = 18,
        legendSpacing = 4;

    var color = d3.scale.category20b();

    var pie = d3.layout.pie()
        .value(function(d) { return d.values; })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);

    var arcOver = d3.svg.arc()
        .innerRadius(radius - 120)
        .outerRadius(radius -20);

    var svg = d3.select("#categories").append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var innerCircle = svg.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 120)
        .attr("class", "inside-circle")
        .style("fill", "white")
        .style("stroke", "lightgrey")
        .style("stroke-width", "2px");

    var hint = svg.append("text")
        .attr("dy", ".35em")
        .attr("class", "inside-hint")
        .style("fill", "lightgrey")
        .style("text-anchor", "middle")
        .text("Hover over pies");

    d3.json("/data/restaurants_all.json", drawChart);

    // get the data grouped by categories
    function drawChart(data) {

        var nested = d3.nest()
            .key(function(d) {
               return d.categories[0][0];
            })
            .sortKeys(d3.ascending)
            .rollup(function(leaves) { return leaves.length; })
            .entries(data.restaurants);



        var g = svg.selectAll(".arc")
            .data(pie(nested))
            .enter().append("g")
            .attr("class", "arc")
            .on("mouseover", function(d) {
                d3.select(this).select("path").transition()
                    .attr("d", arcOver);

                hint
                    .style("fill", "white");

                innerCircle.transition().duration(500)
                    .style("stroke-width", 0);


                svg.append("text")
                    .attr("dy", ".35em")
                    .attr("x", "0")
                    .attr("y", "-60")
                    .attr("class", "inside-category")
                    .style("fill", color(d.data.key))
                    .style("text-anchor", "middle")
                    .text(d.data.key);

                svg.append("text")
                    .attr("dy", ".35em")
                    .attr("class", "inside")
                    .style("fill", color(d.data.key))
                    .style("text-anchor", "middle")
                    .text(d.data.values);

                svg.append("text")
                    .attr("dy", ".35em")
                    .attr("x", "0")
                    .attr("y", "60")
                    .attr("class", "inside-restaurant")
                    .style("fill", color(d.data.key))
                    .style("text-anchor", "middle")
                    .text("Restaurants");

                svg.selectAll(".inside-circle").transition().duration(100)
                    .style("stroke-width", 0);

                svg.selectAll(".inside-circle").transition().delay(50).duration(500)
                    .style("stroke-width", 2)
                    .style("stroke", color(d.data.key));


            })
            .on("mouseout", function(d) {
                d3.select(this).select("path").transition()
                    .attr("d", arc);
                svg.selectAll(".inside").remove();
                svg.selectAll(".inside-category").remove();
                svg.selectAll(".inside-restaurant").remove();
                svg.selectAll(".inside-circle").transition().duration(500)
                    .style("stroke-width", 0);
            });

        var path = g.append("path")
            .attr("d", arc)
            .style("fill", function (d) { return color(d.data.key); });




             var legend = svg.selectAll(".legend")
             .data(color.domain())
             .enter()
             .append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) {
             var height = legendRectSize + legendSpacing;
             var offset = height * color.domain().length / 2;
             var horz = 250;
             var vert = i * height - offset;
             return "translate(" + horz + "," + vert + ")";
             });

             legend.append("rect")
             .attr("width", legendRectSize)
             .attr("height", legendRectSize)
             .style("fill", color)
             .style("stroke", color);

             legend.append("text")
             .attr("x", legendRectSize + legendSpacing)
             .attr("y", legendRectSize - legendSpacing)
             .text(function(d) { return d; });



    }


    function changeData(data){
        path.data(pie(data));
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    d3.selectAll("input").on("change", function change() {
        this.value === "data1"
            ? changeData(data1)
            : changeData(data2);

    });
}