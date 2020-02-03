/*
 * this is a helper method to calculate the distance between two points (lat/long)
 * and determine whether it falls within two radii (miles)
 * 1 degree of latitude = ~69 miles
 * 1 degree of longitude = ~55 miles
 * params: Coordinate 1 (lat1, long1) and a radius for coordinate 1 in miles (radius1)
 *          Coordinate 2 (lat2, long2) and a radius for coordinate 2 in miles(radius2)
 * calculates the distance and returns a boolean that will be true iff
 * coordinate 1 is within radius2 miles &&
 * coordinate 2 is within radius1 miles
 * (meaning the coordinates are within each others radii)
 */
module.exports = function(lat1, long1, radius1, lat2, long2, radius2) {
    // latitude distance in miles: Math.abs(lat2-lat1) * 69
    // longitude distance in miles: Math.abs(long2-long1) * 55
    // distance (in degrees) = sqrt[(lat in miles)^2 + (long in miles)^2]
    var distance = Math.sqrt((Math.pow(Math.abs(lat2 - lat1) * 69, 2) + Math.pow(Math.abs(long2 - long1) * 55, 2)));
    return radius1 > distance && radius2 > distance;
};