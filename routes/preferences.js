var express = require('express');
var router = express.Router();
let User = require('../models/User');
const is = require("is_js");


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

module.exports = router;
