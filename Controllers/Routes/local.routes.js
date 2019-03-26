const Router = require('express').Router(),
  User = require('../../Models/user.model'),
  bcrypt = require('bcryptjs'),
  salt = bcrypt.genSaltSync(10);


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
      newUser.people_you_are_following.push(req.body.username);
      newUser.save((error, user) => {
        if (error) {
          console.log('error saving new user', error);
        } else {
          req.session.user = user;
          res.redirect('/dashboard');
        }
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

