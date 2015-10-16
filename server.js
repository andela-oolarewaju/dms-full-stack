'use strict';
//reuire modules and files and connect to database
var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
//allow value in key-value pairs to accept any type
app.use(bodyParser.urlencoded({
  extended: true
}));
//parse json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With, Authorization');
  next();
});
//create a session
app.use(session({
  saveUninitialized: false,
  secret: config.secret,
  resave: false
}))
//home route
app.get('/', function(req, res) {
  res.send('I am functional');
});

require('./app/routes/user.route')(app);
require('./app/routes/document.route')(app);

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Server started on port: ' + port);
});

module.exports = app;
