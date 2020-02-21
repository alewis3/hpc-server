/**
 * @apiDefine 201 Created 201
 * The user was created successfully.
 */

/**
 * @apiDefine 500 Error 500
 * Server Error.
 */

/**
 * @apiDefine SuccessfulUpdate
 *
 * @apiSuccessExample UpdatedResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true
 *      }
 */

/**
 * @apiDefine ServerError
 *
 * @apiErrorExample ServerError:
 *      HTTP/1.1 500 INTERNAL SERVER ERROR
 *      {
 *          "success": false,
 *          "error": {
 *              // An error object will be here
 *          }
 *      }
 */

/**
 * @apiDefine MissingIdError
 *
 * @apiErrorExample MissingId:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "The id does not exist!" // id was not in the body of the request
 *      }
 */

/**
 * @apiDefine MissingRequiredFieldsError
 *
 * @apiErrorExample MissingRequiredFields:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "MissingRequiredFields"
 *      }
 */

/**
 * @apiDefine NoMatchError
 *
 * @apiErrorExample NoMatch:
 *     HTTP/1.1 401 UNAUTHORIZED
 *     {
 *       "success": false,
 *       "error": "NoMatch"
 *     }
 */

/**
 * @apiDefine UserUpdateError
 *
 * @apiErrorExample UserUpdateError:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "UserUpdateError: _____"
 *      }
 */

/**
 * @apiDefine IdNotFoundError
 *
 * @apiErrorExample IdNotFound
 *      HTTP/1.1 404 NOT FOUND
 *      {
 *          "success": false,
 *          "error": "IdNotFound" // id was not found in the db
 *      }
 */

/**
 * @apiDefine AccountTypeMismatchError
 *
 * @apiErrorExample AccountTypeMismatch
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "AccountTypeMismatch"
 *      }
 */

/**
 * @api {get} /preferences/allowedItems?id=XX Get allowed items
 * @apiName GetAllowedItems
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will be called when a user wants to check their allowed items
 *
 * @apiParam {String} id The id of the user to get
 *
 * @apiSuccess {Boolean} success Will be true if the items were grabbed from the DB
 * @apiSuccess {String} allowedItems The items they allow
 *
 * @apiError {Boolean} success Will be false if the items could not be grabbed for some reason.
 * @apiError {String} error A message of why the items could not be grabbed.
 *
 * @apiError (500) {Boolean} success Will be false if the items could not be grabbed for some reason.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiSuccessExample SuccessResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "allowedItems": "Dried leaves, cardboard, cereal boxes, fruit and vegetable waste."
 *      }
 *
 * @apiUse MissingIdError
 * @apiUse AccountTypeMismatchError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {get} /preferences/prohibitedItems?id=XX Get prohibited items
 * @apiName GetProhibitedItems
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will be called when a user wants to check their prohibited items
 *
 * @apiParam {String} id The id of the user to get
 *
 * @apiSuccess {Boolean} success Will be true if the items were grabbed from the DB
 * @apiSuccess {String} prohibitedItems The items they prohibit
 *
 * @apiError {Boolean} success Will be false if the items could not be grabbed for some reason.
 * @apiError {String} error A message of why the items could not be grabbed.
 *
 * @apiError (500) {Boolean} success Will be false if the items could not be grabbed for some reason.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiSuccessExample SuccessResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "prohibitedItems": "Meat/egg scraps, dairy, fat, lard, oils."
 *      }
 *
 * @apiUse MissingIdError
 * @apiUse AccountTypeMismatchError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {post} /preferences/allowedItems Save allowed items
 * @apiName PostAllowedItems
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will be called when a user sets or updates their allowed items
 *
 * @apiParam {String} id The id of the user to set
 * @apiParam {String} allowedItems The items they want to allow
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
 *
 * @apiError (500) {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse AccountTypeMismatchError
 * @apiUse MissingRequiredFieldsError
 * @apiUse ServerError
 */

/**
 * @api {post} /preferences/prohibitedItems Save prohibited items
 * @apiName PostProhibitedItems
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will be called when a user sets or updates their prohibited items
 *
 * @apiParam {String} id The id of the user to set
 * @apiParam {String} prohibitedItems The items they want to prohibit
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
 *
 * @apiError (500) {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse AccountTypeMismatchError
 * @apiUse IdNotFoundError
 * @apiUse MissingRequiredFieldsError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/profile Modify or update a user's profile
 * @apiName PatchProfile
 * @apiGroup Preferences.General
 * @apiDescription C - This path will be called on whenever the user makes changes to their account and presses save. All fields are optional but at least one must be sent in for the request call to make sense.
 *
 * @apiParam {String} id The id of the user and the only required field of this request.
 * @apiParam {String} [email] A unique email (This acts as their username)
 * @apiParam {String} [passwordOld] The old password to match by.
 * @apiParam {String} [passwordNew] The new password to change password to.
 * @apiParam {Object} [name] An object containing "first" and "last" fields
 * @apiParam {String} [name.first] The user's first name
 * @apiParam {String} [name.last] The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner"} [accountType] The account type of the user.
 * @apiParam {Object} [location] An object containing "address", "city", "state", "zip", "lat", and "long" fields
 * @apiParam {String} [location.address] The user's street address including number and street name
 * @apiParam {String} [location.city] The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} [location.state] The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} [location.zip] The user's zip code in number format (5 digits and valid US zip)
 * @apiParam {String} [allowedItems] The user's allowed items (for hosts only)
 * @apiParam {String} [prohibitedItems] The user's prohibited items (for hosts only)
 * @apiParam {Number} [radius] The user's radius (for contributors, it's the farthest they are willing to look for hosts, and for hosts, its the farthest they want their post to display)
 *
 * @apiParam {Object} [homeownerInfo] An object with information specific to homeowners.
 * @apiParam {Object} [homeownerInfo.meetingPlace] An object with the address of the meeting place for homeowners
 * @apiParam {String} [homeownerInfo.meetingPlace.address] The address where the homeowner meets contributors.
 * @apiParam {String} [homeownerInfo.meetingPlace.city] The city where the homeowner meets contributors.
 * @apiParam {String} [homeownerInfo.meetingPlace.state] The state where the homeowner meets contributors.
 * @apiParam {Number} [homeownerInfo.meetingPlace.zip] The zip code where the homeowner meets contributors.
 * @apiParam {Boolean} [homeownerInfo.isListingOn] Whether or not the listing is active
 *
 * @apiParam {Object} [businessOwnerInfo] An object with information specific to business owners.
 * @apiParam {Boolean} [businessOwnerInfo.isListingOn] Whether or not the listing is active.
 * @apiParam {String} [businessOwnerInfo.businessName] The name of the business.
 * @apiParam {String} [businessOwnerInfo.businessWebsite] The website/url of the business.
 * @apiParam {Number} [businessOwnerInfo.contributorCharge] How much the business wants to charge contributors.
 *
 * @apiSuccess {Boolean} success This will be true if the update was successful.
 *
 * @apiError {Boolean} success This will be false if there was some sort of error.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success This will be false if there was some sort of error.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse AccountTypeMismatchError
 * @apiUse UserUpdateError
 * @apiUse ServerError
 */

/**
 * @api {get} /preferences/profile?id=XX Grab all profile info for a user
 * @apiName GetProfile
 * @apiGroup Preferences.General
 * @apiDescription C - This path will be called on whenever the user wants to view their profile information. The response body for this is LARGE, but many fields are optional.
 *
 * @apiParam {String} id The user's ID, send in the query string
 *
 * @apiSuccess {Boolean} success This will be true if the read was successful.
 * @apiSuccess {Object} user An object containing all user data.
 * @apiSuccess {String} user.email The user's email.
 * @apiSuccess {Object} user.name An object containing "first" and "last" fields.
 * @apiSuccess {String} user.name.first The user's first name.
 * @apiSuccess {String} user.name.last The user's last name.
 * @apiSuccess {String="Contributor", "Homeowner", "Business Owner"} user.accountType The account type of the user.
 * @apiSuccess {Object} user.location An object containing "address", "city", "state", "zip", "lat", and "long" fields.
 * @apiSuccess {String} user.location.address The user's street address including number and street name.
 * @apiSuccess {String} user.location.city The user's city e.g. "Austin" or "Dallas".
 * @apiSuccess {String{2}} user.location.state The user's state in this format: Texas -> "TX" or California -> "CA", etc.
 * @apiSuccess {Number} user.location.zip The user's zip code in number format (5 digits and valid US zip).
 * @apiSuccess {Number} user.location.lat The user's (calculated) latitude
 * @apiSuccess {Number} user.location.long The user's (calculated) longitude
 * @apiSuccess {String} [user.allowedItems] *Only for Hosts* The items they allow in their compost bin.
 * @apiSuccess {String} [user.prohibitedItems] *Only for Hosts* The items they prohibit in their compost bin.
 * @apiSuccess {Number} user.radius For contributors, the farthest they are willing to search for hosts, for Hosts, it is the farthest they want their post to display for contributors.
 *
 * @apiSuccess {Object} [user.homeownerInfo] An object with information specific to homeowners.
 * @apiSuccess {Object} [user.homeownerInfo.meetingPlace] The address where the homeowner meets contributors (May be different than their address).
 * @apiSuccess {String} [user.homeownerInfo.meetingPlace.address] The street address where the homeowner meets contributors.
 * @apiSuccess {String} [user.homeownerInfo.meetingPlace.city] The city where the homeowner meets contributors.
 * @apiSuccess {String{2}} [user.homeownerInfo.meetingPlace.state] The state where the homeowner meets contributors.
 * @apiSuccess {Number} [user.homeownerInfo.meetingPlace.zip] The zip code where the homeowner meets contributors.
 * @apiSuccess {Number} [user.homeownerInfo.meetingPlace.lat] The calculated latitude of the meeting place address.
 * @apiSuccess {Number} [user.homeownerInfo.meetingPlace.long] The calculated longitude of the meeting place address.
 * @apiSuccess {Boolean} [user.homeownerInfo.isListingOn] A boolean representing whether their listing is active or not.
 *
 * @apiSuccess {Object} [user.businessOwnerInfo] An object with information specific to business owners.
 * @apiSuccess {Boolean} [user.businessOwnerInfo.isListingOn] A boolean representing whether their listing is active or not.
 * @apiSuccess {String} [user.businessOwnerInfo.businessName] The business's name.
 * @apiSuccess {String} [user.businessOwnerInfo.businessWebsite] A link to the business's website.
 * @apiSuccess {String} [user.businessOwnerInfo.contributorCharge] The amount of money the business owner wants to charge for people contributing.
 *
 * @apiSuccess {Object[]} [user.blockedUsers] A list of objects containing the users this user has blocked
 * @apiSuccess {String} [user.blockedUsers._id] The blocked user's _id
 * @apiSuccess {String} [user.blockedUsers.email] The blocked user's email
 * @apiSuccess {Object} [user.blockedUsers.name] An object containing the blocked user's name
 * @apiSuccess {String} [user.blockedUsers.name.first] The blocked user's first name
 * @apiSuccess {String} [user.blockedUsers.name.last] The blocked user's last name
 *
 * @apiError {Boolean} success This will be false if there was some sort of error.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success This will be false if there was some sort of error.
 * @apiError (500) {Object} error An error object with more information on the failure.
 *
 * @apiSuccessExample SuccessfulContributorResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true
 *          "user": {
 *              "email": "alewis3@stedwards.edu",
 *              "name": {
 *                  "first": "Amanda",
 *                  "last": "Lewis"
 *              },
 *              "accountType": "Contributor",
 *              "location": {
 *                  "address": "6600 Delmonico Dr.",
 *                  "city": "Austin",
 *                  "state": "TX",
 *                  "zip": 78759,
 *                  "lat" : 30.4070384,
 *                  "long" : -97.77170149999999
 *              },
 *              radius: 5,
 *              blockedUsers: [
 *                  {
 *                      "_id": "5e2f1c8eec53c15ae2cb96e4"
 *                      "email": "eisis@stedwards.edu"
 *                      "name": {
 *                          "first": "Evangeline",
 *                          "last": "Mavrommati"
 *                      }
 *                  },
 *                  ...
 *              ]
 *          }
 *      }
 *
 * @apiSuccessExample SuccessfulHomeownerResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true
 *          "user": {
 *              "email": "alewis3@stedwards.edu",
 *              "name": {
 *                  "first": "Amanda",
 *                  "last": "Lewis"
 *              },
 *              "accountType": "Contributor",
 *              "location": {
 *                  "address": "6600 Delmonico Dr.",
 *                  "city": "Austin",
 *                  "state": "TX",
 *                  "zip": 78759,
 *                  "lat" : 30.4070384,
 *                  "long" : -97.77170149999999
 *              },
 *              radius: 5,
 *              "allowedItems": "Cardboard, food waste, dried leaves.",
 *              "prohibitedItems": "Meat, egg shells.",
 *              "homeownerInfo": {
 *                  "isListingOn": true,
 *                  "meetingPlace": {
 *                      "address" : "1109 S. Pleasant Valley Rd.",
 *                      "city" : "Austin",
 *                      "state" : "TX",
 *                      "zip" : 78741,
 *                      "lat" : 30.2403158,
 *                      "long" : -97.71805909999999
 *                  }
 *              },
 *              blockedUsers: [
 *                  {
 *                      "_id": "5e2f1c8eec53c15ae2cb96e4"
 *                      "email": "eisis@stedwards.edu"
 *                      "name": {
 *                          "first": "Evangeline",
 *                          "last": "Mavrommati"
 *                      }
 *                  },
 *                  ...
 *              ]
 *          }
 *      }
 *
 * @apiSuccessExample SuccessfulBusinessOwnerResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true
 *          "user": {
 *              "email": "alewis3@stedwards.edu",
 *              "name": {
 *                  "first": "Amanda",
 *                  "last": "Lewis"
 *              },
 *              "accountType": "Contributor",
 *              "location": {
 *                  "address": "6600 Delmonico Dr.",
 *                  "city": "Austin",
 *                  "state": "TX",
 *                  "zip": 78759,
 *                  "lat" : 30.4070384,
 *                  "long" : -97.77170149999999
 *              },
 *              radius: 5,
 *              "allowedItems": "Cardboard, food waste, dried leaves.",
 *              "prohibitedItems": "Meat, egg shells.",
 *              "businessOwnerInfo": {
 *                  "isListingOn": false,
 *                  "businessName": "Host, Post, and Compost",
 *                  "businessWebsite": "https://hpcompost.com"
 *              },
 *              blockedUsers: [
 *                  {
 *                      "_id": "5e2f1c8eec53c15ae2cb96e4"
 *                      "email": "eisis@stedwards.edu"
 *                      "name": {
 *                          "first": "Evangeline",
 *                          "last": "Mavrommati"
 *                      }
 *                  },
 *                  ...
 *              ]
 *          }
 *      }
 *
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/enableListing Enable a host's listing
 * @apiName PatchEnableListing
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will enable a host's listing with only one parameter: the host's id.
 *
 * @apiParam {String} id The id of the host **MUST BE A HOMEOWNER OR BUSINESS OWNER'S ID**
 *
 * @apiSuccess {Boolean} success Will be true if the listing could be updated as active.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/disableListing Disable a host's listing
 * @apiName PatchDisableListing
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will disable a host's listing with only one parameter: the host's id.
 *
 * @apiParam {String} id The id of the host **MUST BE A HOMEOWNER OR BUSINESS OWNER'S ID**
 *
 * @apiSuccess {Boolean} success Will be true if the listing could be updated as inactive.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/updateListing Update a host's listing as active or inactive
 * @apiName PatchUpdateListing
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will update a host's listing.
 *
 * @apiParam {String} id The id of the host **MUST BE A HOMEOWNER OR BUSINESS OWNER'S ID**
 * @apiParam {Boolean} isListingOn The boolean that isListingOn should be set to
 *
 * @apiSuccess {Boolean} success Will be true if the listing could be updated as active.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 * @apiErrorExample ParameterTypeMismatch:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "ParameterTypeMismatch"
 *      }
 */

/**
 * @api {get} /preferences/isListingOn?id=XX Get a host's current listing status
 * @apiName PatchGetListing
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will get a host's listing status.
 *
 * @apiParam {String} id The id of the host, sent in the query string **MUST BE A HOMEOWNER OR BUSINESS OWNER'S ID**
 *
 * @apiSuccess {Boolean} success Will be true if the listing could be updated as active.
 * @apiSuccess {Boolean} isListingOn Whether or not the listing is active at the time of the request.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample SuccessfulGetIsListingOn:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "isListingOn": true/false
 *      }
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/newHomeowner Update a user's account type to "Homeowner"
 * @apiName PatchHomeownerAcctType
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will allow you to update a user's accountType to "Homeowner", and set all the homeowner information.
 *
 * @apiParam {String} id The id of the user to edit (*Must not be a Homeowner!*)
 * @apiParam {String} allowedItems The items they allow.
 * @apiParam {String} prohibitedItems The items they prohibit.
 * @apiParam {Object} meetingPlace An object containing address information on where they want to meet.
 * @apiParam {String} meetingPlace.address The address of the meeting place.
 * @apiParam {String} meetingPlace.city The city of the meeting place.
 * @apiParam {String{2}} meetingPlace.state The state of the meeting place (in two-letter abbreviation format i.e. 'TX' or 'CA')
 * @apiParam {Number} meetingPlace.zip The zip of the meeting place.
 * @apiParam {Boolean} isListingOn Whether or not their listing should be active.
 * @apiParam {Number} radius The distance (in miles) of how far they want their post to display.
 *
 * @apiSuccess {Boolean} success Will be true if the new homeowner's info could be successfully updated.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 * @apiUse UserUpdateError
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/newBusinessOwner Update a user's account type to "Business Owner"
 * @apiName PatchBusinessOwnerAcctType
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will allow you to update a user's accountType to "Business Owner", and set all the business owner information.
 *
 * @apiParam {String} id The id of the user to edit (*Must not be a Business owner!*)
 * @apiParam {String} allowedItems The items they allow.
 * @apiParam {String} prohibitedItems The items they prohibit.
 * @apiParam {String} businessName The name of the business
 * @apiParam {String} businessWebsite The website of the business.
 * @apiParam {Object} location An object containing address information oof the business.
 * @apiParam {String} location.address The address of the business.
 * @apiParam {String} location.city The city of the business.
 * @apiParam {String{2}} location.state The state of the business (in two-letter abbreviation format i.e. 'TX' or 'CA')
 * @apiParam {Number} location.zip The zip of the business.
 * @apiParam {Number} contributorCharge How much they charge contributors to contribute.
 * @apiParam {Boolean} isListingOn Whether or not their listing should be active.
 * @apiParam {Number} radius The distance (in miles) of how far they want their post to display from their location/business address.
 *
 * @apiSuccess {Boolean} success Will be true if the new business owner's info could be successfully updated.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 * @apiUse UserUpdateError
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/newContributor Update a user's account type to "Contributor"
 * @apiName PatchContributorAcctType
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will allow you to update a user's accountType to "Contributor". This will erase any information about the home or business owner
 *
 * @apiParam {String} id The id of the user to edit (*Must not be a contributor!*)
 * @apiParam {Number} radius The distance (in miles) of how far they want to search for hosts.
 *
 * @apiSuccess {Boolean} success Will be true if the new contributor's info could be successfully updated.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 * @apiUse AccountTypeMismatchError
 * @apiUse UserUpdateError
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/homeownerInfo Update a homeowner's info
 * @apiName PatchHomeownerInfo
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will allow you to update or set a homeowner's info, including allowed/prohibitedItems, meetingPlace, display radius, and isListingOn. These fields are optional, but send in at least one so the request has something to do.
 *
 * @apiParam {String} id The id of the user to edit (*Must be a Homeowner!*)
 * @apiParam {String} [allowedItems] The items they allow.
 * @apiParam {String} [prohibitedItems] The items they prohibit.
 * @apiParam {Object} [meetingPlace] An object containing address information on where they want to meet.
 * @apiParam {String} [meetingPlace.address] The address of the meeting place.
 * @apiParam {String} [meetingPlace.city] The city of the meeting place.
 * @apiParam {String{2}} [meetingPlace.state] The state of the meeting place (in two-letter abbreviation format i.e. 'TX' or 'CA')
 * @apiParam {Number} [meetingPlace.zip] The zip of the meeting place.
 * @apiParam {Boolean} [isListingOn] Whether or not their listing should be active.
 * @apiParam {Number} [radius] The distance (in miles) of how far they want their post to display.
 *
 * @apiSuccess {Boolean} success Will be true if the homeowner's info could be successfully updated.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 * @apiUse UserUpdateError
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/businessOwnerInfo Update a business owner's info
 * @apiName PatchBusinessOwnerInfo
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route will allow you to update or set a business owner's info, including allowed/prohibitedItems, business name, business website, contributor charge (if any), display radius, and isListingOn, but also the location (which every user has). For the business owner, the location should be the same as the business address. These fields are optional, but send in at least one so the request has something to do.
 *
 * @apiParam {String} id The id of the user to edit (*Must be a Business Owner!*)
 * @apiParam {String} [allowedItems] The items they allow.
 * @apiParam {String} [prohibitedItems] The items they prohibit.
 * @apiParam {String} [businessName] The name of the business
 * @apiParam {String} [businessWebsite] The website of the business.
 * @apiParam {Object} [location] An object containing address information oof the business.
 * @apiParam {String} [location.address] The address of the business.
 * @apiParam {String} [location.city] The city of the business.
 * @apiParam {String{2}} [location.state] The state of the business (in two-letter abbreviation format i.e. 'TX' or 'CA')
 * @apiParam {Number} [location.zip] The zip of the business.
 * @apiParam {Number} [contributorCharge] How much they charge contributors to contribute.
 * @apiParam {Boolean} [isListingOn] Whether or not their listing should be active.
 * @apiParam {Number} [radius] The distance (in miles) of how far they want their post to display from their location/business address.
 *
 * @apiSuccess {Boolean} success Will be true if the business owner's info could be successfully updated.
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 * @apiUse UserUpdateError
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {post} /users/register Create/register a new user
 * @apiName CreateUser
 * @apiGroup Users
 * @apiDescription C - This route handles registering a user. The request will include an email, password, first and last name, account type, and a birthday in string format.
 *
 * @apiParam {String} email A unique email to register with (This acts as their username)
 * @apiParam {String} password A strong password in plaintext. This is hashed on the API side.
 * @apiParam {Object} name An object containing "first" and "last" fields
 * @apiParam {String} name.first The user's first name
 * @apiParam {String} name.last The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner", "System Admin"} accountType The account type of the user.
 * @apiParam {Object} location An object containing "address", "city", "state", "zip", "lat", and "long" fields
 * @apiParam {String} location.address The user's street address including number and street name
 * @apiParam {String} location.city The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} location.state The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} location.zip The user's zip code in number format (5 digits and valid US zip)
 *
 * @apiParamExample {json} ValidRequestExample:
 *      {
 *          "email": "alewis3@stedwards.edu",
 *          "password": "password",
 *          "name": {
 *              "first": "Amanda",
 *              "last": "Lewis"
 *          },
 *          "accountType": "Homeowner",
 *          "location": {
 *              "address": "3001 S. Congress Ave.",
 *              "city": "Austin",
 *              "state": "TX",
 *              "zip": 78704
 *          }
 *      }
 *
 * @apiSuccess (201) {Boolean} success Will be true if successful registration
 *
 * @apiSuccessExample CreatedResponse:
 *      HTTP/1.1 201 CREATED
 *      {
 *          "success": true
 *      }
 *
 * @apiError {Boolean} success Will be false if some error occurred.
 * @apiError {String} error A description of what error occurred.
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiErrorExample FormattingError:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *         "success": false,
 *         "error": "FormattingError: ______"
 *     }
 *
 * @apiUse MissingIdError
 * @apiUse ServerError
 */

/**
 *
 * @api {post} /users/login Authenticate a user for login
 * @apiName LoginUser
 * @apiGroup Users
 * @apiDescription C - This route handles authenticating a user when they want to login.
 *
 * @apiParam {String} email The email that the user signed up with
 * @apiParam {String} password The password that the user signed up with
 *
 * @apiSuccess {Boolean} success Will be true if successful login
 * @apiSuccess {String} accountType The type of the user that was authenticated
 * @apiSuccess {String} userId The id of the user that was authenticated
 *
 * @apiError {Boolean} success Will be false if user could not be authenticated for any reason
 * @apiError {String} error The reason why the user could not be authenticated
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample SuccessResponse:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "accountType": "Contributor",
 *          "userId": "5dac1173f950cb1188348941"
 *      }
 *
 * @apiErrorExample WrongCredentials:
 *     HTTP/1.1 401 UNAUTHORIZED
 *     {
 *       "success": false,
 *       "error": "WrongCredentials"
 *     }
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {get} /users/hosts?id=X Get all nearby hosts location
 * @apiName GetHosts
 * @apiGroup Users
 * @apiDescription C - This endpoint limits the search of hosts by the radius of that user and the radius of each individual host. Will return a list of homeowners and business owners in range and not blocked.
 *
 * @apiParam {String} id Sent in the request url, the user id of the user you want to match by.
 *
 * @apiSuccess {Boolean} success Will be true if hosts could be found
 * @apiSuccess {Object[]} businessOwners The list of business owners to display on the map
 * @apiSuccess {String} businessOwners._id The user id of the host
 * @apiSuccess {Object} businessOwners.location The location of the host
 * @apiSuccess {Number} businessOwners.location.lat The lat of the host
 * @apiSuccess {Number} businessOwners.location.long The long of the host
 * @apiSuccess {String} businessOwners.allowedItems The types of items they allow
 * @apiSuccess {String} businessOwners.prohibitedItems The types of items they prohibit
 * @apiSuccess {String} businessOwners.businessName The name of the business
 * @apiSuccess {String} businessOwners.businessWebsite The website/url of the business
 * @apiSuccess {Number} businessOwners.contributorCharge The amount they charge contributors to contribute to their bin
 * @apiSuccess {Object} businessOwners.name An object containing the name of the person to contact at the business
 * @apiSuccess {String} businessOwners.name.first The first name of the person to contact at the business
 * @apiSuccess {String} businessOwners.name.last The last name of the person to contact at the business
 * @apiSuccess {String} businessOwners.isListingOn Whether or not the listing is active.
 *
 * @apiSuccess {Object[]} homeowners The list of homeowners to display on the map
 * @apiSuccess {String} homeowners._id The user id of the host
 * @apiSuccess {Object} homeowners.location The location of the host
 * @apiSuccess {Number} homeowners.location.lat The lat of the host
 * @apiSuccess {Number} homeowners.location.long The long of the host
 * @apiSuccess {String} homeowners.allowedItems The types of items they allow
 * @apiSuccess {String} homeowners.prohibitedItems The types of items they prohibit
 * @apiSuccess {Object} homeowners.name An object containing the name of the homeowner
 * @apiSuccess {String} homeowners.name.first The first name of the homeowner
 * @apiSuccess {String} homeowners.name.last The last name of the homeowner
 * @apiSuccess {String} homeowners.isListingOn Whether or not the listing is active.
 *
 * @apiError {Boolean} success Will be false if the id was not found or the id did not belong to a contributor
 * @apiError {String} error An error message of what went wrong
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample FoundHosts
 *    HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "businessOwners": [
 *              {
 *                  "_id": "5daba8bc7f50f17bf3b7be55",
 *                  "location": {
 *                      "lat": -97,
 *                      "long": 30
 *                  },
 *                  "allowedItems": "Cardboard, food waste, dried leaves.",
 *                  "prohibitedItems": "Meat, egg shells.",
 *                  "businessName": "Host, Post, and Compost",
 *                  "businessWebsite": "https://hpcompost.com",
 *                  "contributorCharge": 2,
 *                  "name": {
 *                      "first": "Amanda",
 *                      "last": "Lewis"
 *                   },
 *                  "isListingOn": true
 *              },
 *              ...
 *          ],
 *          "homeowners": [
 *              {
 *                  "_id": "5daba8bc7f50f17bf3b7be55",
 *                  "location": {
 *                      "lat": -98,
 *                      "long": 31
 *                  }
 *                  "allowedItems": "Cardboard, food waste, dried leaves.",
 *                  "prohibitedItems": "Meat, egg shells.",
 *                  "name": {
 *                      "first": "Amanda",
 *                      "last": "Lewis"
 *                   },
 *                   "isListingOn": true
 *              },
 *              ...
 *          ]
 *      }
 *
 * @apiSuccessExample NoHostsFound
 *      HTTP/1.1 204 NO CONTENT
 *      {
 *          "success": true,
 *          "businessOwners": [],
 *          "homeowners": []
 *      }
 *
 * @apiUse MissingIdError
 * @apiUse AccountTypeMismatchError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 *
 */

/**
 * @api {get} /users/hostsAll?id=X Get all hosts location
 * @apiName GetHostsAll
 * @apiGroup Users
 * @apiDescription C - This endpoint returns all hosts registered.
 *
 * @apiParam {String} id Sent in the request url, the user id of the user you want to match by.
 *
 * @apiSuccess {Boolean} success Will be true if hosts could be found
 * @apiSuccess {Object[]} businessOwners The list of business owners to display on the map
 * @apiSuccess {String} businessOwners._id The user id of the host
 * @apiSuccess {Object} businessOwners.location The location of the host
 * @apiSuccess {Number} businessOwners.location.lat The lat of the host
 * @apiSuccess {Number} businessOwners.location.long The long of the host
 * @apiSuccess {String} businessOwners.allowedItems The types of items they allow
 * @apiSuccess {String} businessOwners.prohibitedItems The types of items they prohibit
 * @apiSuccess {String} businessOwners.businessName The name of the business
 * @apiSuccess {String} businessOwners.businessWebsite The website/url of the business
 * @apiSuccess {Number} businessOwners.contributorCharge The amount they charge contributors to contribute to their bin
 * @apiSuccess {Object} businessOwners.name An object containing the name of the person to contact at the business
 * @apiSuccess {String} businessOwners.name.first The first name of the person to contact at the business
 * @apiSuccess {String} businessOwners.name.last The last name of the person to contact at the business
 * @apiSuccess {String} businessOwners.isListingOn Whether or not the listing is active.
 *
 * @apiSuccess {Object[]} homeowners The list of homeowners to display on the map
 * @apiSuccess {String} homeowners._id The user id of the host
 * @apiSuccess {Object} homeowners.location The location of the host
 * @apiSuccess {Number} homeowners.location.lat The lat of the host
 * @apiSuccess {Number} homeowners.location.long The long of the host
 * @apiSuccess {String} homeowners.allowedItems The types of items they allow
 * @apiSuccess {String} homeowners.prohibitedItems The types of items they prohibit
 * @apiSuccess {Object} homeowners.name An object containing the name of the homeowner
 * @apiSuccess {String} homeowners.name.first The first name of the homeowner
 * @apiSuccess {String} homeowners.name.last The last name of the homeowner
 * @apiSuccess {String} homeowners.isListingOn Whether or not the listing is active.
 *
 * @apiError {Boolean} success Will be false if the id was not found or the id did not belong to a contributor
 * @apiError {String} error An error message of what went wrong
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample FoundHosts
 *    HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "businessOwners": [
 *              {
 *                  "_id": "5daba8bc7f50f17bf3b7be55",
 *                  "location": {
 *                      "lat": -97,
 *                      "long": 30
 *                  },
 *                  "allowedItems": "Cardboard, food waste, dried leaves.",
 *                  "prohibitedItems": "Meat, egg shells.",
 *                  "businessName": "Host, Post, and Compost",
 *                  "businessWebsite": "https://hpcompost.com",
 *                  "contributorCharge": 2,
 *                  "name": {
 *                      "first": "Amanda",
 *                      "last": "Lewis"
 *                   },
 *                  "isListingOn": true
 *              },
 *              ...
 *          ],
 *          "homeowners": [
 *              {
 *                  "_id": "5daba8bc7f50f17bf3b7be55",
 *                  "location": {
 *                      "lat": -98,
 *                      "long": 31
 *                  }
 *                  "allowedItems": "Cardboard, food waste, dried leaves.",
 *                  "prohibitedItems": "Meat, egg shells.",
 *                  "name": {
 *                      "first": "Amanda",
 *                      "last": "Lewis"
 *                   },
 *                   "isListingOn": true
 *              },
 *              ...
 *          ]
 *      }
 *
 * @apiSuccessExample NoHostsFound
 *      HTTP/1.1 204 NO CONTENT
 *      {
 *          "success": true,
 *          "businessOwners": [],
 *          "homeowners": []
 *      }
 *
 * @apiUse MissingIdError
 * @apiUse AccountTypeMismatchError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 *
 */

/**
 * @api {post} /users/resetPassword Reset a user's password
 * @apiName ResetPassword
 * @apiGroup Users
 * @apiDescription C - This route handles resetting a password
 *
 * @apiParam {String} id The id of the user
 * @apiParam {String} old The user's old password to match on
 * @apiParam {String} new The user's new password to save in the db
 *
 * @apiSuccess {Boolean} success Will be true if the old password matched and was able to be changed
 *
 * @apiError {Boolean} success Will be false if the old password did not match or the new pwd was not able to be changed
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse NoMatchError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /users/blockUser Blocks a user
 * @apiName PatchBlockUser
 * @apiGroup Users
 * @apiDescription C - This route lets a user (blockingUser) block another user (blockedUser).
 *
 * @apiParam {String} blockingUser The user that wants to block another user.
 * @apiParam {String} blockedUser The user to be blocked
 *
 * @apiSuccess {Boolean} success Will be true if the user could be blocked
 *
 * @apiError {Boolean} success Will be false if the user could not be blocked for any reason
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 * @apiErrorExample UserAlreadyBlocked:
 *      HTTP/1.1 400
 *      {
 *          "success": false,
 *          "error": "UserAlreadyBlocked"
 *      }
 */

/**
 * @api {patch} /users/unblockUser Unblocks a user
 * @apiName PatchUnblockUser
 * @apiGroup Users
 * @apiDescription C - This route lets a user (unblockingUser) unblock another user (unblockedUser).
 *
 * @apiParam {String} unblockingUser The id of the user that wants to unblock another user.
 * @apiParam {String} unblockedUser The id of the user to be unblocked
 *
 * @apiSuccess {Boolean} success Will be true if the user could be successfully unblocked
 *
 * @apiError {Boolean} success Will be false if the user could not be unblocked
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 * @apiErrorExample UserNotBlocked:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "UserNotBlocked"
 *      }
 */

/**
 * @api {patch} /users/blockUserEmail Blocks a user by email
 * @apiName PatchBlockUserEmail
 * @apiGroup Users
 * @apiDescription C - This route lets a user (blockingUserId) block another user (blockedUserEmail).
 *
 * @apiParam {String} blockingUserId The id of the user that wants to block another user.
 * @apiParam {String} blockedUserEmail The email of the user to be blocked
 *
 * @apiSuccess {Boolean} success Will be true if the user could be blocked
 *
 * @apiError {Boolean} success Will be false if the user could not be blocked for any reason
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 * @apiErrorExample UserAlreadyBlocked:
 *      HTTP/1.1 400
 *      {
 *          "success": false,
 *          "error": "UserAlreadyBlocked"
 *      }
 */

/**
 * @api {patch} /users/unblockUserEmail Unblocks a user by email
 * @apiName PatchUnblockUserEmail
 * @apiGroup Users
 * @apiDescription C - This route lets a user (unblockingUserId) unblock another user (unblockedUserEmail).
 *
 * @apiParam {String} unblockingUserId The id of the user that wants to unblock another user.
 * @apiParam {String} unblockedUserEmail The email of the user to be unblocked
 *
 * @apiSuccess {Boolean} success Will be true if the user could be successfully unblocked
 *
 * @apiError {Boolean} success Will be false if the user could not be unblocked
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 * @apiErrorExample UserNotBlocked:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success": false,
 *          "error": "UserNotBlocked"
 *      }
 */

/**
 * @api {get} /preferences/blockedUsers?id=XX Get blocked users for one specific user.
 * @apiName GetBlockedUsers
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route lets you grab all blocked users for one user in particular.
 *
 * @apiParam {String} id The id of the user you want to check for
 *
 * @apiSuccess {Boolean} success Will be true if the list of blocked users could be grabbed.
 * @apiSuccess {Object[]} blockedUsers The list of blocked users for that user.
 *
 * @apiError {Boolean} success Will be false if the user could not be unblocked
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {get} /preferences/blockedBy?id=XX Get all the users that have blocked this user
 * @apiName GetBlockedBy
 * @apiGroup Preferences.Specific
 * @apiDescription C - This route lets you grab all users that have blocked this user.
 *
 * @apiParam {String} id The id of the user you want to check for
 *
 * @apiSuccess {Boolean} success Will be true if the blockedBy list could be grabbed
 * @apiSuccess {Object[]} blockedBy The list of users that have blocked this user.
 *
 * @apiError {Boolean} success Will be false if the user could not be unblocked
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiUse SuccessfulUpdate
 *
 * @apiUse MissingIdError
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {get} /users/getId?email=XX@gmail.com Get user id from email
 * @apiName GetId
 * @apiGroup Users
 * @apiDescription C - This route enables you to give an email and get back the user's _id.
 *
 * @apiParam {String} email The email of the user that you want to get the id from, sent in the query.
 *
 * @apiSuccess {Boolean} success Will be true if the user could be successfully unblocked
 * @apiSuccess {String} id The id of the user.
 *
 * @apiError {Boolean} success Will be false if the user could not be unblocked
 * @apiError {String} error The error that caused success to be false
 *
 * @apiError (500) {Boolean} success Will be false if some error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample SuccessfulRequest:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "id": "5e417bea49501e733f4c6a98"
 *      }
 * @apiErrorExample EmailNotFound:
 *      HTTP/1.1 400 BAD REQUEST
 *      {
 *          "success" : false,
 *          "error": "EmailNotFound"
 *      }
 */