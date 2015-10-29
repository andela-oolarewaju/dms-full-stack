"use strict";
angular.module("mainApp")
  .controller("userCtrl", ["$scope", "$stateParams", "$window", "$mdDialog", "$rootScope", "$location", "UserService", function($scope, $stateParams, $window, $mdDialog, $rootScope, $location, UserService) {

    $scope.getUser = function(id) {
      $scope.userCount = 0;
      UserService.getCurrentUser(id).then(function(res) {
        if (res) {
          $scope.userCount = 1;
          $scope.user = res.data[0];
        }
      });
    };

    $scope.logout = function() {
      localStorage.removeItem("userToken");
      $location.url("/landing");
    };

    $scope.updateProfile = function(newDetails, id) {
      $scope.userUpdated = false;
      UserService.updateUser(newDetails, id).then(function(data) {
        if (data) {
          $scope.updatedUser = data;
          $scope.userUpdated = true;
          $location.url("/userdocuments");
        } else {
          $scope.userUpdated = false;
        }
      });
    };

    $scope.deleteAccount = function(id) {
      $scope.deleted = false;
      UserService.deleteUser(id).then(function(res) {
        $scope.deleted = true;
        $scope.response = res.data;
        localStorage.removeItem("userToken");
        $location.url("/landing");
      });
    };

    $scope.showConfirmDelete = function(ev, id) {
      var confirm = $mdDialog.confirm()
        .title("Deactivate Account")
        .content("Are you sure you want to deactivate your account.")
        .ariaLabel("Lucky day")
        .targetEvent(ev)
        .ok("Yes!")
        .cancel("No");
      $mdDialog.show(confirm).then(function() {
        $scope.deleteAccount(id);
      });
    };

  }]);
