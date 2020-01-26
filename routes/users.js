var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const is = require("is_js");
let User = require('../models/User');

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
    return res.status(401).send({ loginStatus: false, error: "WrongCredentials" });
  }
  return res.status(200).send({loginStatus: true, "accountType": user.accountType, "id": user._id});
});


// router.get('/hosts', function(req, res) {
//     var userId = req.query.userId;
//
// });

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

/*
 * This path handles validating a user after they register. in the get request query
 * there are two variables, the userId, and the token to match to. It calls the static 
 * method validateUser and sends in those two tokens. Validate user will update the validated
 * attribute of this user to true if the tokens match and if not, it will not do anything and 
 * throw an error.
 */
/*
router.get('/validate', async (req, res) => {
  const userId = req.query.userId;
  const token = req.query.token;

  var user = await User.validateUser(userId, token, function(err, data) {
    if (err) {
      console.log("The user could not be validated.");
      res.status(403).render('failure', {title: "Your account was not confirmed!"});
      throw err;
    }
    else {
      if (data != null) {
        console.log(data);
        res.status(200).render('success', {title: "Thank you for confirming your account!", name: data.name.first});
      }
      else {
        res.status(403).render('failure', {title: "Your account was not confirmed!"});
      }
      return data;
    }
  });

});
*/
/*
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
*/

module.exports = router;
