"use strict";
angular.module("mainApp")
  .factory("UserService", ["$http", "$rootScope", function($http, $rootScope) {

    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output);
    }

    return {

      getAllUsers: function() {
        return $http.get("/api/users");
      },

      login: function(param) {
        return $http.post("/api/user/" + "login", param);
      },

      createUser: function(userData) {
        return $http.post("/api/users", userData);
      },

      decodeUser: function() {
        if (localStorage.getItem("userToken")) {
          var token = localStorage.getItem("userToken");
          var user = {};
          if (token) {
            var encoded = token.split(".")[1];
            user = JSON.parse(urlBase64Decode(encoded));
            $rootScope.userId = user._id;
          }
        }
      },
      deleteUser: function() {
        var token = localStorage.getItem("userToken");
        return $http.delete("/api/useroflife/?token=" + token);
      },

      updateUser: function(userObj) {
        var token = localStorage.getItem("userToken");
        return $http.put("/api/useroflife/?token=" + token, userObj);
      },

      getUserDocuments: function(userId) {
        return $http.get("/api/user/" + userId + "/documents");
      },

      getCurrentUser: function() {
        var token = localStorage.getItem("userToken");
        return $http.get("/api/useroflife/?token=" + token);
      }
    };

  }]);
