/*
 * this is a helper method to calculate the distance between two points
 * and determine whether it falls within two radii
 * params: Coordinate 1 (x1, y1) and a radius for coordinate 1 (radius1)
 *          Coordinate 2 (x2, y2) and a radius for coordinate 2 (radius2)
 * calculates the distance and returns a boolean that will be true iff
 * radius1 is larger than the distance between the coordinates
 * and radius2 is larger than the distance between the coordinates
 * (meaning the coordinates are within both radii)
 */
module.exports = function(x1, y1, radius1, x2, y2, radius2) {
    // distance = sqrt[(x2 - x1)^2 + (y2 - y1)^2]
    var distance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
    return radius1 > distance && radius2 > distance;
};