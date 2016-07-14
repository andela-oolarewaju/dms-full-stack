'use strict';
require('../models/user.model');
require('../models/document.model');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Document = mongoose.model('Document');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var session = ('express-session');

var UserController = function() {}

UserController.prototype.verifyToken = function(req, res, next) {
  //check for token in one of these
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate'
        });
      } else {
        //decode token
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
};

UserController.prototype.decodeUser = function(req, res) {
  return res.json(req.decoded);
};

UserController.prototype.authenticate = function(req, res) {
  //find user
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      res.json(err);
    }
    if (!user) {
      res.json({
        success: false,
        message: 'authentication failed, user not found'
      });
    } else if (user) {
      var validPassword = user.comparePassword(req.body.password);
      //if its a wrong password
      if (!validPassword) {
        res.json({
          success: false,
          message: 'authentication failed, wrong password'
        });
      } else {
        //sign the token to secure it
        var token = jwt.sign(user, config.secret, {
          expiresIn: 86400
        });
        //send token
        res.json({
          success: true,
          message: 'Enjoy your token',
          token: token,
          user: user
        });
      }
    }
  });
};

UserController.prototype.createUser = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (user) {
      res.json({
        sucess: false,
        message: 'user name taken'
      });
    } else {
      User.create(req.body, function(err, user) {
        if (err) {
          return res.json({
            success: false,
            message: 'Check parameters!'
          });
        }
        return res.json(user);
      });
    }
  });
};
//get all users
UserController.prototype.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.json(err);
    }
    if (!users) {
      return res.json({
        success: false,
        message: 'No users found'
      });
    }
    return res.json(users);
  });
};
//get current user
UserController.prototype.getCurrentUser = function(req, res) {
  console.log("id", req.decoded);
  var id = req.decoded._doc._id;
  User.findById(id, function(err, user){
    if (err) {
      console.log("err", err); 
      return res.json(err);
    }
    return res.json(user);
  })
};
//update a user by ID
UserController.prototype.updateUser = function(req, res) {
  var userObj = req.body;
  var userId = userObj._id;

  User.findByIdAndUpdate({
    _id: req.body._id
  }, req.body, {
    new: true
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    var token = jwt.sign(user, config.secret, {
      expiresInMinutes: 1440 //24hr expiration
    });

    return res.json({
      user: user,
      token: token
    });
  });
};
//delete a user by ID
UserController.prototype.deleteUser = function(req, res) {
  User.remove({
    _id: req.decoded._doc._id
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    return res.json({
      success: true,
      message: 'user has been deleted'
    });
  });
};
//logout a user, destroy session
UserController.prototype.logout = function(req, res) {
  req.session.destroy(function(err, success) {
    if (err) {
      res.send(err)
    } else {
      res.json({
        success: true,
        message: 'you have been logged out'
      });
    }
  });
};

UserController.prototype.getUserFromToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        next();
      } else {
        //if all checks are passed, save decoded info to request
        req.user = decoded;
        next();
      }
    });
  } else {
    next();
  }
};
//find documents by user
UserController.prototype.findUserDocuments = function(req, res) {
  var id= req.user._doc._id;
  Document.find({
    ownerId: id
  }).exec(function(err, docs) {
    if (err) {
      return res.json(err);
    }
    console.log("docs", docs);
    return res.json(docs);
  });
};
module.exports = UserController;