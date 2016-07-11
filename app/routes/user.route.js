"use strict";
var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');
var user = new UserController();

module.exports = function(app) {
  //define routes with functions
  router.route('/user/login')
    .post(user.authenticate);

  router.route('/user/logout')
    .post(user.logout);

  router.route('/users')
    .get(user.getUsers)
    .post(user.createUser);

  router.route('/decode')
    .get(user.verifyToken, user.decodeUser);

  router.route('/useroflife')
    .get(user.verifyToken, user.getCurrentUser)
    .put(user.verifyToken, user.updateUser)
    .delete(user.verifyToken, user.deleteUser);

  router.route('/user/:userId/documents')
    .get(user.getUserFromToken, user.findUserDocuments)

  app.use('/api', router);
};
