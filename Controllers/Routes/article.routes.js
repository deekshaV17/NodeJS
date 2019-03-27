const Router = require('express').Router(),
  Article = require('../../Models/article.model');

Router.post('/new', (req, res) => {
  if(req.session.user || req.user) {
    let user = req.session.user || req.user;
    let newArticle = new Article;
    newArticle.title = req.body.title;
    newArticle.description = req.body.description;
    newArticle.image = req.body.image;
    newArticle.tags = req.body.tags;
    newArticle.author = user._id;
    newArticle.save((err, article) => {
      if (err) {
        console.log('error creating article', err);
      } else {
        res.redirect('/dashboard');
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = Router;
