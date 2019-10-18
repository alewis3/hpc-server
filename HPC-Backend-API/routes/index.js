var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register", (req, res) => {
  const json = req.body.json;
  const password = json.password;
  const email = json.email;
  const firstName = json.name.first;
  const lastName = json.name.last;
  const accountType = json.accountType;
  const birthdayString = json.DOB;
  const homeAddress = json.homeAddress;
  const streetAddress = homeAddress.streetAddress;
  const city = homeAddress.city;
  const state = homeAddress.state;
  const zip = homeAddress.zip;

  res.status(201).send({"registrationStatus": "true"});
});

module.exports = router;
