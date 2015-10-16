'use strict';
require('../models/user.model');
require('../models/document.model');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Document = mongoose.model('Document');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var session = ('express-session');

exports.verifyToken = function(req, res, next) {
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

exports.authenticate = function(req, res) {
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

exports.createUser = function(req, res) {
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
exports.getUsers = function(req, res) {
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
exports.getCurrentUser = function(req, res) {
  User.find({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    return res.json(user);
  });
};
//update a user by ID
exports.updateUser = function(req, res) {
  User.update({
    _id: req.params.id
  }, req.body, function(err, user) {
    if (err) {
      return res.json(err);
    }
    return res.json(user);
  });
};
//delete a user by ID
exports.deleteUser = function(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    res.json({
      success: true,
      message: 'user has been deleted'
    });
  });
};
//logout a user, destroy session
exports.logout = function(req, res) {
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
}
//find documents by user
exports.findUserDocuments = function(req, res) {
  Document.find({
    ownerId: req.params.id
  }).exec(function(err, docs) {
    if (err) {
      return res.json(err);
    }
    return res.json(docs);
  });
};
