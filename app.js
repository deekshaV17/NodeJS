const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const port = process.env.port || 8080;
const myDB = 'mongodb://localhost/nodejs';
const User = ('./Models/users/model.js');
const UserRoutes = require('./Controllers/userroutes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(myDB);
app.use('/user', UserRoutes);

app.listen(port, (err) => {
  if (!err) {
    console.log('listening to port ', port);
  } else {
    console.log('Error connecting to port ', port);
  }
});