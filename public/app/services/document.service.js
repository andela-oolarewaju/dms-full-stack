"use strict";
angular.module("mainApp")
  .factory("DocumentService", ["$http", function($http) {

    return {
      getAllDocuments: function() {
        return $http.get("/api/documents");
      },

      createDocument: function(docData) {
        var token = localStorage.getItem("userToken");
        return $http.post("/api/documents?token=" + token, docData);
      },

      deleteDocument: function(id) {
        return $http.delete("/api/document/" + id);
      },

      updateDocument: function(docObj, id) {
        var token = localStorage.getItem("userToken");
        return $http.put("/api/document/" + id + "?token=" + token, docObj);
      },

      getDocumentById: function(id) {
        return $http.get("/api/document/" + id);
      }
    };

  }]);
