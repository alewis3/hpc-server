var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const is = require("is_js");
let mongoose = require('mongoose');
let User = require('../models/User');

/**
 * @apiDefine 201 Created 201
 * The user was created successfully.
 */
/**
 * @api {post} /users/register Create/register a new user
 * @apiName CreateUser
 * @apiGroup Users
 * @apiDescription This route handles registering a user. The request will include an email, password, first and last name, account type, and a birthday in string format.
 *
 * @apiParam {String} email A unique email to register with (This acts as their username)
 * @apiParam {String} password A strong password in plaintext. This is hashed on the API side.
 * @apiParam {Object} name An object containing "first" and "last" fields
 * @apiParam {String} name[first] The user's first name
 * @apiParam {String} name[last] The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner"} accountType The account type of the user.
 * @apiParam {String} dob The user's Date of Birth in "MM/DD/YYYY" format
 * @apiParam {Object} location An object containing "streetAddress", "city", "state", and "zip" fields
 * @apiParam {String} location[address] The user's street Address including number and street name
 * @apiParam {String} location[city] The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} location[state] The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} location[zip] -> The user's zip code in number format (5 digits and valid US zip)
 *
 * @apiParamExample {json} Valid-Request-Example:
 *      {
 *          "email": "alewis3@stedwards.edu",
 *          "password": "password",
 *          "name": {
 *              "first": "Amanda",
 *              "last": "Lewis"
 *          },
 *          "accountType": "Homeowner",
 *          "dob": "07/16/1998"
 *          "location": {
 *              "address": "3001 S. Congress Ave.",
 *              "city": "Austin",
 *              "state": "TX",
 *              "zip": 78704
 *          }
 *      }
 *
 * @apiSuccess (201) {Boolean} registrationStatus Will be true if successful registration
 *
 * @apiSuccessExample CreatedResponse:
 *      HTTP/1.1 201 CREATED
 *      {
 *          "registrationStatus": true
 *      }
 *
 * @apiError FormattingError The body of the request was not formatted properly.
 *
 * @apiErrorExample BadRequest:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "registrationStatus": false,
 *         "error": "FormattingError: ______"
 *     }
 */
router.post("/register", async (req, res) => {

  const json = req.body;

  if (is.not.string(json.email) || is.not.email(json.email)) {
      res.status(400).send({"registrationStatus": false, "error": "FormattingError: Email"})
  }
  else if (is.not.string(json.password)) {
      res.status(400).send({"registrationStatus": false, "error": "FormattingError: Password"})
  }
  else if (is.not.string(json.name.first) || is.not.string(json.name.last)) {
      res.status(400).send({"registrationStatus": false, "error": "FormattingError: Name"})
  }
  else if (is.not.string(json.accountType) || is.not.inArray(json.accountType, ["Contributor", "Homeowner", "Business Owner"])) {
      res.status(400).send({"registrationStatus": false, "error": "FormattingError: Account Type"})
  }
  else if (is.not.string(json.dob) || is.not.dateString(json.dob)) {
      res.status(400).send({"registrationStatus": false, "error": "FormattingError: Birthday"})
  }
  else if (is.not.object(json.location) ||
      is.not.string(json.location.address) ||
      is.not.string(json.location.city) ||
      is.not.string(json.location.state) ||
      (json.location.state.length !== 2) ||
      is.not.number(json.location.zip) ||
      is.not.usZipCode(json.location.zip)
  ) {
      res.status(400).send({"registrationStatus": false, "error": "Address not formatted properly."})
  }
  else {
      var newUser = new User({
          email: json.email,
          password: json.password,
          name: {
              first: json.name.first,
              last: json.name.last
          },
          accountType: json.accountType,
          dob: json.dob,
          location: {
              address: json.location.address,
              city: json.location.city,
              state: json.location.state,
              zip: json.location.zip
          },
      });

      newUser.save(function (err, data) {
          if (err) {
              console.log(err);
              res.status(400).send({"registrationStatus": false, "error": err});
          } else {
              console.log(data);
              res.status(201).send({"registrationStatus": true});
          }
      });
  } // end of else to check if valid
});

/**
 * This route handles logging in a user. This is after the user has been authenticated.
 * The validated field must be true for this user.
 *
 * @api {post} /users/login Authenticate a user for login
 * @apiName LoginUser
 * @apiGroup Users
 *
 * @apiParam {String} email The email that the user signed up with
 * @apiParam {String} password The password that the user signed up with
 *
 * @apiSuccess {Boolean} loginStatus Will be true if successful login
 * @apiSuccess {String} accountType The type of the user that was authenticated
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "loginStatus": true,
 *          "accountType": "Contributor"
 *      }
 *
 * @apiError UserNotFound The email of the user could not be found
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "loginStatus": false,
 *       "error": "UserNotFound"
 *     }
 *
 * @apiError WrongCredentials The password of the user does not match the password in the DB
 *
 * @apiErrorExample WrongCredentials:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "loginStatus": false,
 *       "error": "WrongCredentials"
 *     }
 *
 */
router.post('/login', async (req, res) => {
  const json = req.body;
  const email = json.email;
  const password = json.password;
  console.log(email);
  var user = await User.findOne({ email: email }).exec();
  if(!user) {
    return res.status(401).send({ loginStatus: false, message: "The username does not exist" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    return res.status(401).send({ loginStatus: false, error: "WrongCredentials" });
  }
  return res.status(200).send({loginStatus: true, "accountType": user.accountType, "id": user._id});
});

/*
 * @api {patch} /users/profile Let a user edit or update their profile
 * @apiName PatchProfile
 * @apiGroup Users
 * @apiDescription This path will be called on whenever the user makes changes to their account and presses save. All fields are optional but at least one must be sent in for the request call to make sense.
 *
 * @apiParam {String} [email] A unique email to register with (This acts as their username)
 * @apiParam {String} [password] A strong password in plaintext. This is hashed on the API side.
 * @apiParam {Object} [name] An object containing "first" and "last" fields
 * @apiParam {String} [name[first]] The user's first name
 * @apiParam {String} [name[last]] The user's last name
 * @apiParam {String="Contributor", "Homeowner", "Business Owner"} [accountType] The account type of the user.
 * @apiParam {String} [dob] The user's Date of Birth in "MM/DD/YYYY" format
 * @apiParam {Object} [location] An object containing "streetAddress", "city", "state", and "zip" fields
 * @apiParam {String} [location[streetAddress]] The user's street Address including number and street name
 * @apiParam {String} [location[city]] The user's city e.g. "Austin" or "Dallas"
 * @apiParam {String{2}} [location[state]] The user's state in this format: Texas -> "TX" or California -> "CA", etc
 * @apiParam {Number} [location[zip]] -> The user's zip code in number format (5 digits and valid US zip)
 */

/**
 * @api {get} /users/hosts?user_id=X Get all nearby hosts location
 * @apiName GetHosts
 * @apiGroup Users
 * @apiDescription This endpoint will eventually limit the search of users to a radius based on the user_id sent in and the search radius of that user, but for now it will grab all available hosts.
 *
 * @apiSuccess {Object[]} hosts The list of hosts to display on the map
 * @apiSuccess {String} hosts.userId The user id of the host
 * @apiSuccess {Object} hosts.location The location of the host
 * @apiSuccess {Number} hosts.location.lat The lat of the host
 * @apiSuccess {Number} hosts.location.long The long of the host
 * @apiSuccess {String} hosts.accountType The account type of the host (Homeowner or Business Owner)
 */
router.get('/hosts', function(req, res) {
    var userId = req.query.userId;

});


/*
 * This path handles validating a user after they register. in the get request query
 * there are two variables, the userId, and the token to match to. It calls the static 
 * method validateUser and sends in those two tokens. Validate user will update the validated
 * attribute of this user to true if the tokens match and if not, it will not do anything and 
 * throw an error.
 */
/*
router.get('/validate', async (req, res) => {
  const userId = req.query.userId;
  const token = req.query.token;

  var user = await User.validateUser(userId, token, function(err, data) {
    if (err) {
      console.log("The user could not be validated.");
      res.status(403).render('failure', {title: "Your account was not confirmed!"});
      throw err;
    }
    else {
      if (data != null) {
        console.log(data);
        res.status(200).render('success', {title: "Thank you for confirming your account!", name: data.name.first});
      }
      else {
        res.status(403).render('failure', {title: "Your account was not confirmed!"});
      }
      return data;
    }
  });

});
*/
/*
function testmail(email, firstName, lastName, subject, body, htmlBody) {

  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Message object
    let message = {
        from: 'NO_REPLY <no-reply@hpcompost.com>',
        to: firstName + ' ' + lastName +  '<' + email + '>',
        subject: String(subject),
        text: String(body),
        html: String(htmlBody)
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});

}
*/

module.exports = router;
