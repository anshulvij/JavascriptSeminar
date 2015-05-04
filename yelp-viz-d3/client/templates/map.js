Template.map.rendered = function() {


    function drawMap(data) {

        var margin = 75,
            width = 800 - margin,
            height = 600 - margin;


        var svg = d3.select("#map")
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin)
            .append("g")
            .attr("class", "map");

        var center = d3.geo.centroid(data);
        var scale = 120000;
        var offset = [width/2, height/2];

        var projection = d3.geo.mercator()
            .scale(scale)
            .center(center)
            .translate(offset);

        var path = d3.geo.path().projection(projection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        var bounds  = path.bounds(data);
        var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
        var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
        var scale   = (hscale < vscale) ? hscale : vscale;
        var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
            height - (bounds[0][1] + bounds[1][1])/2];

        // new projection
        projection = d3.geo.mercator().center(center)
            .scale(scale).translate(offset);
        path = path.projection(projection);

        function tooltipHtml(d) {
            return  "<h4>" + d.properties.name + "</h4><table>" +
                    "<tr><td>Total : " + d.restaurants.total + "</td><td></td></tr>" +
                    "</table>";
        }

        function showTooltip(d) {

            d3.select("#tooltip").transition().duration(200).style("opacity", .9);

            d3.select("#tooltip").html(tooltipHtml(d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        }

        function hideTooltip() {
            d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        }



        var map = svg.selectAll("path")
                .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", changeData)
            .attr("class", "district")
            .attr("fill", "#C58917")
            .transition().delay(1000).duration(5000)
            .attr("fill", function(d) {
                console.log("Neighborhood: " + d.properties.name);
                var count = d.restaurants.total;
                console.log("Nr. Restaurants: " + count);

                return d3.interpolateRgb("#FF9999", "#260000")(count/1000);;
            });

    }

    function inPolygon (point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };


    function count_restaurants(district, restaurants) {
        var i, count = 0;
        for (i = 0; i < restaurants.length-1; i++) {

            var latitude = restaurants[i].location.coordinate.latitude;
            var longitude = restaurants[i].location.coordinate.longitude;

            var c = inPolygon([longitude, latitude], district);

            if (c) {
                count++;
            }
        }

        return count;
    }


    var width = 500,
        height = 500,
        radius = Math.min(width, height) / 2,
        legendRectSize = 18,
        legendSpacing = 4;

    var categories = ["Afghan", "African", "American (Traditional)", "Arabian", "Argentine", "Asian Fusion", "Australian", "Austrian", "Barbeque", "Brasseries", "Brazilian", "Breakfast & Brunch", "British", "Buffets", "Burgers", "Cafes", "Cafeteria", "Cajun/Creole", "Caribbean", "Chicken Shop", "Chinese", "Dim Sum", "Chinese", "Dim Sum", "Chinese", "Dim Sum", "Chinese", "Dim Sum", "Chinese", "Dim Sum", "Chinese", "Creperies", "Cuban", "Czech", "Diners", "Ethiopian", "Fast Food", "Filipino", "Fish & Chips", "Fondue", "Food Stands", "French", "Gastropubs", "German", "Baden", "German", "Northern German", "German", "Gluten-Free", "Greek", "Halal", "Himalayan/Nepalese", "Hot Dogs", "Hungarian", "Indian", "Indonesian", "Irish", "Italian", "Japanese", "Ramen", "Japanese", "Ramen", "Japanese", "Ramen", "Japanese", "Ramen", "Japanese", "Korean", "Kosher", "Latin American", "Live/Raw Food", "Malaysian", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Falafel", "Mediterranean", "Mexican", "Lebanese", "Middle Eastern", "Lebanese", "Middle Eastern", "Lebanese", "Middle Eastern", "Modern European", "Mongolian", "Moroccan", "Pakistani", "Peruvian", "Pizza", "Polish", "Portuguese", "Russian", "Salad", "Sandwiches", "Seafood", "Soup", "Spanish", "Steakhouses", "Sushi Bars", "Taiwanese", "Tapas Bars", "Tapas/Small Plates", "Tex-Mex", "Thai", "Turkish", "Ukrainian", "Vegan", "Vegetarian", "Vietnamese"];

    var colors = ["#019bdf",  "#07bf21",  "#0ac5f4",  "#0b95c4",  "#0c1c07",  "#0d74b8",  "#0f42bc",  "#12b00e",  "#14e62f",  "#17ee86",  "#1886bf",  "#19acde",  "#1ab1cd",  "#1e36a6",  "#1e885d",  "#215453",  "#23016a",  "#23d27c",  "#24391b",  "#2704c3",  "#277af6",  "#2801de",  "#28bfa1",  "#2a6641",  "#2cb428",  "#2f589b",  "#303387",  "#332afc",  "#34f953",  "#360e42",  "#37b304",  "#3930a1",  "#3c9777",  "#3d0b73",  "#3dbdc4",  "#3e5f90",  "#429721",  "#45e4b5",  "#46b255",  "#47f594",  "#4a581c",  "#4c6f5c",  "#4ce464",  "#4d9310",  "#4dac8b",  "#51aca0",  "#547163",  "#54f027",  "#559ec3",  "#55cc69",  "#572048",  "#582746",  "#598a74",  "#5bba9d",  "#5d1786",  "#60e979",  "#615112",  "#615bf6",  "#622b34",  "#634b4f",  "#63d0b9",  "#642201",  "#643fa1",  "#64d1af",  "#65a0f5",  "#66f3ee",  "#67452f",  "#67782c",  "#67f9ef",  "#68cf75",  "#6973df",  "#69fdd8",  "#6b01be",  "#711240",  "#723564",  "#725324",  "#758a91",  "#76855e",  "#77c65b",  "#797fac",  "#7d85e3",  "#7dc3f1",  "#7fd83c",  "#803b24",  "#818242",  "#820e8b",  "#8214a8",  "#8665ae",  "#8706a5",  "#8726f6",  "#877e46",  "#8a19a5",  "#8a25fc",  "#8ab976",  "#8b0f05",  "#8cc653",  "#8f3818",  "#90f59c",  "#91bdfd",  "#92569e",  "#928e67",  "#96013e",  "#961329",  "#975e9d",  "#989f27",  "#98daba",  "#9a4248",  "#9a492c",  "#9af600",  "#9cb249",  "#9dca9a",  "#a0bdaa",  "#a1769e",  "#a242af",  "#a528fb",  "#a8bcb6",  "#a8ca6e",  "#accb2c",  "#ad9196",  "#aefb5f",  "#afd834",  "#b08a8c"];

    var custom_color = d3.scale.ordinal()
        .domain(categories)
        .range(colors);

    var color = d3.scale.category20();

    var pie = d3.layout.pie()
        .value(function(d) { return d.values.total; })
        .sort(null);

    var innerRadius = radius - 100;

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius - 20);


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



    // get the data grouped by categories
    function drawChart(data) {


            var nested = d3.nest()
                .key(function(d) {
                    return d.categories[0][0];
                })
                .sortKeys(d3.ascending)
                .rollup(function(leaves) {
                    return {
                        "total" : leaves.length,
                        "color" : custom_color(leaves[0].categories[0][0])
                    }})
                .entries(data.restaurants);


            nested = getTop20(nested, data.restaurants.length);


        var path = svg.selectAll("path")
                .data(pie(nested))
            .enter().append("path")
            .attr("d", arc)
            .attr("class", "arc")
            .style("fill", function (d) { return color(d.data.key); })
            .each(function(d) {
                this._current = d;
            }).on("mouseover", function(d) {

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
                    .text(d.data.values.total);

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
                svg.selectAll(".inside").remove();
                svg.selectAll(".inside-category").remove();
                svg.selectAll(".inside-restaurant").remove();
                svg.selectAll(".inside-circle").transition().duration(500)
                    .style("stroke-width", 0);
            });



        /*
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

        */

    }


    function changeData(data){

        var path = svg.selectAll("path");
        pie.value(function(d) { return d.values.total; });

        path = path.data(pie(data.restaurants));

        path.exit().remove();

        path.enter().append("path")
            .style("fill", function (d) { debugger; return color(d.data.key); })
            .attr("class", "arc")
            .attr("d", arc)
            .each(function(d) {
                this._current = d;
            })
            .on("mouseover", function(d) {

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
                    .text(d.data.values.total);

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
                svg.selectAll(".inside").remove();
                svg.selectAll(".inside-category").remove();
                svg.selectAll(".inside-restaurant").remove();
                svg.selectAll(".inside-circle").transition().duration(500)
                    .style("stroke-width", 0);
            });



        path.transition().duration(750).attrTween("d", arcTween)
            .style("fill", function(d) { return color(d.data.key); });



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

    function getTop20(nested_restaurant, total) {

        if (nested_restaurant.length > 20) {
            var new_restaurant = [];
            var total_others = total;

            for (var j = 0; j < 19; j++) {

                var highest_total = 0;
                var tmp_total,highest_obj, highest_index;
                for (var k = nested_restaurant.length-1; k >= 0; k--) {
                    tmp_total = nested_restaurant[k].values.total;
                    if (tmp_total > highest_total) {
                        highest_total = tmp_total;
                        highest_obj = nested_restaurant[k];
                        highest_index = k;
                    }
                }

                if (highest_total == 0 ) {
                    total_others = 0;
                } else {
                    // add category with highest number of restaurants to new restaurant array
                    new_restaurant.push(highest_obj);
                    // calculate number of "Other" category by reducing the total number of restaurants
                    total_others = total_others - new_restaurant[j].values.total;
                    // remove the highest object from original array
                    nested_restaurant.splice(highest_index, 1);
                }
            }

            // add category "Others" to new restaurant array with calculated total
            new_restaurant.push({ "key" : "Others", "values" : { "total" : total_others }});
            // add the overall total number of restaurants as new property to array
            new_restaurant.total = total;

            return new_restaurant;
        } else {
            return nested_restaurant;
        }

    }

    function manipulateData(geo_data, restaurant_data) {
        var features = geo_data.features;
        var i;
        for (i = 0; i < features.length; i++) {
            var total = 0;
            var nested_restaurant = d3.nest()
                .key(function(d) {
                    return d.categories[0][0];
                })
                .rollup(function(leaves) {
                    var num_rest = count_restaurants(features[i].geometry.coordinates[0], leaves);
                    total = total + num_rest;
                    return {
                        "total" : num_rest,
                        "color" : custom_color(leaves[0].categories[0][0])
                    }

                })
                .entries(restaurant_data.restaurants);

            features[i].restaurants = getTop20(nested_restaurant, total);
        }

        geo_data.features = features;

        drawMap(geo_data);
    }


    d3.json("/data/munich.json", function(err, geo_data) {
        if (err) return console.error(err);

        d3.json("/data/restaurants_all.json", function(err, restaurant_data) {
            if (err) return console.error(err);

            manipulateData(geo_data, restaurant_data);
            drawChart(restaurant_data);
        });

    });


}

