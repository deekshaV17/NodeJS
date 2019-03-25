const Router = require('express').Router();
const User = require('../Models/users.models');

Router.get('/index', (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.send(users);
    }
  });
});

Router.post('/new', (req, res) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.isOver21 = req.body.isOver21;

  newUser.save((error, user) => {
    if (error) {
      res.send(error);
    } else {
      res.send(user);
    }
  });
});

Router.put('/update/:id',(req, res) => {
  User.findById(req.params.id, (err, user) => {
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;
    user.isOver21 = req.body.isOver21 || user.isOver21;

    user.save((err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.send(user);
      }
    });
  });
});

Router.delete('/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
});

module.exports = Router;
