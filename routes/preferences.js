var express = require('express');
var router = express.Router();
let User = require('../models/User');
const is = require("is_js");
const bcrypt = require('bcryptjs');
/**
 * get allowed items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-GetAllowedItems for more information
 */
router.get('/allowedItems', async function (req, res) {
    var id = req.query.id;

    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }

    var user = await User.findById(id).exec();
    if(!user) {
        return res.status(400).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch"});
    }
    else {
        let allowed = user.allowedItems;
        console.log(user);
        console.log(allowed);
        if (is.undefined(allowed) || is.null(allowed)) {
            return res.status(204).send({success: true, allowedItems: ""});
        }
        else {
            return res.status(200).send({success: true, allowedItems: allowed});
        }
    }
});

/**
 * get prohibited items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-GetProhibitedItems
 */
router.get('/prohibitedItems', async function (req, res) {
    var id = req.query.id;

    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }

    var user = await User.findById(id).exec();
    if(!user) {
        return res.status(400).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch"});
    }
    else {
        let prohibit = user.prohibitedItems;
        if (is.undefined(prohibit) || is.null(prohibit)) {
            return res.status(204).send({success: true, prohibitedItems: ""});
        }
        else {
            return res.status(200).send({success: true, prohibitedItems: prohibit});
        }
    }
});

/**
 * post allowed items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PostAllowedItems for more info
 */
router.post('/allowedItems', async function (req, res) {
    var json = req.body;
    var id = json.id;

    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }

    var user = await User.findById(id).exec();
    if(!user) {
        return res.status(400).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch"});
    }
    else {
        user.allowedItems = json.allowedItems;
        await user.save(function(err) {
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
 * post prohibited items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PostProhibitedItems for more info
 */
router.post('/prohibitedItems', async function (req, res) {
    var json = req.body;
    var id = json.id;

    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }

    var user = await User.findById(id).exec();
    if(!user) {
        return res.status(400).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch"});
    }
    else {
        user.prohibitedItems = json.prohibitedItems;
        await user.save(function(err) {
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

/**
 * Patch disable listing
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchDisableListing for more info
 */
router.patch('/disableListing', async function(req, res) {
    let id = req.body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else {
        if (user.accountType === "Homeowner") {
            user.homeownerInfo.isListingOn = false;
        }
        else if (user.accountType === "Business Owner") {
            user.businessOwnerInfo.isListingOn = false;
        }
        else {
            return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
        }
        await user.save();
        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Patch enable listing
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchEnableListing for more info
 */
router.patch('/enableListing', async function(req, res) {
    let id = req.body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else {
        if (user.accountType === "Homeowner") {
            user.homeownerInfo.isListingOn = true;
        }
        else if (user.accountType === "Business Owner") {
            user.businessOwnerInfo.isListingOn = true;
        }
        else {
            return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
        }
        await user.save();
        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Patch update listing
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchUpdateListing for more info
 */
router.patch('/updateListing', async function(req, res) {
    let id = req.body.id;
    let isListingOn = req.body.isListingOn;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (is.not.boolean(isListingOn)) {
        return res.status(400).send({success: false, error: "ParameterTypeMismatch"})
    }
    else {
        if (user.accountType === "Homeowner") {
            user.homeownerInfo.isListingOn = isListingOn;
        }
        else if (user.accountType === "Business Owner") {
            user.businessOwnerInfo.isListingOn = isListingOn;
        }
        else {
            return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
        }
        await user.save();
        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Get isListingOn
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchGetListing for more info
 */
router.get('/isListingOn', async function(req, res) {
    let id = req.query.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else {
        var isListingOn;
        console.log(user);
        console.log(user.accountType);
        if (user.accountType === "Homeowner") {
            isListingOn = user.homeownerInfo.isListingOn;
        }
        else if (user.accountType === "Business Owner") {
            isListingOn = user.businessOwnerInfo.isListingOn;
        }
        else {
            return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
        }
        return res.status(200).send({success: true, isListingOn: isListingOn});
    }
});

/**
 * Patch Profile
 *
 * See https://hpcompost.com/api/docs#api-Preferences_General-PatchProfile for more info
 */
router.patch('/profile', async function (req, res) {
   let body = req.body;
   let id = body.id;
   if (is.undefined(id) || id.length === 0) {
       return res.status(400).send({success: false, error: "MissingId"})
   }
   // grab the user
   let user = await User.findOne({_id: id}).exec();
   // if the user is null, return a 404
   if (!user) {
       return res.status(404).send({ success: false, error: "IdNotFound" });
   }
   // if the email exists, update user and then save to make sure the email was unique.
   if (is.existy(body.email) && is.string(body.email)) {
       console.log("Checking unique email");
       let emailCheck = await User.findOne({email: body.email}).exec();
       if (!emailCheck) {
           console.log("Email unique");
           user.email = body.email;
       }
       else {
           console.log("Email not unique");
           return res.status(400).send({success: false, error: "UserUpdateError: Non-Unique Email"});
       }
   }
   else if (is.existy(body.email) && is.not.string(body.email)) {
       return res.status(400).send({success: false, error: "UserUpdateError: Email not a string"});
   }

   // if the password old AND new exists, update the password using helper method
   if (is.existy(body.passwordOld) && is.string(body.passwordOld) && is.existy(body.passwordNew) && is.string(body.passwordNew)) {
       console.log("Updating password");

       // check passwords to make sure they match
       const passwordMatch = bcrypt.compareSync(body.passwordOld, user.password);
       // reset password sets the user's password field to the new password, if they match
       if (!passwordMatch) {
           return res.status(400).send({success: false, error: "UserUpdateError: Passwords do not match!"})
       }
       else {
           console.log("password matched!");
           user.password = body.passwordNew;
       }
   }
   else if ((is.existy(body.passwordOld) && is.not.string(body.passwordOld)) || (is.existy(body.passwordNew) && is.not.string(body.passwordNew))) {
       return res.status(400).send({success: false, error: "UserUpdateError: Password (old AND new) must be a string"});
   }

    // if the name exists, then check each value in it
    if(is.existy(body.name) && is.not.empty(body.name) && is.object(body.name)) {
        console.log("Updating name");
        user.name = body.name;
    }
    else if (is.existy(body.name) && is.not.object(body.name)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Name not an object"});
    }

    // if the account type is changing, update the account type
    if (is.existy(body.accountType) && is.string(body.accountType)) {
        console.log("Updating acct type");
        user.accountType = body.accountType;
    }
    else if (is.existy(body.accountType) && is.not.string(body.accountType)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Account Type not a string"});
    }

    // if the location is there, reset their location
    if (is.existy(body.location) && is.object(body.location)) {
        console.log("updating location");
        if (is.string(body.location.address) && is.string(body.location.city) && is.string(body.location.state) && is.number(body.location.zip)) {
            user.location = body.location;
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Location components improperly formatted"});
        }
    }
    else if (is.existy(body.location) && is.not.object(body.location)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Location not an object"});
    }

    // if the allowedItems is not empty, set it if they are not a contributor (Hosts only)
    if (is.existy(body.allowedItems) && is.string(body.allowedItems) && user.accountType !== "Contributor") {
        console.log("updating allowed items");
        user.allowedItems = body.allowedItems;
    }
    else if (is.existy(body.allowedItems) && is.not.string(body.allowedItems)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Allowed items not a string"});
    }
    // if this field does exist, and they are a contributor, throw an AccountTypeMismatchError
    else if (is.existy(body.allowedItems)) {
        console.log("Contributor tried to update allowed items");
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }

    // if the prohibited items is not empty, set it if they are not a contributor (Hosts only)
    if (is.existy(body.prohibitedItems) && is.string(body.prohibitedItems) && user.accountType !== "Contributor") {
        console.log("Updating prohibited items");
        user.prohibitedItems = body.prohibitedItems;
    }
    else if (is.existy(body.prohibitedItems) && is.not.string(body.prohibitedItems)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items not a string"});
    }
    // if this field does exist, and they are a contributor, throw an AccountTypeMismatchError
    else if (is.existy(body.prohibitedItems)) {
        console.log("Contributor tried to update prohibited items");
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }

    // if the radius is not empty, set it
    if (is.existy(body.radius) && is.number(body.radius)) {
        console.log("updating radius");
        user.radius = body.radius;
    }
    else if (is.existy(body.radius) && is.not.number(body.radius)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
    }

    // if the homeowner info is not empty, set it
    if (is.existy(body.homeownerInfo) && is.not.empty(body.homeownerInfo) && is.object(body.homeownerInfo) && user.accountType === "Homeowner") {
        console.log("Updating homeowner info");
        user.homeownerInfo = body.homeownerInfo;
    }
    else if (is.existy(body.homeownerInfo) && is.not.object(body.homeownerInfo)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Homeowner info not an object"});
    }
    else if (is.existy(body.homeownerInfo) && user.accountType !== "Homeowner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }

    // if the business owner info is not empty, set it
    if (is.existy(body.businessOwnerInfo) && is.not.empty(body.businessOwnerInfo) && is.object(body.businessOwnerInfo) && user.accountType === "Business Owner") {
        console.log("Updating businessOwnerInfo");
        user.businessOwnerInfo = body.businessOwnerInfo;
    }
    else if (is.existy(body.businessOwnerInfo) && is.not.object(body.businessOwnerInfo)) {
        return res.status(400).send({success: false, error: "UserUpdateError: Business owner info not an object"});
    }
    else if (is.existy(body.businessOwnerInfo) && user.accountType !== "Business Owner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }
    console.log(user);

    console.log("Saving user");
    await user.save();
    await User.findById(id)
        .then(function() {
        res.status(200).send({success: true});
    })
        .catch(function(err) {
            res.status(500).send({success: false, error: err});
        });
});

/**
 * Get Profile
 *
 * See https://hpcompost.com/api/docs#api-Preferences_General-GetProfile for more info
 */
router.get('/profile', async function(req, res) {
    let id = req.query.id;
    if (is.undefined(id) || id.length === 0) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    await User.findById(id).exec(function(err, user) {
        if (err) {
            console.log(err);
            return err;
        }
        else if (!user) {
            return res.status(400).send({success: false, error: "IdNotFound"})
        }
        else {
            // here i want to format the returned doc so that null values are not included
            // not entirely necessary but I do not want null values returned.
            var retDoc = {
                email: user.email,
                name: user.name,
                accountType: user.accountType,
                location: user.location,
                radius: user.radius,
                blockedUsers: user.blockedUsers
            };

            if (user.accountType === "Homeowner") {
                retDoc['allowedItems'] = user.allowedItems;
                retDoc['prohibitedItems'] = user.prohibitedItems;
                retDoc['homeownerInfo'] = user.homeownerInfo;
            }
            else if (user.accountType === "Business Owner") {
                retDoc['allowedItems'] = user.allowedItems;
                retDoc['prohibitedItems'] = user.prohibitedItems;
                retDoc['businessOwnerInfo'] = user.businessOwnerInfo;
            }
            return res.status(200).send({success: true, user: retDoc});
        }
    });
});

/**
 * Patch homeownerInfo
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchHomeownerInfo for more info
 */
router.patch('/homeownerInfo', async function(req, res) {
    let body = req.body;
    let id = body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType !== "Homeowner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }
    else {
        // if the allowedItems is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.allowedItems) && is.string(body.allowedItems)) {
            console.log("updating allowed items");
            user.allowedItems = body.allowedItems;
        }
        else if (is.existy(body.allowedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items not a string"});
        }


        // if the prohibited items is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.prohibitedItems) && is.string(body.prohibitedItems)) {
            console.log("Updating prohibited items");
            user.prohibitedItems = body.prohibitedItems;
        }
        else if (is.existy(body.prohibitedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items not a string"});
        }

        // if the radius is not empty, set it
        if (is.existy(body.radius) && is.number(body.radius)) {
            console.log("updating radius");
            user.radius = body.radius;
        }
        else if (is.existy(body.radius)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
        }

        // if the location is not empty, set it
        if (is.existy(body.meetingPlace) && is.object(body.meetingPlace)) {
            console.log("updating location");
            if (is.string(body.meetingPlace.address) && is.string(body.meetingPlace.city) && is.string(body.meetingPlace.state) && is.number(body.meetingPlace.zip)) {
                user.location = body.meetingPlace;
            }
            else {
                return res.status(400).send({success: false, error: "UserUpdateError: Meeting place components improperly formatted"});
            }
        }
        else if (is.existy(body.meetingPlace)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Meeting place not an object"});
        }

        // if the isListingOn field exists, change it
        if (is.existy(body.isListingOn) && is.boolean(body.isListingOn)) {
            console.log("Updating isListingOn");
            user.businessOwnerInfo.isListingOn = body.isListingOn;
        }
        else if (is.existy(body.isListingOn)) {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn not a boolean"});
        }

        await user.save();

        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Patch new homeowner
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchContributorAcctType for more info
 */
router.patch('/newContributor', async function(req, res) {
    let body = req.body;
    let id = body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }
    else {

        // if the radius is not empty, set it
        if (is.existy(body.radius) && is.number(body.radius)) {
            console.log("updating radius");
            user.radius = body.radius;
        }
        else if (is.existy(body.radius)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: radius does not exist."});
        }

        await user.save();

        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Patch new homeowner
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchHomeownerAcctType for more info
 */
router.patch('/newHomeowner', async function(req, res) {
    let body = req.body;
    let id = body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Homeowner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Homeowner"});
    }
    else {
        // if the allowedItems is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.allowedItems) && is.string(body.allowedItems)) {
            console.log("updating allowed items");
            user.allowedItems = body.allowedItems;
        }
        else if (is.existy(body.allowedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items not a string"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items does not exist."});
        }


        // if the prohibited items is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.prohibitedItems) && is.string(body.prohibitedItems)) {
            console.log("Updating prohibited items");
            user.prohibitedItems = body.prohibitedItems;
        }
        else if (is.existy(body.prohibitedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items not a string"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items does not exist."});
        }

        // if the radius is not empty, set it
        if (is.existy(body.radius) && is.number(body.radius)) {
            console.log("updating radius");
            user.radius = body.radius;
        }
        else if (is.existy(body.radius)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: radius does not exist."});
        }

        // if the location is not empty, set it
        if (is.existy(body.meetingPlace) && is.object(body.meetingPlace)) {
            console.log("updating location");
            if (is.string(body.meetingPlace.address) && is.string(body.meetingPlace.city) && is.string(body.meetingPlace.state) && is.number(body.meetingPlace.zip)) {
                user.location = body.meetingPlace;
            }
            else {
                return res.status(400).send({success: false, error: "UserUpdateError: Meeting place components improperly formatted"});
            }
        }
        else if (is.existy(body.meetingPlace)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Meeting place not an object"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Meeting place does not exist."});
        }

        // if the isListingOn field exists, change it
        if (is.existy(body.isListingOn) && is.boolean(body.isListingOn)) {
            console.log("Updating isListingOn");
            user.businessOwnerInfo.isListingOn = body.isListingOn;
        }
        else if (is.existy(body.isListingOn)) {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn not a boolean"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn does not exist."});
        }

        await user.save();

        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

/**
 * Patch businessOwnerInfo
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchBusinessOwnerInfo for more info
 */
router.patch('/businessOwnerInfo', async function(req, res) {
    let body = req.body;
    let id = body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType !== "Business Owner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Contributor"});
    }
    else {
        // if the allowedItems is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.allowedItems) && is.string(body.allowedItems)) {
            console.log("updating allowed items");
            user.allowedItems = body.allowedItems;
        }
        else if (is.existy(body.allowedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items not a string"});
        }


        // if the prohibited items is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.prohibitedItems) && is.string(body.prohibitedItems)) {
            console.log("Updating prohibited items");
            user.prohibitedItems = body.prohibitedItems;
        }
        else if (is.existy(body.prohibitedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items not a string"});
        }

        // if the radius is not empty, set it
        if (is.existy(body.radius) && is.number(body.radius)) {
            console.log("updating radius");
            user.radius = body.radius;
        }
        else if (is.existy(body.radius)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
        }

        // if the business name is not empty, set it
        if (is.existy(body.businessName) && is.string(body.businessName)) {
            console.log("updating business name");
            user.businessOwnerInfo.businessName = body.businessName;
        }
        else if (is.existy(body.businessName)) {
            return res.status(400).send({success: false, error: "UserUpdateError: businessName not a string"})
        }

        // if the business website is not empty, set it
        if (is.existy(body.businessWebsite) && is.string(body.businessWebsite)) {
            console.log("updating business website");
            user.businessOwnerInfo.businessWebsite = body.businessWebsite;
        }
        else if (is.existy(body.businessWebsite)) {
            return res.status(400).send({success: false, error: "UserUpdateError: businessWebsite not a string"})
        }

        // if the business website is not empty, set it
        if (is.existy(body.contributorCharge) && is.string(body.contributorCharge)) {
            console.log("updating contributor charge");
            user.businessOwnerInfo.contributorCharge = body.contributorCharge;
        }
        else if (is.existy(body.contributorCharge)) {
            return res.status(400).send({success: false, error: "UserUpdateError: contributorCharge not a number"})
        }

        // if the location is not empty, set it
        if (is.existy(body.location) && is.object(body.location)) {
            console.log("updating location");
            if (is.string(body.location.address) && is.string(body.location.city) && is.string(body.location.state) && is.number(body.location.zip)) {
                user.location = body.location;
            }
            else {
                return res.status(400).send({success: false, error: "UserUpdateError: Location components improperly formatted"});
            }
        }
        else if (is.existy(body.location)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Location not an object"});
        }

        // if the isListingOn field exists, change it
        if (is.existy(body.isListingOn) && is.boolean(body.isListingOn)) {
            console.log("Updating isListingOn");
            user.businessOwnerInfo.isListingOn = body.isListingOn;
        }
        else if (is.existy(body.isListingOn)) {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn not a boolean"});
        }

        await user.save();

        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });

    }
});

/**
 * Patch new business owner
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PatchBusinessOwnerAcctType for more info
 */
router.patch('/newBusinessOwner', async function(req, res) {
    let body = req.body;
    let id = body.id;
    if (is.undefined(id)) {
        return res.status(400).send({success: false, error: "MissingId"})
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ success: false, error: "IdNotFound" });
    }
    else if (user.accountType === "Business Owner") {
        return res.status(400).send({success: false, error: "AccountTypeMismatch: Business Owner"});
    }
    else {
        user.accountType = "Business Owner";
        // if the allowedItems is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.allowedItems) && is.string(body.allowedItems)) {
            console.log("updating allowed items");
            user.allowedItems = body.allowedItems;
        }
        else if (is.existy(body.allowedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items not a string"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Allowed items does not exist."});
        }


        // if the prohibited items is not empty, set it if they are not a contributor (Hosts only)
        if (is.existy(body.prohibitedItems) && is.string(body.prohibitedItems)) {
            console.log("Updating prohibited items");
            user.prohibitedItems = body.prohibitedItems;
        }
        else if (is.existy(body.prohibitedItems)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items not a string"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Prohibited items does not exist."});
        }

        // if the radius is not empty, set it
        if (is.existy(body.radius) && is.number(body.radius)) {
            console.log("updating radius");
            user.radius = body.radius;
        }
        else if (is.existy(body.radius)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius not a number"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Radius does not exist."});
        }

        // if the business name is not empty, set it
        if (is.existy(body.businessName) && is.string(body.businessName)) {
            console.log("updating business name");
            user.businessOwnerInfo.businessName = body.businessName;
        }
        else if (is.existy(body.businessName)) {
            return res.status(400).send({success: false, error: "UserUpdateError: businessName not a string"})
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Business name does not exist."});
        }

        // if the business website is not empty, set it
        if (is.existy(body.businessWebsite) && is.string(body.businessWebsite)) {
            console.log("updating business website");
            user.businessOwnerInfo.businessWebsite = body.businessWebsite;
        }
        else if (is.existy(body.businessWebsite)) {
            return res.status(400).send({success: false, error: "UserUpdateError: businessWebsite not a string"})
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Business website does not exist."});
        }

        // if the business website is not empty, set it
        if (is.existy(body.contributorCharge) && is.string(body.contributorCharge)) {
            console.log("updating contributor charge");
            user.businessOwnerInfo.contributorCharge = body.contributorCharge;
        }
        else if (is.existy(body.contributorCharge)) {
            return res.status(400).send({success: false, error: "UserUpdateError: contributorCharge not a number"})
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Contributor charge does not exist."});
        }

        // if the location is not empty, set it
        if (is.existy(body.location) && is.object(body.location)) {
            console.log("updating location");
            if (is.string(body.location.address) && is.string(body.location.city) && is.string(body.location.state) && is.number(body.location.zip)) {
                user.location = body.location;
            }
            else {
                return res.status(400).send({success: false, error: "UserUpdateError: Location components improperly formatted"});
            }
        }
        else if (is.existy(body.location)) {
            return res.status(400).send({success: false, error: "UserUpdateError: Location not an object"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: Location does not exist."});
        }

        // if the isListingOn field exists, change it
        if (is.existy(body.isListingOn) && is.boolean(body.isListingOn)) {
            console.log("Updating isListingOn");
            user.businessOwnerInfo.isListingOn = body.isListingOn;
        }
        else if (is.existy(body.isListingOn)) {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn not a boolean"});
        }
        else {
            return res.status(400).send({success: false, error: "UserUpdateError: isListingOn does not exist."});
        }

        await user.save();

        await User.findById(id)
            .then(function() {
                res.status(200).send({success: true});
            })
            .catch(function(err) {
                res.status(500).send({success: false, error: err});
            });
    }
});

router.get('/blockedUsers', async function (req, res) {
    let id = req.query.id;
    if (!id) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
     let user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).send({success: false, error: "IdNotFound"});
    }
    else {
        user.findBlockedUsers(function(err, blocked) {
            if (!err) {
                return res.status(200).send({success: true, blockedUsers: blocked});
            }
            else {
                return res.status(500).send({success: false, error: err});
            }
        })
    }
});

router.get('/blockedBy', async function (req, res) {
    let id = req.query.id;
    if (!id) {
        return res.status(400).send({success: false, error: "MissingId"});
    }
    let user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).send({success: false, error: "IdNotFound"});
    }
    else {
        user.findBlockedBy(function(err, blockedBy) {
            if (!err) {
                return res.status(200).send({success: true, blockedBy: blockedBy});
            }
            else {
                return res.status(500).send({success: false, error: err});
            }
        })
    }
});

module.exports = router;
