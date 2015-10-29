'use strict';
//reuire modules and files and connect to database
var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
var appDir = path.dirname(require.main.filename);
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('mongoose');
var port = process.env.PORT || 5000;

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
}));

app.use(express.static(path.join(appDir + '/public')));

//home route
app.get('/', function(req, res) {
  res.sendFile(appDir + '/public/index.html');
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
