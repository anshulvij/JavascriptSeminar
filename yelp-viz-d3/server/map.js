Meteor.methods({
    inPolygon: function(polygon, point) {

        var classifyPoint = Meteor.npmRequire("robust-point-in-polygon");

        var result = classifyPoint(polygon, point);

        return result;
    }
});