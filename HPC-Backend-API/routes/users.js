var express = require('express');
var router = express.Router();

var uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

let mongoose = require('mongoose');
let user = require('../models/User');

const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async (req, res) => {

  var token = uuid();

  const json = req.body;
  const password = json.password;
  const email = json.email;
  const firstName = json.name.first;
  const lastName = json.name.last;
  const accountType = json.accountType;
  const birthdayString = json.DOB;

  var newUser = new user({
    email: email,
    password: password,
    name: {
      first: firstName,
      last: lastName
    },
    accountType: accountType,
    birthday: birthdayString, 
    validated: false,
    validationToken: token
  });

  newUser.save(function(err, data) {
    if (err) {
      console.log(err);
      res.status(401).send({"registrationStatus": "false", "error": err});
    }
    else {
      console.log(data);
      var url = "https://hpcompost.com/user/validate?userId=" + data._id + "token=" + uuid;
      testmail(email, firstName, lastName, "Confirm your HPC Account", "Please confirm your account!", "To confirm, click <a href=" + url + ">this link</a>");
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
    return response.status(401).send({ loginStatus: "false", message: "The username does not exist" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    return res.status(401).send({ loginStatus: "false", message: "The password is invalid" });
  }
  res.status(200).send({loginStatus: "true"});
});

router.get('/validate', (req, res) => {
  const userId = req.userId;
  const token = req.token;
  user.validate(userId, token, function(err, data) {
    if (err) {
      console.log("The user could not be validated.");
      res.status(403).send({"authenticated": "false", "error": err});
      throw err;
    }
    else {
      console.log("The user with userId " + userId + " was validated successfully!");
      res.status(200).send({"authenticated": "true"});
    }
  });

});

function testmail(email, firstName, lastName, subject, body, htmlBody) {

  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Message object
    let message = {
        from: 'NO_REPLY <no-reply@hpcompost.com>',
        to: firstName + ' ' + lastName +  '<' + email + '>',
        subject: String(subject),
        text: String(body),
        html: String(htmlBody)
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});

}

module.exports = router;
