const Router = require('express').Router(),
  User = require('../../Models/user.model');

Router.post('/follower/new', (req, res) => {
  if(req.session.user || req.user) {
    let user = req.session.user || req.user;
    User.findOne({ username: user.username }).then((usr) => {
      usr.following.push(req.body.username);
      usr.save();
    });
  } else {
    res.redirect('/');
  }
});

module.exports = Router;
