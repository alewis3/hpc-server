var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const is = require("is_js");
let User = require('../models/User');
let withinRange = require('../helpers/withinRange');
let reformatHomeowers = require('../helpers/reformatHomeowners');
let reformatBusinessOwners = require('../helpers/reformatBusinessOwners');
let isValidStateAbbreviation = require('../helpers/isValidStateAbbreviation');

/**
 * POST register route
 *
 * For registering new users.
 * See https://hpcompost.com/api/docs#api-Users-CreateUser for more information
 */
router.post("/register", async (req, res) => {

  const json = req.body;

  // checking if the body contains valid input, if not, return a 400 BAD REQUEST with a FormattingError
  if (is.not.string(json.email) || is.not.email(json.email)) {
      res.status(400).send({success: false, error: "FormattingError: email"})
  }
  else if (is.not.string(json.password)) {
      res.status(400).send({success: false, "error": "FormattingError: password"})
  }
  else if (is.not.object(json.name)) {
      res.status(400).send({success: false, error: "FormattingError: name"})
  }
  else if (is.not.string(json.name.first)) {
      res.status(400).send({success: false, error: "FormattingError: name.first"})
  }
  else if (is.not.string(json.name.last)) {
      res.status(400).send({success: false, error: "FormattingError: name.last"})
  }
  else if (is.not.string(json.accountType) || is.not.inArray(json.accountType, ["Contributor", "Homeowner", "Business Owner", "System Admin"])) {
      res.status(400).send({success: false, error: "FormattingError: accountType"})
  }
  else if (is.not.object(json.location)) {
      res.status(400).send({success: false, error: "FormattingError: location"})
  }
  else if (is.not.string(json.location.address)) {
      res.status(400).send({success: false, error: "FormattingError: location.address"})
  }
  else if (is.not.string(json.location.city)) {
      res.status(400).send({success: false, error: "FormattingError: location.city"})
  }
  else if (is.not.string(json.location.state) ||
      !isValidStateAbbreviation(json.location.state.toUpperCase())) {
      res.status(400).send({success: false, error: "FormattingError: location.state"})
  }
  else if (is.not.number(json.location.zip) ||
      is.not.usZipCode(json.location.zip.toString())) {
      res.status(400).send({success: false, error: "FormattingError: location.zip"})
  }
  // if no bad data was found, create a new user using the data!
  else {
      var newUser = new User({
          email: json.email,
          password: json.password,
          name: {
              first: json.name.first,
              last: json.name.last
          },
          accountType: json.accountType,
          location: {
              address: json.location.address,
              city: json.location.city,
              state: json.location.state,
              zip: json.location.zip
          },
      });

      // aaaaand save it! The pre-save hooks in ../models/User.js will format the email, name (first and last)
      // and the location's address, city, and state!
      newUser.save(function (err, data) {
          if (err) {
              console.log(err);
              res.status(500).send({success: false, error: err});
          } else {
              console.log(data);
              res.status(201).send({success: true});
          }
      });
  } // end of else to check if valid
});

/**
 * POST login route
 *
 * For logging in users.
 * See https://hpcompost.com/api/docs#api-Users-LoginUser for more information
 */
router.post('/login', async (req, res) => {
  const json = req.body;
  const email = json.email;
  const password = json.password;
  console.log(email);
  await User.findOne({ email: email }).exec(function (err, user) {
      if (err) return res.status(500).send({success: false, error: err});
      else {
          if(!user) {
              return res.status(404).send({ success: false, error: "UserNotFound" });
          }

          const passwordMatch = bcrypt.compareSync(password, user.password);
          if(!passwordMatch) {
              return res.status(401).send({ success: false, error: "WrongCredentials"});
          }
          return res.status(200).send({success: true, "accountType": user.accountType, "id": user._id});
      }
  });
}); // end of login route impl

/**
 * GET hostsAll
 *
 * To get all hosts for a contributor (For test use only, not for prod)
 * See https://hpcompost.com/api/docs#api-Users-GetHostsAll for more info
 */
router.get('/hostsAll', async function(req, res) {
    var userId = req.query.id;
    var user = await User.findById(userId).exec();
    if(!user) {
        return res.status(404).send({ success: false, error: "IdNotFound"});
    }
    if (user.accountType !== "Contributor") {
        return res.status(400).send({ success: false, error: "AccountTypeMismatch"});
    }
    else {

        // find all business owners in range
        let businessOwners = User.find({accountType: "Business Owner"}).select("location.lat location.long radius allowedItems prohibitedItems businessOwnerInfo name").exec(function (err, businessOwners) {
            if (err) {
                return res.status(500).send({success: false, error: err});
            }
            else {
                // this call is reformatting the business owner objects to have keys to match the documentation
                return reformatBusinessOwners(businessOwners);
            }
        });

        // find all homeowners in range
        let homeowners = User.find({accountType: "Homeowner"}).select("homeownerInfo.meetingPlace.lat homeownerInfo.meetingPlace.long radius allowedItems prohibitedItems name homeowerInfo.isListingOn").exec(function (err, homeowners) {
            if (err) {
                return res.status(500).send({success: false, error: err});
            }
            else {
                // this call is reformatting the homeowner objects to have keys to match the documentation
                return reformatHomeowers(homeowners);
            }
        });

        // if both lists are empty, return a 204
        if (businessOwners.length === 0 && homeowners.length === 0) {
            return res.status(204).send({success: true, homeowners: [], businessOwners: []});
        }
        // otherwise return the lists as they are
        else {
            return res.status(200).send({success: true, homeowners: homeowners, businessOwners: businessOwners});
        }
    }
});

/**
 * GET hosts
 *
 * To get all valid hosts for a contributor
 * See https://hpcompost.com/api/docs#api-Users-GetHosts for more info
 */
router.get('/hosts', async function(req, res) {
    var userId = req.query.id;
    var user = await User.findById(userId).exec();
    if(!user) {
        return res.status(404).send({ success: false, error: "IdNotFound"});
    }
    if (user.accountType !== "Contributor") {
        return res.status(400).send({ success: false, error: "AccountTypeMismatch"});
    }
    else {
        var clat = user.location.lat;
        var clong = user.location.long;
        var cradius = user.radius;

        // find all business owners in range and not blocked by this user or have blocked this user
        let businessOwners = User.find({_id: {$nin: user.blockedUsers, $nin: user.blockedBy}, accountType: "Business Owner"}).select("location.lat location.long radius allowedItems prohibitedItems businessOwnerInfo name").exec(function (err, businessOwners) {
            if (err) {
                return res.status(500).send({success: false, error: err});
            }
            else {
                // filter out business owners not in the range
                let filtered = businessOwners.filter(function(bo) {
                    let hradius = bo.radius;
                    let hlat = bo.location.lat;
                    let hlong = bo.location.long;
                    return withinRange(clat, clong, cradius, hlat, hlong, hradius));
                });
                // this call is reformatting the business owner objects to have keys to match the documentation
                return reformatBusinessOwners(filtered);
            }
        });

        // find all homeowners in range and not blocked by the user
        let homeowners = User.find({_id: {$nin: [...user.blockedUsers, ...user.blockedBy]}, accountType: "Homeowner"}).select("homeownerInfo.meetingPlace.lat homeownerInfo.meetingPlace.long radius allowedItems prohibitedItems name homeowerInfo.isListingOn").exec(function (err, homeowners) {
            if (err) {
                return res.status(500).send({success: false, error: err});
            }
            else {
                // filter out homeowners not in the range
                let filtered =  homeowners.filter(function(ho) {
                    let hradius = ho.radius;
                    let hlat = ho.homeownerInfo.meetingPlace.lat;
                    let hlong = ho.homeownerInfo.meetingPlace.long;
                    return withinRange(clat, clong, cradius, hlat, hlong, hradius);
                });
                // this call is reformatting the homeowner objects to have keys to match the documentation
                return reformatHomeowers(filtered);
            }
        });

        // if both lists are empty, return a 204
        if (businessOwners.length === 0 && homeowners.length === 0) {
            return res.status(204).send({success: true, homeowners: [], businessOwners: []});
        }
        // otherwise return the lists as they are
        else {
            return res.status(200).send({success: true, homeowners: homeowners, businessOwners: businessOwners});
        }
    }
});

/**
 * POST reset password route
 *
 * Used to reset a user's password.
 * See https://hpcompost.com/api/docs#api-Users-ResetPassword for more information
 */
router.post('/resetPassword', async function (req, res) {
    var json = req.body;
    var user = await User.findById(json.id).exec();

    // check to make sure we got a user back
    if(!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }

    // check to make sure the passwords match (the 'old'
    // password that was sent in should equal user.password)
    const passwordMatch = bcrypt.compareSync(json.old, user.password);

    // if the passwords do not match, send a 401 unauthorized
    if(!passwordMatch) {
        return res.status(401).send({ success: false, error: "NoMatch" });
    }
    // otherwise set the user.password to the 'new' password sent in
    else {
        user.password = json.new;
        user.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send({success: false, error: err});
            }
            else {
                return res.status(200).send({success: true});
            }
        });
    }
});

module.exports = router;
