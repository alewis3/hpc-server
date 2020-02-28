/**
 * This method will be used to reformat host info to exclude the radius, which is unnecessary for the FE
 *
 * {
 *      "_id": "5daba8bc7f50f17bf3b7be55",
 *      "location": {
 *          "lat": -97,
 *          "long": 30
 *      },
 *      "radius": 5
 * }
 *
 * to:
 *
 * {
 *      "_id": "5daba8bc7f50f17bf3b7be55",
 *      "location": {
 *          "lat": -97,
 *          "long": 30
 *      }
 * }
 *
 * receives an array of hosts (can be homeowners or business owners) in the format specified above
 * with the radius included, and returns an array of hosts with just _id and location keys (no radius)
 */

module.exports = function(hostsArray) {
    var newHostsArray = []
    for (var i = 0; i < hostsArray.length; i++) {
        let orig = hostsArray[i];
        var newHost = {
            _id: orig._id,
            location: orig.location,
            allowedItems: orig.allowedItems,
            prohibitedItems: orig.prohibitedItems,
            businessName: orig.businessOwnerInfo.businessName,
            businessWebsite: orig.businessOwnerInfo.businessWebsite,
            contributorCharge: orig.businessOwnerInfo.contributorCharge,
            name: orig.name,
            isListingOn: orig.businessOwnerInfo.isListingOn
        };
        newHostsArray.push(newHost);
    }
    return newHostsArray;
};