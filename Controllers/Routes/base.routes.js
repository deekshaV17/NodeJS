const Router = require('express').Router(),
  Article = require('../../Models/article.model'),
  User = require('../../Models/user.model');

Router.get('/', (req, res) => {
  if(!req.session.user) {
    res.redirect('/signup');
  }
});

Router.get('/login', (req, res) => {
  res.render('login', { errors: [] });
});

Router.get('/signup', (req, res) => {
  res.render('signup', { errors: [] });
});

Router.get('/new_article', (req, res) => {
  res.render('new_article');
});

Router.get('/search', (req, res) => {
  res.render('search', { articles: [] });
});

Router.get('/search/:tag', (req, res) => {
  Article.find({ tags: req.params.tag }).populate('author', 'username').then((articles) => {
    res.render('search', { articles, });
  });
});

Router.get('/dashboard', (req, res) => {
  let errors = [];
  if (req.session.user || req.user) {
    let user = req.session.user || req.user;
    let user_ids = [];
    User.find({ username: { $in: user.following } }).then((users) => {
      users.forEach((user) => user_ids.push(user._id));
    }).then(() => {
      Article.find({ author: { $in: user_ids }}).populate('author', ['username']).then((articles) => {
        res.render('dashboard', { articles, });
      });
    }).catch((err) => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = Router;
