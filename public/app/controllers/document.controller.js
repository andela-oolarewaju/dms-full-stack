"use strict";
angular.module("mainApp")
  .controller("docCtrl", ["$scope", "$rootScope", "$mdBottomSheet", "$mdDialog", "$state", "$window", "$stateParams", "UserService", "DocumentService", "$location", function($scope, $rootScope, $mdBottomSheet, $mdDialog, $state, $window, $stateParams, UserService, DocumentService, $location) {
    //function to get all documents
    $scope.getDocuments = function() {
      UserService.decodeUser();
      UserService.getUserDocuments($stateParams.userId).then(function(docs) {
        console.log("dokiye", docs);
        $scope.userDocs = docs.data;
      });
    };
    //function to trigger the edit document state
    $scope.getCurrentDocument = function(documents) {
      $state.go("nav.editDocument", {
        id: documents._id
      });
    };
    //function to trigger the doc details state
    $scope.getDocDetails = function(docs) {
      $state.go("nav.docDetails", {
        id: docs._id
      });
    };
    //get a document information
    $scope.showDocDetails = function() {
      DocumentService.getDocumentById($stateParams.id).then(function(doc) {
        $scope.doc = doc.data[0];
      });
    };
    //create a document
    $scope.createDocument = function(doc) {
      $scope.docCreated = false;
      DocumentService.createDocument(doc).then(function() {
        $scope.docCreated = true;
        $location.url("/nav/userdocuments");
      });
    };
    //remove the token and logout
    $scope.logout = function() {
      localStorage.removeItem("userToken");
      $location.url("/landing");
    };
    //delete a document then get the updated list of documents
    $scope.deleteDocument = function(documentId) {
      DocumentService.deleteDocument(documentId).then(function(docs) {
        $scope.docDeleted = docs.data;
        UserService.getUserDocuments($rootScope.userId).then(function(docs) {
          $scope.userDocs = docs.data;
        });
      });
    };
    //update a document by id
    $scope.updateDocument = function(docDetails, docId) {
      $scope.docUpdated = false;
      DocumentService.updateDocument(docDetails, docId).then(function(data) {
        if (data) {
          $scope.docUpdated = true;
          $scope.docInfo = data;
          $location.url("/nav/userdocuments");
        } else {
          $scope.docUpdated = false;
        }
      });
    };
    //dialog to confirm deleting a document
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
