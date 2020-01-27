var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const is = require("is_js");
let User = require('../models/User');

/**
 * POST register route
 *
 * For registering new users.
 * See https://hpcompost.com/api/docs#api-Users-CreateUser for more information
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
  var user = await User.findOne({ email: email }).exec();
  if(!user) {
    return res.status(401).send({ loginStatus: false, error: "The username does not exist" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    return res.status(401).send({ loginStatus: false, error: "WrongCredentials"});
  }
  return res.status(200).send({loginStatus: true, "accountType": user.accountType, "id": user._id});
}); // end of login route impl

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

    // TODO add this error response to docs
    if (user.accountType !== "Contributor") {
        return res.status(400).send({ success: false, error: "AccountTypeMismatch"});
    }
    else {
        var clat = user.location.lat;
        var clong = user.location.long;
        var cradius = user.radius;
        await User.find({accountType: {$in: ["Homeowner", "Business Owner"]}})
            .select("location.lat location.long accountType radius")
            .exec(function (err, hosts) {
                if (hosts.length === 0) {
                    // todo change the no content response to a successful response in the docs
                    return res.status(204).send({success: true, hosts: []});
                }
                else {
                    /*
                    // this will be used once we have radii in the db
                    var filteredHosts = hosts.filter(function(element) {
                        var hradius = element.radius;
                        var hlat = element.location.lat;
                        var hlong = element.location.long;
                        // distance = sqrt[(x2 - x1)^2 + (y2 - y1)^2]
                        // or more specifically:
                        // distance = sqrt[(ContributorLat - HostLat)^2 + (ContributorLong - HostLong)^2]
                        var distance = Math.sqrt((Math.pow((clat - hlat), 2) + Math.pow((clong - hlong), 2)));
                        return cradius > distance && hradius > distance;
                    });
                     */
                    // for now just return a list of all the hosts
                    return res.status(200).send({success: true, hosts: hosts});
                }
        });
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
    if(!user) {
        return res.status(401).send({ success: false, error: "The id does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(json.old, user.password);
    if(!passwordMatch) {
        return res.status(401).send({ success: false, error: "No password match" });
    }
    else {
        user.password = json.new;
        user.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send({success: false, error: "User could not be saved"});
            }
            else {
                return res.status(200).send({success: true});
            }
        });
    }
});

module.exports = router;
