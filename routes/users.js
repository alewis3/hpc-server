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
      console.log("invalid email");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: email"})
  }
  else if (is.not.string(json.password)) {
      console.log("invalid password");
      return res.status(400).send({registrationStatus: false, "error": "FormattingError: password"})
  }
  else if (is.not.object(json.name)) {
      console.log("invalid name");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: name"})
  }
  else if (is.not.string(json.name.first)) {
      console.log("invalid first name");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: name.first"})
  }
  else if (is.not.string(json.name.last)) {
      console.log("invalid last name");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: name.last"})
  }
  else if (is.not.string(json.accountType) || is.not.inArray(json.accountType, ["Contributor", "Homeowner", "Business Owner", "System Admin"])) {
      console.log("invalid accountType");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: accountType"})
  }
  else if (is.not.object(json.location)) {
      console.log("invalid location");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: location"})
  }
  else if (is.not.string(json.location.address)) {
      console.log("invalid address");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: location.address"})
  }
  else if (is.not.string(json.location.city)) {
      console.log("invalid city");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: location.city"})
  }
  else if (is.not.string(json.location.state) ||
      !isValidStateAbbreviation(json.location.state.toUpperCase())) {
      console.log("invalid state");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: location.state"})
  }
  else if (is.not.number(json.location.zip) ||
      is.not.usZipCode(json.location.zip.toString())) {
      console.log("invalid zip");
      return res.status(400).send({registrationStatus: false, error: "FormattingError: location.zip"})
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
              return res.status(500).send({registrationStatus: false, error: err});
          } else {
              console.log(data);
              return res.status(201).send({registrationStatus: true});
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
  if (!email || !password) {
      return res.status(400).send({success: false, error: "MissingFields"});
  }
  await User.findOne({ email: email }).exec(function (err, user) {
      if (err) return res.status(500).send({loginStatus: false, error: err});
      else {
          if(!user) {
              return res.status(404).send({ loginStatus: false, error: "UserNotFound" });
          }

          const passwordMatch = bcrypt.compareSync(password, user.password);
          if(!passwordMatch) {
              return res.status(401).send({ loginStatus: false, error: "WrongCredentials"});
          }
          return res.status(200).send({loginStatus: true, "accountType": user.accountType, "id": user._id});
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
    if (!userId) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
    var user = await User.findById(userId).exec();
    if(!user) {
        return res.type('json').status(404).send({ success: false, error: "IdNotFound"});
    }
    if (user.accountType !== "Contributor") {
        return res.type('json').status(400).send({ success: false, error: "AccountTypeMismatch"});
    }
    else {

        // find all business owners
        let businessOwners = await User.find({accountType: "Business Owner"}).exec();

        // find all homeowners
        let homeowners = await User.find({accountType: "Homeowner"}).exec();

        businessOwners = reformatBusinessOwners(businessOwners);
        homeowners = reformatHomeowers(homeowners);
        // if both lists are empty, return a 204
        if (!businessOwners && !homeowners) {
            return res.type('json').status(204).send({success: true, homeowners: [], businessOwners: []});
        }
        // otherwise return the lists as they are
        else {
            return res.type('json').status(200).send({success: true, homeowners: homeowners, businessOwners: businessOwners});
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
    if (!userId) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
    var user = await User.findById(userId).exec();
    if(!user) {
        return res.type('json').status(404).send({ success: false, error: "IdNotFound"});
    }
    if (user.accountType !== "Contributor") {
        return res.type('json').status(400).send({ success: false, error: "AccountTypeMismatch"});
    }
    else {
        var clat = user.location.lat;
        var clong = user.location.long;
        var cradius = user.radius;

        // find all business owners in range and not blocked by this user or have blocked this user
        let businessOwners = await User.find({_id: {$nin: [...user.blockedUsers, ...user.blockedBy]}, accountType: "Business Owner"}).exec();

        // find all homeowners in range and not blocked by the user
        let homeowners = await User.find({_id: {$nin: [...user.blockedUsers, ...user.blockedBy]}, accountType: "Homeowner"}).exec();
        console.log("business owners: " + businessOwners);
        console.log("homeowners: " + homeowners);
        if (!businessOwners && !homeowners) {
            return res.type('json').status(204).send({success: true, homeowners: [], businessOwners: []});
        }
        else {
            // filter out business owners not in the range
            let filteredBOs = businessOwners.filter(function (bo) {
                let hradius = bo.radius;
                let hlat = bo.location.lat;
                let hlong = bo.location.long;
                return withinRange(clat, clong, cradius, hlat, hlong, hradius);
            });
            console.log("filtered business owners: " + filteredBOs);
            // this call is reformatting the business owner objects to have keys to match the documentation
            businessOwners = reformatBusinessOwners(filteredBOs);

            // filter out homeowners not in the range
            let filteredHOs = homeowners.filter(function (ho) {
                let hradius = ho.radius;
                let hlat = ho.homeownerInfo.meetingPlace.lat;
                let hlong = ho.homeownerInfo.meetingPlace.long;
                return withinRange(clat, clong, cradius, hlat, hlong, hradius);
            });
            console.log("filtered homeowners: " + filteredHOs);
            // this call is reformatting the homeowner objects to have keys to match the documentation
            homeowners = reformatHomeowers(filteredHOs);
            return res.type('json').status(200).send({success: true, homeowners: homeowners, businessOwners: businessOwners});
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
    if (!json.id) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
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

/**
 * Patch block user
 *
 * See https://hpcompost.com/api/docs#api-Users-PatchBlockUser for more information
 */
router.patch('/blockUser', async function(req, res) {
   let body = req.body;
    if (!body.blockingUser || !body.blockedUser) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
    if (body.blockingUser === body.blockedUser) {
        return res.status(400).send({success: false, error: "A user cannot block thyself!."});
    }
   let blockingUser = await User.findById(body.blockingUser).exec();
   let blockedUser = await User.findById(body.blockedUser).exec();
   if (!blockingUser) {
       return res.status(400).send({success: false, error: "Blocking User does not exist."});
   }
    else if (!blockedUser) {
        return res.status(400).send({success: false, error: "Blocked User does not exist."});
    }
    if (!blockingUser.blockedUsers.includes(blockedUser._id) || !blockedUser.blockedBy.includes(blockingUser._id)) {
        let blocked = blockingUser.blockUser(blockedUser, function (err) {
            return !err;
        });
        if (blocked) {
            return res.status(200).send({success: true});
        } else {
            return res.status(500).send({success: false, error: "Unable to block"})
        }
    }
    else {
        return res.status(400).send({success: false, error: "User already blocked."})
    }
});

/**
 * Patch unblock user
 *
 * See https://hpcompost.com/api/docs#api-Users-PatchUnblockUser for more information
 */
router.patch('/unblockUser', async function(req, res) {
    let body = req.body;
    if (!body.unblockingUser || !body.unblockedUser) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
    if (body.unblockingUser === body.unblockedUser) {
        return res.status(400).send({success: false, error: "A user cannot block thyself!."});
    }
    let unblockingUser = await User.findById(body.unblockingUser).exec();
    let unblockedUser = await User.findById(body.unblockedUser).exec();
    if (!unblockingUser) {
        return res.status(400).send({success: false, error: "Unblocking User does not exist."});
    }
    else if (!unblockedUser) {
        return res.status(400).send({success: false, error: "Unblocked User does not exist."});
    }
    if (unblockingUser.blockedUsers.includes(unblockedUser._id) && unblockedUser.blockedBy.includes(unblockingUser._id)) {
        let unblocked = unblockingUser.unblockUser(unblockedUser, function (err) {
            return !err;
        });
        if (unblocked) {
            return res.status(200).send({success: true});
        } else {
            return res.status(500).send({success: false, error: "Unable to unblock"})
        }
    }
    else {
        return res.status(400).send({success: false, error: "User is not blocked."})
    }
});

/**
 * Patch block user by email
 *
 * See https://hpcompost.com/api/docs#api-Users-PatchBlockUserEmail for more information
 */
router.patch('/blockUserEmail', async function(req, res) {
    let body = req.body;
    if (!body.blockingUserId || !body.blockedUserEmail) {
        return res.status(400).send({success: false, error: "MissingEmail"});
    }
    if (body.blockingUserId === body.blockedUserEmail) {
        return res.status(400).send({success: false, error: "A user cannot block thyself!."});
    }
    let blockingUser = await User.findById(body.blockingUserId).exec();
    let blockedUser = await User.findOne({email: body.blockedUserEmail}).exec();
    if (!blockingUser) {
        return res.status(400).send({success: false, error: "Blocking User does not exist."});
    }
    else if (!blockedUser) {
        return res.status(400).send({success: false, error: "Blocked User does not exist."});
    }
    if (!blockingUser.blockedUsers.includes(blockedUser._id) || !blockedUser.blockedBy.includes(blockingUser._id)) {
        let blocked = blockingUser.blockUser(blockedUser, function (err) {
            return !err;
        });
        if (blocked) {
            return res.status(200).send({success: true});
        } else {
            return res.status(500).send({success: false, error: "Unable to block"})
        }
    }
    else {
        return res.status(400).send({success: false, error: "User already blocked."})
    }
});

/**
 * Patch unblock user by email
 *
 * See https://hpcompost.com/api/docs#api-Users-PatchUnblockUserEmail for more information
 */
router.patch('/unblockUserEmail', async function(req, res) {
    let body = req.body;
    if (!body.unblockingUserId || !body.unblockedUserEmail) {
        return res.status(400).send({success: false, error: "MissingEmail"});
    }
    if (body.unblockingUserId === body.unblockedUserEmail) {
        return res.status(400).send({success: false, error: "A user cannot block thyself!"});
    }
    let unblockingUser = await User.findOne({email: body.unblockingUserId}).exec();
    let unblockedUser = await User.findOne({email: body.unblockedUserEmail}).exec();
    if (!unblockingUser) {
        return res.status(400).send({success: false, error: "Unblocking User does not exist."});
    }
    else if (!unblockedUser) {
        return res.status(400).send({success: false, error: "Unblocked User does not exist."});
    }
    if (unblockingUser.blockedUsers.includes(unblockedUser._id) && unblockedUser.blockedBy.includes(unblockingUser._id)) {
        let unblocked = unblockingUser.unblockUser(unblockedUser, function (err) {
            return !err;
        });
        if (unblocked) {
            return res.status(200).send({success: true});
        } else {
            return res.status(500).send({success: false, error: "Unable to unblock"})
        }
    }
    else {
        return res.status(400).send({success: false, error: "User is not blocked."})
    }
});

/**
 * Get User id from email
 *
 * See https://hpcompost.com/api/docs#api-Users-GetId for more info
 */
router.get('/getId', async function(req, res) {
    let email = req.query.email;
    let user = await User.findOne({email: email}).exec();
    if (!user) {
        return res.status(400).send({success: false, error: "EmailNotFound"});
    }
    else {
        return res.status(200).send({success: true, id: user._id});
    }
});

module.exports = router;
