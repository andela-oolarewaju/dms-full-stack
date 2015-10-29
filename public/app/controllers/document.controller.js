"use strict";
angular.module("mainApp")
  .controller("docCtrl", ["$scope", "$rootScope", "$mdBottomSheet", "$mdDialog", "$state", "$window", "$stateParams", "UserService", "DocumentService", "$location", function($scope, $rootScope, $mdBottomSheet, $mdDialog, $state, $window, $stateParams, UserService, DocumentService, $location) {

    $scope.getDocuments = function() {
      UserService.decodeUser();
      UserService.getUserDocuments($rootScope.userId).then(function(docs) {
        $scope.userDocs = docs.data;
        DocumentService.getDocumentById($stateParams.id).then(function(doc) {
          $scope.doc = doc.data[0];
        });
      });
    };

    $scope.getCurrentDocument = function(documents) {
      $state.go("editDocument", {
        id: documents._id
      });
      $scope.userDoc = documents;
    };

    $scope.createDocument = function(doc) {
      $scope.docCreated = false;
      DocumentService.createDocument(doc).then(function() {
        $scope.docCreated = true;
        $location.url("/userdocuments");
      });
    };

    $scope.logout = function() {
      localStorage.removeItem("userToken");
      $location.url("/landing");
    };

    $scope.deleteDocument = function(documentId) {
      DocumentService.deleteDocument(documentId).then(function(docs) {
        $scope.docDeleted = docs.data;
        UserService.getUserDocuments($rootScope.userId).then(function(docs) {
          $scope.userDocs = docs.data;
        });
      });
    };

    $scope.updateDocument = function(docDetails, docId) {
      $scope.docUpdated = false;
      DocumentService.updateDocument(docDetails, docId).then(function(data) {
        if (data) {
          $scope.docUpdated = true;
          $scope.docInfo = data;
          $location.url("/userdocuments");
        } else {
          $scope.docUpdated = false;
        }
      });
    };

    $scope.showConfirm = function(ev, id) {
      var confirm = $mdDialog.confirm()
        .title("Delete Document")
        .content("Are you sure you want to delete this document?.")
        .ariaLabel("Lucky day")
        .targetEvent(ev)
        .ok("Yes!")
        .cancel("No");
      $mdDialog.show(confirm).then(function() {
        $scope.deleteDocument(id);
      });
    };
  }]);
