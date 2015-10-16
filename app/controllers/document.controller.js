'use strict';
require('../models/document.model');
var mongoose = require('mongoose');
var Document = mongoose.model('Document');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.createDocument = function(req, res) {
  //find a document
  Document.findOne({
    title: req.body.title
  }, function(err, doc) {
    if (doc) {
      res.json({
        sucess: false,
        message: 'document already exists'
      });
    } else {
      //create document
      Document.create(req.body, function(err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
    }
  });
};

exports.getAllDocuments = function(req, res) {
  //get all documents
  Document.find(function(err, doc) {
    if (err) {
      return res.json(err);
    }
    return res.json(doc);
  });
};

exports.getCurrentDocument = function(req, res) {
  //get document with whose Id is in request parameter
  Document.find({
    _id: req.params.id
  }, function(err, doc) {
    if (err) {
      return res.json(err);
    }
    return res.json(doc);
  });
};

exports.editDocument = function(req, res) {
  //edit document by Id
  Document.update({
    _id: req.params.id
  }, req.body, function(err, doc) {
    if (err) {
      return res.json(err);
    }
    return res.json(doc);
  });
};

exports.deleteDocument = function(req, res) {
  //delete document by Id
  Document.remove({
    _id: req.params.id
  }, function(err, doc) {
    if (err) {
      return res.json(err);
    }
    res.json({
      success: true,
      message: 'document has been deleted'
    });
  });
};
