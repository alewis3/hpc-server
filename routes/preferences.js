var express = require('express');
var router = express.Router();
let User = require('../models/User');
const is = require("is_js");

/**
 * get allowed items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-GetAllowedItems for more information
 */
router.get('/allowedItems', function (req, res) {
    var id = req.query.id;
    var user = User.findById(id).exec();
    if(!user) {
        return res.status(401).send({ success: false, error: "The id does not exist" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(401).send({success: false, error: "Contributors do not have allowed items."});
    }
    else {
        let allowed = user.allowedItems;
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
router.get('/prohibitedItems', function (req, res) {
    var id = req.query.id;
    var user = User.findById(id).exec();
    if(!user) {
        return res.status(401).send({ success: false, error: "The id does not exist" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(401).send({success: false, error: "Contributors do not have prohibited items."});
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
    var user = await User.findById(json.id).exec();
    if(!user) {
        return res.status(401).send({ success: false, error: "The id does not exist" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(401).send({success: false, error: "Account type must be homeowner or business owner."});
    }
    else {
        user.allowedItems = json.allowedItems;
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

/**
 * post prohibited items
 *
 * See https://hpcompost.com/api/docs#api-Preferences_Specific-PostProhibitedItems for more info
 */
router.post('/prohibitedItems', async function (req, res) {
    var json = req.body;
    var user = await User.findById(json.id).exec();
    if(!user) {
        return res.status(401).send({ success: false, error: "The id does not exist" });
    }
    else if (user.accountType === "Contributor") {
        return res.status(401).send({success: false, error: "Account type must be homeowner or business owner."});
    }
    else {
        user.prohibitedItems = json.prohibitedItems;
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

router.get('/profile', async function(req, res) {
    let id = req.query.id;
    let user = User.findById(id).exec(function(err, doc) {
        if (err) return res.status(500).send({success: false, error: err});
        else if (!doc) {
            return res.status(400).send({success: false, error: "IdNotFound"});
        }
        else return doc;
    });
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
    return res.status(200).send({success: true, user: retDoc})
});

module.exports = router;
