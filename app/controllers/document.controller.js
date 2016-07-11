'use strict';
require('../models/document.model');
var mongoose = require('mongoose');
var Document = mongoose.model('Document');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

var DocumentController = function() {}

DocumentController.prototype.createDocument = function(req, res) {
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
      var userId = req.decoded._doc._id;
      var docObj = req.body;
      docObj.ownerId = userId
        //create document
      Document.create(docObj, function(err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
    }
  });
};

DocumentController.prototype.getAllDocuments = function(req, res) {
  //get all documents
  Document.find(function(err, doc) {
    if (err) {
      return res.json(err);
    }
    return res.json(doc);
  });
};

DocumentController.prototype.getCurrentDocument = function(req, res) {
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

DocumentController.prototype.editDocument = function(req, res) {
  var documentObj = req.body;
  var documentId = documentObj._id;

  Document.find({
    _id: req.params.id
  }, function(err, doc) {
    if (err) {
      return err
    } 
    else if(!doc){
      console.log("not here")
    }
    else {
      //edit document by Id
      Document.update({
        _id : req.params.id
      }, documentObj, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.json(docs);
        }
      });
    };
  });
}

DocumentController.prototype.deleteDocument = function(req, res) {
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

module.exports = DocumentController;