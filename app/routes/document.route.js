"use strict";
var express = require('express');
var router = express.Router();
var DocumentController = require('../controllers/document.controller');
var UserController = require('../controllers/user.controller');
var doc = new DocumentController();
var user = new UserController();

module.exports = function(app) {
  //define routes with functions
  router.route('/documents')
    .get(doc.getAllDocuments)
    .post(user.verifyToken, doc.createDocument);

  router.route('/document/:id')
    .get(doc.getCurrentDocument)
    .put(user.verifyToken, doc.editDocument)
    .delete(doc.deleteDocument);

  app.use('/api', router);
};
