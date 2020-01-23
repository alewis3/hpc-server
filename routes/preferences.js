var express = require('express');
var router = express.Router();
let User = require('../models/User');
const is = require("is_js");

/**
 * @api {get} /preferences/allowedItems?id=XX Save allowed items
 * @apiName GetAllowedItems
 * @apiGroup Preferences
 * @apiDescription This route will be called when a user wants to check their allowed items
 *
 * @apiParam {String} id The id of the user to set
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 * @apiSuccess {String} allowedItems The items they allow
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
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
 * @api {get} /preferences/prohibitedItems?id=XX Save prohibited items
 * @apiName GetProhibitedItems
 * @apiGroup Preferences
 * @apiDescription This route will be called when a user wants to check their prohibited items
 *
 * @apiParam {String} id The id of the user to set
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 * @apiSuccess {String} prohibitedItems The items they prohibit
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
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
 * @api {post} /preferences/allowedItems Save allowed items
 * @apiName PostAllowedItems
 * @apiGroup Preferences
 * @apiDescription This route will be called when a user sets or updates their allowed items
 *
 * @apiParam {String} id The id of the user to set
 * @apiParam {String} allowedItems The items they want to allow
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
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
 * @api {post} /preferences/prohibitedItems Save prohibited items
 * @apiName PostProhibitedItems
 * @apiGroup Preferences
 * @apiDescription This route will be called when a user sets or updates their prohibited items
 *
 * @apiParam {String} id The id of the user to set
 * @apiParam {String} prohibitedItems The items they want to prohibit
 *
 * @apiSuccess {Boolean} success Will be true if the items could be set
 *
 * @apiError {Boolean} success Will be false if the items could not be set for some reason.
 * @apiError {String} error A message of why the items could not be set.
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

module.exports = router;
