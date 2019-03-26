const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

let UserSchema = new Schema({
  email: String,
  facebookId: String,
  password: String,
  profile_pic: String,
  following: [String],
  followers: [String],
  username: {
    type: String,
    required: true,
    unique: true,
  },
  articles: {
    type: ObjectId,
    ref: 'Article',
  },
});

module.exports = mongoose.model('User', UserSchema);
