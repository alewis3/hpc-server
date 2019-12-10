var express = require('express');
var router = express.Router();
var path = require("path");

router.get('/', function(req, res) {
    console.log("Grabbing docs");
    res.sendFile(path.join(__dirname, '/../apidoc/index.html'));
});

module.exports = router;