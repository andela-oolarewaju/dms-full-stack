'use strict';
var mongoose = require('mongoose');
require('../../app/models/document.model');
var Document = mongoose.model('Document');
require('../../app/models/user.model');
var User = mongoose.model('User');

describe('Document Model', function(done) {

  afterEach(function(done) {
    Document.remove({}, function(err) {
      done();
    })

  });

  describe('Validations', function() {

    it('should not accept entry without owner', function(done) {
      var doc = new Document({
        ownerId: '',
        title: 'patient document',
        content: 'this patient is in critical condition'
      });
      doc.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without title', function(done) {
      var doc = new Document({
        ownerId: '561f944f1a3381990249e580',
        title: '',
        content: 'this patient is in critical condition'
      });
      doc.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without content', function(done) {
      var doc = new Document({
        ownerId: '561f944f1a3381990249e580',
        title: 'jonny document',
        content: ''
      });
      doc.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should have a date defined and should not be null', function(done) {
      var doc = new Document({
        ownerId: '561f944f1a3381990249e580',
        title: 'jonny document',
        content: 'this is a sample document'
      });
      doc.save(function(err) {
        expect(doc.dateCreated).toBeDefined();
        expect(doc.lastModified).toBeDefined();
        expect(err).toBe(null);
        done();
      });
    });

    it('should validate that a new document created has "dateCreated" set to current date', function(done) {
      var currentDate = new Date();
      var doc = new Document({
        ownerId: '561f944f1a3381990249e580',
        title: 'jonny document',
        content: 'this is a sample document'
      });
      doc.save(function(err) {
        expect(doc.dateCreated).toEqual(currentDate);
        expect(err).toBe(null);
        done();
      });
    });
  });
});

describe('User Model', function(done) {

  afterEach(function(done) {
    User.remove({}, function(err) {
      done();
    })

  });

  describe('validations', function() {

    it('should not accept entry without username', function(done) {
      var user = new User({
        username: '',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john@gmail.com',
        password: 'doe',
      });
      user.save(function(err) {
        done();
      });
    });

    it('should not accept entry if username has uppercase character', function(done) {
      var user = new User({
        username: 'John',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john@gmail.com',
        password: 'doe',
      });
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without first or last name', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: '',
          last: 'doe',
        },
        email: 'john@gmail.com',
        password: 'doe',
      });
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });


    it('should have first and last name capitalized', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john@gmail.com',
        password: 'doe',
      });
      user.save(function(err, user) {
        expect(user.name.first).toBe('John');
        expect(user.name.last).toBe('Doe');
        expect(err).toBe(null);
        done();
      });
    });

    it('should not accept entry without email', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: '',
        password: 'doe',
      });
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry with invalid email', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john.com',
        password: 'doe',
      });
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without password', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john@mail.com',
        password: '',
      });
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should accept entry when all fields are valid', function(done) {
      var user = new User({
        username: 'john',
        name: {
          first: 'john',
          last: 'doe',
        },
        email: 'john@mail.com',
        password: 'john',
      });
      user.save(function(err) {
        expect(err).toBe(null);
        done();
      });
    });

  });
});
