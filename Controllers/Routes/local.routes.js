const Router = require('express').Router(),
  User = require('../../Models/user.model'),
  bcrypt = require('bcryptjs'),
  salt = bcrypt.genSaltSync(10),
  nodemailer = require('nodemailer'),
  key = require('../../key');

  var client = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: key.sendGrid.username,
      pass: key.sendGrid.password,
    },
  });


Router.post('/signup', (req, res) => {
  let errors = [];
  let usernameAlreadyChosen = false;
  let usernameIsGood = req.body.username.length > 0;
  let passwordIsGood = req.body.password.length > 0;
  let emailIsGood = req.body.email.length > 0;
  if(!usernameIsGood) errors.push('Username field must be filled');
  if(!passwordIsGood) errors.push('Password field must be filled');
  if(!emailIsGood) errors.push('Email field must be filled');

  User.findOne({ username: req.body.username }).then((user) => {
    if(user) {
      usernameAlreadyChosen = true;
      errors.push('Username ', req.body.username, ' is already taken');
    } else {
      usernameAlreadyChosen = false;
    }

  }).then(() => {
    if(errors.length > 0) {
      res.render('signup', { errors, });
    } else {
      let newUser = new User;
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = bcrypt.hashSync(req.body.password, salt);
      newUser.profile_pic = req.body.profile_pic;
      newUser.followers.push(req.body.username);
      newUser.following.push(req.body.username);
      newUser.save((error, user) => {
        if (error) {
          console.log('error saving new user', error);
        } else {
          req.session.user = user;
          res.redirect('/dashboard');
        }
      }).then(() => {
        let email = {
          from: key.sendGrid.username,
          to: newUser.email,
          subject: 'Welcome to node blogger',
          html: '<h2>Welcome to node blogger</h2><br /><p>Thankyou for signing up</p>'
        }
        client.sendMail(email, function(err, inifo){
          console.log('Message Sent: ', info.response);
        });
      });
    }
  });
});

Router.post('/login', (req, res) => {
  let errors = [];
  User.findOne({ username: req.body.username }).then((user) => {
    let userExists = user;
    if(userExists && (bcrypt.compareSync(req.body.password, user.password) === true)) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      errors.push('Could not log in');
      res.render('login', { errors, });
    }
  }).catch((err) => {
    errors.push('User does not exit');
    res.render('login', { errors, });
  });
});

module.exports = Router;

