"use strict";

describe("Document Manager System ", function() {
  var scope, homeCtrl, httpMock, userCtrl, docCtrl;

  beforeEach(module("mainApp"));

  describe("Home controller", function() {
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
      scope = $rootScope.$new();
      homeCtrl = $controller("homeCtrl", {
        $scope: scope
      });
      httpMock = _$httpBackend_;
    }));

    it("should login a user", function() {
      var userData = {
        username: "naruto",
        password: "naruto"
      };
      httpMock.expectPOST("/api/user/login", userData).respond({});
      scope.loginUser(userData);
      httpMock.flush();
      expect(scope.userDetails.username).toBe("naruto");
      expect(scope.response.status).toEqual(200);
      expect(scope.isLoggedIn).toEqual(true);
      expect(scope.progressLoad).toEqual(false);
    });

    it("should logout a user", function() {
      scope.logout();
      expect(scope.isLoggedIn).toEqual(false);
    });

    it("should sign up a new user", function() {
      var userData = {
        username: "naruto",
        name: {
          first: "tails",
          last: "uzumaki"
        },
        email: "naruto@gmail.com",
        password: "naruto"
      };
      httpMock.expectPOST("/api/users", userData).respond({});
      httpMock.expectPOST("/api/user/login", {
        username: userData.username,
        password: userData.password
      }).respond({});
      scope.signupUser(userData);
      expect(scope.userDetails).toBeUndefined();
      httpMock.flush();
      expect(scope.userDetails.username).toBe("naruto");
      expect(scope.isNewUser).toEqual(true);
      expect(scope.progressLoad).toEqual(false);
    });
  });

  describe("User controller", function() {
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
      scope = $rootScope.$new();
      userCtrl = $controller("userCtrl", {
        $scope: scope
      });
      httpMock = _$httpBackend_;
    }));

    it("should get user", function() {
      var token = localStorage.getItem("userToken");
      var userData = {
        _id: 2,
        username: "naruto",
        password: "naruto"
      };
      httpMock.expectGET("/api/user/" + userData._id + "?token=" + token).respond([{
        _id: 2,
        username: "naruto",
        password: "naruto"
      }]);
      scope.getUser(userData._id);
      expect(scope.user).toBeUndefined();
      httpMock.flush();
      expect(scope.user.username).toBe("naruto");
      expect(scope.userCount).toEqual(1);
    });

    it("should update a user profile", function() {
      var token = localStorage.getItem("userToken");
      var userData = {
        _id: 2,
        username: "naruto",
        password: "naruto"
      };
      var newData = {};
      httpMock.expectPUT("/api/user/" + userData._id + "?token=" + token).respond({
        newData: {
          _id: 2,
          username: "sakura",
          password: "naruto"
        }
      });
      scope.updateProfile(newData, userData._id);
      expect(scope.updatedUser).toBeUndefined();
      httpMock.flush();
      expect(scope.updatedUser).toBeDefined();
      expect(scope.updatedUser.data.newData.username).toBe("sakura");
    });

    it("should delete a user", function() {
      var token = localStorage.getItem("userToken");
      var userData = {
        _id: 2,
        username: "naruto",
        name: {
          first: "tails",
          last: "uzumaki"
        },
        email: "naruto@gmail.com",
        password: "naruto"
      };
      httpMock.expectDELETE("/api/user/" + userData._id + "?token=" + token).respond({
        message: "user deleted"
      });
      scope.deleteAccount(userData._id);
      expect(scope.response).toBeUndefined();
      httpMock.flush();
      expect(scope.response).toBeDefined();
      expect(scope.response.message).toBe("user deleted");
      expect(scope.deleted).toBe(true);
    });
  });

  describe("Document Controller", function() {
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
      scope = $rootScope.$new();
      docCtrl = $controller("docCtrl", {
        $scope: scope
      });
      httpMock = _$httpBackend_;
    }));



    it("should create a document", function() {
      httpMock.whenGET(/\.html$/).respond({
        success: true
      });
      var token = localStorage.getItem("userToken");
      var docInfo = {
        ownerId: 2,
        title: "naruto",
        content: "shipuden manga 247"
      };
      httpMock.expectPOST("/api/documents?token=" + token, docInfo).respond({});
      scope.createDocument(docInfo);
      expect(scope.docCreated).toBe(false);
      httpMock.flush();
      expect(scope.docCreated).toBe(true);
    });

    it("should update a document", function() {
      httpMock.whenGET(/\.html$/).respond({
        success: true
      });
      var token = localStorage.getItem("userToken");
      var docData = {
        _id: 3,
        ownerId: 2,
        title: "naruto",
        content: "manga 244 on repeat"
      };
      var newData = {};
      httpMock.expectPUT("/api/document/undefined?token=" + token).respond({
        newData: {
          _id: 3,
          ownerId: 2,
          title: "death note",
          content: "episode 38"
        }
      });
      scope.updateDocument(docData);
      expect(scope.docUpdated).toBe(false);
      httpMock.flush();
      expect(scope.docUpdated).toBe(true);
      expect(scope.docInfo.data.newData.title).toBe("death note");
    });

  });

});
