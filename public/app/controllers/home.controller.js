"use strict";
angular.module("mainApp")
  .controller("homeCtrl", ["$scope", "$location", "$mdToast", "$stateParams", "DocumentService", "UserService", function($scope, $location, $mdToast, $stateParams, DocumentService, UserService) {
    //login a user
    $scope.loginUser = function(userData) {
      UserService.login(userData).then(function(res) {
        $scope.progressLoad = true;
        $scope.isLoggedIn = false;
        if (res.data.message === "authentication failed, user not found") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else if (res.data.message === "authentication failed, wrong password") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else {
          //set token in localstorage
          localStorage.setItem("userToken", res.data.token);
          if (localStorage.getItem("userToken")) {
            $scope.userDetails = userData;
            $scope.response = res;
            $scope.progressLoad = false;
            $scope.isLoggedIn = true;
            $scope.userInformation = res.data.user;
            $location.url("/nav/userdocuments");

          }
        }
      });
    };
    //remove token and go to login page
    $scope.logout = function() {
      $scope.isLoggedIn = true;
      localStorage.removeItem("userToken");
      if (localStorage.getItem("userToken")) {
        $scope.isLoggedIn = true;
      } else {
        $scope.isLoggedIn = false;
        $location.url("/landing");
      }
    };
    //create a new user
    $scope.signupUser = function(newUser) {
      $scope.progressLoad = true;
      $scope.isNewUser = false;
      UserService.createUser(newUser).then(function(res) {
        if (res.data.message === "user name taken") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username already exists")
            .hideDelay(3000)
          );

        } else if (res.data.message === "Check parameters!") {
          $mdToast.show(
            $mdToast.simple()
            .content("Invalid email format")
            .hideDelay(3000)
          );
        } else {
          $scope.userDetails = res;
          $scope.progressLoad = false;
          $scope.isNewUser = true;
          $mdToast.show(
            $mdToast.simple()
            .content("Welcome to DMS!")
            .hideDelay(3000)
          );
          //sign in new user
          $scope.loginUser({
            username: newUser.username,
            password: newUser.password
          });
        }
      });
    };

  }]);
