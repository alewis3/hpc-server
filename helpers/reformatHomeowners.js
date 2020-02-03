/**
 * This method will be used to reformat homeowner info from:
 *
 * {
 *      "_id": "5daba8bc7f50f17bf3b7be55",
 *      "homeownerInfo": {
 *          "meetingPlace": {
 *              "lat": -97,
 *              "long": 30
 *          }
 *      },
 *      "radius": 5
 * }
 *
 * to:
 *
 * {
 *      "_id": "5daba8bc7f50f17bf3b7be55",
 *      "location": {
 *           "lat": -97,
 *           "long": 30
 *      },
 *      radius: 5
 * }
 *
 * receives an array of homeowners in the format specified on top
 * returns an array of homeowners in the format specified on the bottom
 *
 */

module.exports = function(homeownersArray) {
    var newHomeownersArray = []
    for (var i = 0; i < homeownersArray.length; i++) {
        let orig = homeownersArray[i];
        var newHO = {
            _id: orig._id,
            location: {
                lat: orig.homeownerInfo.meetingPlace.lat,
                long: orig.homeownerInfo.meetingPlace.long
            },
            allowedItems: orig.allowedItems,
            prohibitedItems: orig.prohibitedItems,
            name: orig.name,
            isListingOn: orig.homeownerInfo.isListingOn
        };
        newHomeownersArray.push(newHO);
    }
    return newHomeownersArray;
};