"use strict";
var express = require('express');
var router = express.Router();
var document = require('../controllers/document.controller');
var user = require('../controllers/user.controller');

module.exports = function(app) {
  //define routes with functions
  router.route('/documents')
    .get(document.getAllDocuments)
    .post(user.verifyToken, document.createDocument);

  router.route('/document/:id')
    .get(document.getCurrentDocument)
    .put(document.editDocument)
    .delete(document.deleteDocument);

  app.use('/api', router);
};
