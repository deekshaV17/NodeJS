const passport = require('passport'),
  facebookStrategy = require('passport-facebook'),
  key = require('../../key'),
  User = require('../../Models/user.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(new facebookStrategy({
  clientID: key.facebook.clientID,
  clientSecret: key.facebook.clientSecret,
  callbackURL: '/auth/facebook/redirect',
  profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookId: profile.id}).then((currentUser) => {
    if (currentUser) {
      done(null, currentUser);
    } else {
      let newUser = new User;
      newUser.facebookId = profile._json.id;
      newUser.email = profile._json.email;
      newUser.username = profile._json.first_name + ' ' + profile._json.last_name;
      newUser.profile_pic = profile._json.picture.data.url;
      newUser.following.push(newUser.username);
      newUser.followers.push(newUser.username);
      newUser.save().then((user) => {
        done(null, user);
      });
    }
  }).catch((err) => {
    done(null, err);
  });
}));