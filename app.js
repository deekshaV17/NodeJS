 const express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  ejs = require('ejs'),
  passport = require('passport'),
  app = express();

/* Route files */

const baseRoutes = require('./Controllers/Routes/base.routes'),
  userRoutes = require('./Controllers/Routes/user.routes'),
  localRoutes = require('./Controllers/Routes/local.routes'),
  articleRoutes = require('./Controllers/Routes/articles.routes'),
  fbRoutes = require('./Controllers/Routes/fb.route');

/* config settings */

const key = require('./key'),
  db = key.db.remote || 'mongodb://localhost/' + 'key,db.local',
  port = process.env.PORT || 8080;
  
/* connecting to mongoose */

mongoose.connect(db);


/* setting up app */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({ secret: key.session.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Routes */

app.use('/', baseRoutes);
app.use('/auth/local', localRoutes);
app.use('/auth/facebook', fbRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);

app.listenerCount(port, (err) => {
  if (!err) {
    console.log('Listening to port: ', port);
  } else {
    console.log('Cannot connect to port: ', port);
  }
});
