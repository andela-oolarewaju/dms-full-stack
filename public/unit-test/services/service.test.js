"use strict";

describe("Services", function() {
  var httpMock, UserService, DocumentService;

  beforeEach(module("mainApp"));
  beforeEach(inject(function(_UserService_, _DocumentService_, $httpBackend) {
    httpMock = $httpBackend;
    UserService = _UserService_;
    DocumentService = _DocumentService_;
  }));

  describe("User Service", function() {
    it("should get users", function(done) {
      httpMock.expectGET('/api/users').respond({
        username: "naruto",
        name: {
          first: "naruto",
          last: "uzumaki"
        },
        email: "naruto.kun@gmail.com",
        password: "naruto"
      });
      UserService.getAllUsers().then(function(user) {
        expect(user.data.username).toEqual("naruto");
        done();
      });
      httpMock.flush();
    });

    it("should create a user", function(done) {
      var newUser = null;
      httpMock.expectPOST('/api/users').respond({
        newUser: {
          username: "naruto",
          name: {
            first: "naruto",
            last: "uzumaki"
          },
          email: "naruto.kun@gmail.com",
          password: "naruto"
        }
      });
      UserService.createUser(newUser).then(function(user) {
        expect(user.data.newUser.username).toEqual("naruto");
        done();
      });
      httpMock.flush();
    });

    it("should delete a user", function(done) {
      var token = localStorage.getItem("userToken");
      httpMock.expectDELETE('/api/user/10?token=' + token).respond({
        message: "user has been deleted"
      });
      UserService.deleteUser(10).then(function(res) {

        expect(res.data).toEqual({
          message: "user has been deleted"
        });
        done();
      });
      httpMock.flush();
    });

    it("should update a user", function(done) {
      var token = localStorage.getItem("userToken");
      var updatedUser = null;
      httpMock.expectPUT('/api/user/2?token=' + token).respond({
        updatedUser: {
          username: "choji",
          name: {
            first: "choji",
            last: "uzumaki"
          },
          email: "naruto.kun@gmail.com",
          password: "naruto"
        }
      });
      UserService.updateUser(updatedUser, 2).then(function(res) {
        expect(res.data).toEqual({
          updatedUser: {
            username: "choji",
            name: {
              first: "choji",
              last: "uzumaki"
            },
            email: "naruto.kun@gmail.com",
            password: "naruto"
          }
        });
        done();
      });
      httpMock.flush();
    });


    it("should get a user", function(done) {
      var token = localStorage.getItem("userToken");
      httpMock.expectGET('/api/user/2?token=' + token).respond({
        user: {
          username: "choji",
          name: {
            first: "choji",
            last: "uzumaki"
          },
          email: "naruto.kun@gmail.com",
          password: "naruto"
        }
      });
      UserService.getCurrentUser(2).then(function(res) {
        expect(res.data).toEqual({
          user: {
            username: "choji",
            name: {
              first: "choji",
              last: "uzumaki"
            },
            email: "naruto.kun@gmail.com",
            password: "naruto"
          }
        });
        done();
      });
      httpMock.flush();
    });

    it("should login a user", function(done) {
      var userInfo = {
        username: "choji",
        password: "naruto"
      };
      httpMock.expectPOST('/api/user/login').respond({
        message: "Login successful"
      });
      UserService.login(userInfo).then(function(res) {
        expect(res.data).toEqual({
          message: "Login successful"
        });
        done();
      });
      httpMock.flush();
    });


    it("should get a users documents", function(done) {
      httpMock.expectGET('/api/user/2/documents').respond({
        message: "user documents found"
      });
      UserService.getUserDocuments(2).then(function(res) {
        expect(res.data).toEqual({
          message: "user documents found"
        });
        done();
      });
      httpMock.flush();
    });

  });

  describe("DocumentService", function() {
    it("should get documents", function(done) {
      httpMock.expectGET('/api/documents').respond({
        ownerId: 2,
        title: "The one and only",
        content: "The first person to ever think that I could be something"
      });
      DocumentService.getAllDocuments().then(function(doc) {
        expect(doc.data.title).toEqual("The one and only");
        done();
      });
      httpMock.flush();
    });

    it("should create documents", function(done) {
      var newDoc = null;
      var token = localStorage.getItem("userToken");
      httpMock.expectPOST('/api/documents?token=' + token).respond({
        newDoc: {
          ownerId: 2,
          title: "The one and only",
          content: "The first person to ever think that I could be something"
        }
      });
      DocumentService.createDocument(newDoc).then(function(doc) {
        expect(doc.data.newDoc.title).toEqual("The one and only");
        done();
      });
      httpMock.flush();
    });

    it("should get a document", function(done) {
      httpMock.expectGET('/api/document/2').respond({
        ownerId: 2,
        title: "The one and only",
        content: "The first person to ever think that I could be something"
      });
      DocumentService.getDocumentById(2).then(function(doc) {
        expect(doc.data.title).toEqual("The one and only");
        done();
      });
      httpMock.flush();
    });

    it("should update a document", function(done) {
      var token = localStorage.getItem("userToken");
      var updatedDoc = null;
      httpMock.expectPUT('/api/document/2?token=' + token).respond({
        updatedDoc: {
          ownerId: 2,
          title: "The one and only",
          content: "The first person to ever think that I could be something"
        }
      });
      DocumentService.updateDocument(updatedDoc, 2).then(function(doc) {
        expect(doc.data.updatedDoc).toEqual({
          ownerId: 2,
          title: "The one and only",
          content: "The first person to ever think that I could be something"
        });
        done();
      });
      httpMock.flush();
    });

    it("should delete a document", function(done) {
      httpMock.expectDELETE('/api/document/2').respond({
        message: "document has been deleted"
      });
      DocumentService.deleteDocument(2).then(function(doc) {
        expect(doc.data).toEqual({
          message: "document has been deleted"
        });
        done();
      });
      httpMock.flush();
    });
  });
});
