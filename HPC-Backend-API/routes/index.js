var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

let mongoose = require('mongoose');
require('../schemas/userSchema');
let User = mongoose.model('User');

const salt = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register", async (req, res) => {
  const json = req.body;
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

  const hashedPassword = await hashPassword(password);

  console.log(hashedPassword);

  var newUser = new User({
    email: email,
    password: hashedPassword,
    name: {
      first: firstName,
      last: lastName
    },
    homeAddress: {
      streetAddress: streetAddress,
      city: city,
      state: state, 
      zip: zip, 
    },
    accountType: accountType,
    birthday: birthdayString
  });

  newUser.save(function(err, data) {
    if (err) {
      console.log(err);
      res.status(401).send({"registrationStatus": "false"});
    }
    else {
      console.log(data);
      res.status(201).send({"registrationStatus": "true"});
    }
  });

});

router.post('/login', async (req, res) => {
  const json = req.body;
  const email = json.email;
  const password = json.password;

  var user = await User.findOne({ email: email }).exec();
  if(!user) {
    return response.status(401).send({ message: "The username does not exist" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    return res.status(401).send({ message: "The password is invalid" });
  }
  res.status(200).send({loginStatus: "true"});
});

async function hashPassword (password) {

  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  return hashedPassword
}

module.exports = router;
