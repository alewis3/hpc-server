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
 * @apiDefine IdNotFoundError
 *
 * @apiErrorExample IdNotFound
 *      HTTP/1.1 404 NOT FOUND
 *      {
 *          "success": false,
 *          "error": "IdNotFound"
 *      }
 */

/**
 * @api {get} /preferences/allowedItems?id=XX Get allowed items
 * @apiName GetAllowedItems
 * @apiGroup Preferences
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
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {get} /preferences/prohibitedItems?id=XX Get prohibited items
 * @apiName GetProhibitedItems
 * @apiGroup Preferences
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
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {post} /preferences/allowedItems Save allowed items
 * @apiName PostAllowedItems
 * @apiGroup Preferences
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
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {post} /preferences/prohibitedItems Save prohibited items
 * @apiName PostProhibitedItems
 * @apiGroup Preferences
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
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 */

/**
 * @api {patch} /preferences/profile Update a user profile
 * @apiName PatchProfile
 * @apiGroup Preferences
 * @apiDescription NI - This path will be called on whenever the user makes changes to their account and presses save. All fields are optional but at least one must be sent in for the request call to make sense.
 *
 * @apiParam {String} [email] A unique email to register with (This acts as their username)
 * @apiParam {String} [password] A strong password in plaintext. This is hashed on the API side.
 * @apiParam {Object} [name] An object containing "first" and "last" fields
 * @apiParam {String} [name[first]] The user's first name
 * @apiParam {String} [name[last]] The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner"} [accountType] The account type of the user.
 * @apiParam {String} [dob] The user's Date of Birth in "MM/DD/YYYY" format
 * @apiParam {Object} [location] An object containing "address", "city", "state", and "zip" fields
 * @apiParam {String} [location[address]] The user's street address including number and street name
 * @apiParam {String} [location[city]] The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} [location[state]] The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} [location[zip]] The user's zip code in number format (5 digits and valid US zip)
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
 * @apiParam {String} name[first] The user's first name
 * @apiParam {String} name[last] The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner"} accountType The account type of the user.
 * @apiParam {Object} location An object containing "address", "city", "state", and "zip" fields
 * @apiParam {String} location[address] The user's street address including number and street name
 * @apiParam {String} location[city] The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} location[state] The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} location[zip] The user's zip code in number format (5 digits and valid US zip)
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
 *          "userId": "a4b751dcf51dd249"
 *      }
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": "UserNotFound"
 *     }
 *
 * @apiErrorExample WrongCredentials:
 *     HTTP/1.1 401 UNAUTHORIZED
 *     {
 *       "success": false,
 *       "error": "WrongCredentials"
 *     }
 *
 * @apiUse ServerError
 */

/**
 * @api {get} /users/hosts?id=X Get all nearby hosts location
 * @apiName GetHosts
 * @apiGroup Users
 * @apiDescription NI - This endpoint will eventually limit the search of users to a radius based on the id sent in and the search radius of that user, but for now it will grab all available hosts.
 *
 * @apiParam {String} id Sent in the request url, the user id of the user you want to match by.
 *
 * @apiSuccess {Boolean} success Will be true if hosts could be found
 * @apiSuccess {Object[]} hosts The list of hosts to display on the map
 * @apiSuccess {String} hosts.userId The user id of the host
 * @apiSuccess {Object} hosts.location The location of the host
 * @apiSuccess {Number} hosts.location.lat The lat of the host
 * @apiSuccess {Number} hosts.location.long The long of the host
 * @apiSuccess {String} hosts.accountType The account type of the host (Homeowner or Business Owner)
 *
 * @apiError {Boolean} success Will be false if no hosts could be found or the id was not found
 * @apiError {String} error An error message of what went wrong
 *
 * @apiError (500) {Boolean} success Will be false if some server error occurred.
 * @apiError (500) {Object} error An object with more information on what error occurred.
 *
 * @apiSuccessExample FoundHosts
 *    HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "hosts": [
 *              {
 *                  "userId": "8763a8290eg27bc3739",
 *                  "location": {
 *                      "lat": -97,
 *                      "long": 30
 *                  },
 *                  "accountType": "Homeowner"
 *              },
 *              ...
 *          ]
 *      }
 *
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 *
 * @apiErrorExample NoHostsFound
 *      HTTP/1.1 204 NO CONTENT
 *      {
 *          "success": false,
 *          "error": "NoHostsFound"
 *      }
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
 * @apiUse IdNotFoundError
 * @apiUse ServerError
 *
 * @apiErrorExample NoMatch:
 *     HTTP/1.1 401 UNAUTHORIZED
 *     {
 *       "success": false,
 *       "error": "NoMatch"
 *     }
 */