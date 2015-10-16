'use strict';
var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../server');
require('../../app/models/user.model');
require('../../app/models/document.model');
var User = mongoose.model('User');
var Document = mongoose.model('Document');


describe("User", function() {

  beforeEach(function(done) {
    var user = new User({
      username: 'john',
      name: {
        first: 'john',
        last: 'doe',
      },
      email: 'john@gmail.com',
      password: 'doe',
    });
    user.save(function(err, users) {
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}, function() {
      Document.remove({}, function() {
        done();
      });
    });
  });

  describe("Routes", function() {

    it('should create a new user', function(done) {
      request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          username: 'jason',
          name: {
            first: 'jason',
            last: 'stat'
          },
          email: 'jason@gmail.com',
          password: 'jason',
        })
        .expect(422)
        .end(function(err, response) {
          expect(response.body.username).toBe('jason');
          expect(response.body.name.last).toBe('Stat');
          done();
        });

    });

    it('should get all users', function(done) {
      request(app)
        .get('/api/users')
        .set('Content-Type', 'application/json')
        .end(function(err, response) {
          expect(response.body.length).toEqual(1);
          done();
        });
    });

    it('should log a user in', function(done) {
      request(app)
        .post('/api/user/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'john',
          password: 'doe'
        })
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'Enjoy your token'
          }));
          done();
        });
    });

    it('should log a user out', function(done) {
      request(app)
        .post('/api/user/logout')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'you have been logged out'
          }));
          done();
        });
    });

    it('should get a specific user', function(done) {
      var userId = null;
      var user = new User({
        username: 'rose',
        name: {
          first: 'rose',
          last: 'doe',
        },
        email: 'rose@mail.com',
        password: 'rose',
      });
      user.save(function(err, users) {
        if (users) {
          userId = users._id;
          request(app)
            .get('/api/user/' + userId)
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
              expect(res.body.length).toEqual(1);
              expect(res.body[0].username).toBe('rose');
              done();
            });
        }
      })
    });
    //login before deleting a user
    it('should delete a specific user', function(done) {
      request(app)
        .post('/api/user/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'john',
          password: 'doe'
        })
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'Enjoy your token',
          }));
          var userId = res.body.user._id;
          var userToken = res.body.token;
          //attach userId and token to url before deleting user
          request(app)
            .delete('/api/user/' + userId + '?token=' + userToken)
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
              expect(res.body).toEqual(jasmine.objectContaining({
                success: true,
                message: 'user has been deleted'
              }));
              done();
            });
        });
    });
    //login before updating user info
    it('should update a specific user', function(done) {
      request(app)
        .post('/api/user/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'john',
          password: 'doe'
        })
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'Enjoy your token',
          }));
          var userId = res.body.user._id;
          var userToken = res.body.token;
          request(app)
            .put('/api/user/' + userId + '?token=' + userToken)
            .set('Content-Type', 'application/json')
            .send({
              username: 'jose'
            })
            .end(function(err, res) {
              expect(res.body.ok).toBe(1);
              expect(res.body.nModified).toBe(1);
              done();
            });
        });
    });

    it('should find user documents', function(done) {
      //create user
      request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          username: 'jason',
          name: {
            first: 'jason',
            last: 'stat'
          },
          email: 'jason@gmail.com',
          password: 'jason',
        })
        .expect(422)
        .end(function(err, response) {
          //login user
          request(app)
            .post('/api/user/login')
            .set('Content-Type', 'application/json')
            .send({
              username: 'jason',
              password: 'jason'
            })
            .end(function(err, res) {
              var userId = res.body.user._id;
              var userToken = res.body.token;
              //attach user token to url and create document
              request(app)
                .post('/api/documents/?token=' + userToken)
                .set('Content-Type', 'application/json')
                .send({
                  ownerId: userId,
                  title: 'Jason doc',
                  content: 'sample document'
                })
                .end(function(err, response) {
                  //find the user documents
                  request(app)
                    .get('/api/user/' + userId + '/documents')
                    .set('Content-Type', 'application/json')
                    .end(function(err, res) {
                      expect(res.body[0].title).toBe('Jason doc');
                      done();
                    });
                });
            });
        });
    });
  });
});

describe("Document", function() {

  beforeEach(function(done) {
    var doc = new Document({
      ownerId: '5620cecaf925737b1a169c4c',
      title: 'danki',
      content: 'this is a document for danki'
    });
    doc.save(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}, function() {
      Document.remove({}, function() {
        done();
      });
    });
  });

  describe("Routes", function() {
    //create a user
    it('should create a new document', function(done) {
      request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          username: 'jason',
          name: {
            first: 'jason',
            last: 'stat'
          },
          email: 'jason@gmail.com',
          password: 'jason',
        })
        .expect(422)
        .end(function(err, response) {
          //login user
          request(app)
            .post('/api/user/login')
            .set('Content-Type', 'application/json')
            .send({
              username: 'jason',
              password: 'jason'
            })
            .end(function(err, res) {
              var userId = res.body.user._id;
              var userToken = res.body.token;
              //attach token and create document
              request(app)
                .post('/api/documents/?token=' + userToken)
                .set('Content-Type', 'application/json')
                .send({
                  ownerId: userId,
                  title: 'Jason doc',
                  content: 'sample document'
                })
                .end(function(err, response) {
                  expect(response.body.title).toBe('Jason doc');
                  done();
                });
            });
        });

    });

    it('should get all documents', function(done) {
      request(app)
        .get('/api/documents')
        .set('Content-Type', 'application/json')
        .end(function(err, response) {
          expect(response.body.length).toEqual(1);
          done();
        });
    });

    it('should get a specific document', function(done) {
      var docId = null;
      var doc = new Document({
        ownerId: '5610creaf925737b1a161b4c',
        title: 'janki',
        content: 'this is a document for janki'
      });
      doc.save(function(err, docs) {
        //attach user id to url
        if (docs) {
          docId = docs._id;
          request(app)
            .get('/api/document/' + docId)
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
              expect(res.body.length).toEqual(1);
              expect(res.body[0].title).toBe('janki');
              done();
            });
        }
      })
    });

    it('should delete a specific document', function(done) {
      var doc = new Document({
        ownerId: '5620bafhf925737b1a169c4c',
        title: 'ore',
        content: 'this is a document for ore'
      });
      doc.save(function(err, docs) {
        if (docs) {
          var docId = docs._id;
          request(app)
            .delete('/api/document/' + docId)
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
              expect(res.body).toEqual(jasmine.objectContaining({
                success: true,
                message: 'document has been deleted'
              }));
              done();
            });
        }
      });
    });

    it('should update a specific document', function(done) {
      var doc = new Document({
        ownerId: '7620bafhf125737b1a169c4c',
        title: 'ufedo',
        content: 'this is a document for ufedo'
      });
      doc.save(function(err, docs) {
        if (docs) {
          var docId = docs._id;
          request(app)
            .put('/api/document/' + docId)
            .set('Content-Type', 'application/json')
            .send({
              content: 'doc for ufedo has been updated'
            })
            .end(function(err, res) {
              expect(res.body.ok).toEqual(1);
              expect(res.body.nModified).toEqual(1);
              done();
            });
        }
      });
    });

  });
});
